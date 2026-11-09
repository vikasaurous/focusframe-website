/**
 * snakeEngine.ts
 *
 * Source reference:
 *   FocusFrame Extension repository: src/snake/snakeEngine.js
 *   https://github.com/vikasaurous/FocusFrame/blob/main/src/snake/snakeEngine.js
 *
 * Pure-logic Snake engine for the FocusFrame year-dot calendar.
 * No DOM access -- fully testable in Node.js / Vitest.
 *
 * Behaviour
 *   - Starts at a RANDOM walkable cell (not always the same corner).
 *   - Wanders like a real snake: keeps going straight most of the time,
 *     prefers uneaten neighbours, and when none are adjacent it heads
 *     toward the nearest uneaten dot (BFS), so a full cycle always ends.
 *   - Never overlaps its own body and never leaves walkable cells
 *     (index < walkableCount, i.e. finished days only).
 *   - If boxed in by its own body it reverses (head <-> tail).
 *   - Eaten dots are passable; only the snake body blocks.
 *
 * Grid: row-major, `cols` columns. Cell i -> row floor(i/cols), col i%cols.
 */

export interface SnakeEngineOptions {
  cols: number;
  walkableCount: number;
  rng?: () => number;
}

export interface StepResult {
  moved: boolean;
  head: number | null;
  tail: number | null;
  eatenAdded: boolean;
  stuck: boolean;
  cycleComplete: boolean;
  reversed: boolean;
}

export interface SnakeEngine {
  step: () => StepResult;
  updateWalkable: (newCount: number) => void;
  reset: (newCols: number, newWalkableCount: number) => void;
  getBody: () => number[];
  getEaten: () => Set<number>;
  isStuck: () => boolean;
  isComplete: () => boolean;
}

const INITIAL_LENGTH = 3;
const MAX_LENGTH = 10;
const STRAIGHT_BIAS = 0.65; // chance to keep heading straight when possible
const STEP_CAP_MULT = 30; // safety: give up a cycle after wc * 30 steps

export function createSnake(opts: SnakeEngineOptions): SnakeEngine {
  let _cols = opts.cols;
  let _wc = opts.walkableCount;
  const _rng = typeof opts.rng === "function" ? opts.rng : Math.random;

  let _body: number[] = []; // head first
  let _bodySet = new Set<number>();
  let _eaten = new Set<number>();
  let _pendingGrowth = 0;
  let _complete = false;
  let _stuck = false;
  let _dir = 0; // last delta: -1, +1, -cols, +cols
  let _steps = 0;

  // ---- helpers ----------------------------------------------------

  function _rand(n: number): number {
    const v = Math.floor(_rng() * n);
    return v >= n ? n - 1 : v;
  }

  function _shuffle(arr: number[]): number[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = _rand(i + 1);
      const t = arr[i]!;
      arr[i] = arr[j]!;
      arr[j] = t;
    }
    return arr;
  }

  /** Walkable orthogonal neighbours of cell i (body not considered). */
  function _neighbors(i: number): number[] {
    const out: number[] = [];
    const c = i % _cols;
    if (c > 0 && i - 1 >= 0) out.push(i - 1);
    if (c < _cols - 1 && i + 1 < _wc) out.push(i + 1);
    if (i - _cols >= 0) out.push(i - _cols);
    if (i + _cols < _wc) out.push(i + _cols);
    return out;
  }

  function _isFree(n: number): boolean {
    return !_bodySet.has(n);
  }

  /** Number of free (non-body) neighbours of n. */
  function _onward(n: number): number {
    const ns = _neighbors(n);
    let k = 0;
    for (let i = 0; i < ns.length; i++) {
      const neighbor = ns[i];
      if (neighbor !== undefined && _isFree(neighbor)) k++;
    }
    return k;
  }

  /**
   * BFS from the head across non-body walkable cells to the nearest
   * uneaten cell. Returns the FIRST step cell, or null if unreachable.
   */
  function _towardUneaten(): number | null {
    const head = _body[0];
    if (head === undefined) return null;
    const prev = new Map<number, number>();
    const queue: number[] = [head];
    let qi = 0;
    prev.set(head, -1);
    while (qi < queue.length) {
      const cur = queue[qi++];
      if (cur === undefined) continue;
      const ns = _shuffle(_neighbors(cur));
      for (let i = 0; i < ns.length; i++) {
        const n = ns[i];
        if (n === undefined || prev.has(n) || _bodySet.has(n)) continue;
        prev.set(n, cur);
        if (!_eaten.has(n)) {
          let s = n;
          while (prev.get(s) !== head) {
            const nextP = prev.get(s);
            if (nextP === undefined) break;
            s = nextP;
          }
          return s;
        }
        queue.push(n);
      }
    }
    return null;
  }

  /** Choose the next head cell, or null when boxed in. */
  function _pickNext(): number | null {
    const head = _body[0];
    if (head === undefined) return null;
    const free: number[] = [];
    const ns = _neighbors(head);
    for (let i = 0; i < ns.length; i++) {
      const neighbor = ns[i];
      if (neighbor !== undefined && _isFree(neighbor)) free.push(neighbor);
    }
    if (free.length === 0) return null;

    let pool: number[] = [];
    for (let a = 0; a < free.length; a++) {
      const candidate = free[a];
      if (candidate !== undefined && !_eaten.has(candidate)) pool.push(candidate);
    }

    if (pool.length === 0) {
      const t = _towardUneaten();
      pool = t !== null ? [t] : free;
    }

    // Avoid dead ends when a safer option exists.
    const safe: number[] = [];
    for (let b = 0; b < pool.length; b++) {
      const candidate = pool[b];
      if (candidate !== undefined && _onward(candidate) > 0) safe.push(candidate);
    }
    if (safe.length > 0) pool = safe;

    // Keep going straight most of the time.
    if (_dir !== 0 && pool.length > 1) {
      for (let c = 0; c < pool.length; c++) {
        const candidate = pool[c];
        if (candidate !== undefined && candidate - head === _dir && _rng() < STRAIGHT_BIAS) {
          return candidate;
        }
      }
    }
    const chosen = pool[_rand(pool.length)];
    return chosen !== undefined ? chosen : null;
  }

  function _reverseBody(): void {
    _body.reverse();
    _dir = 0;
  }

  // ---- init ---------------------------------------------------------

  function _init(): void {
    _body = [];
    _bodySet = new Set<number>();
    _eaten = new Set<number>();
    _pendingGrowth = 0;
    _complete = false;
    _stuck = false;
    _dir = 0;
    _steps = 0;

    if (_wc <= 0 || _cols <= 0) {
      _complete = true;
      return;
    }

    const start = _rand(_wc);
    _body.push(start);
    _bodySet.add(start);
    _eaten.add(start);
    _pendingGrowth = Math.min(INITIAL_LENGTH, _wc) - 1;
    if (_eaten.size >= _wc) _complete = true;
  }

  _init();

  // ---- step ---------------------------------------------------------

  /**
   * Advance one cell.
   * Returns { moved, head, tail, eatenAdded, stuck, cycleComplete, reversed }
   *   tail is the freed cell, or null while growing.
   */
  function step(): StepResult {
    if (_complete || _body.length === 0) {
      return {
        moved: false,
        head: _body.length > 0 ? (_body[0] ?? null) : null,
        tail: null,
        eatenAdded: false,
        stuck: _stuck,
        cycleComplete: true,
        reversed: false,
      };
    }

    let reversed = false;
    let next = _pickNext();
    if (next === null) {
      _reverseBody();
      reversed = true;
      next = _pickNext();
      // Still boxed in (coiled in a tight spot): shorten from the tail
      // until a move opens up. Rare; keeps the cycle from dying early.
      while (next === null && _body.length > 1) {
        const popped = _body.pop();
        if (popped !== undefined) _bodySet.delete(popped);
        next = _pickNext();
      }
      if (next === null) {
        _complete = true;
        _stuck = true;
        return {
          moved: false,
          head: _body[0] ?? null,
          tail: null,
          eatenAdded: false,
          stuck: true,
          cycleComplete: true,
          reversed: true,
        };
      }
    }

    const head = _body[0]!;
    const eatenAdded = !_eaten.has(next);
    if (eatenAdded) {
      _eaten.add(next);
      if (_body.length + _pendingGrowth < MAX_LENGTH) _pendingGrowth++;
    }

    let freedTail: number | null = null;
    if (_pendingGrowth > 0) {
      _pendingGrowth--;
    } else {
      const popped = _body.pop();
      if (popped !== undefined) {
        freedTail = popped;
        _bodySet.delete(freedTail);
      }
    }
    _body.unshift(next);
    _bodySet.add(next);
    _dir = next - head;
    _steps++;

    if (_eaten.size >= _wc || _steps > _wc * STEP_CAP_MULT) _complete = true;

    return {
      moved: true,
      head: next,
      tail: freedTail,
      eatenAdded: eatenAdded,
      stuck: false,
      cycleComplete: _complete,
      reversed: reversed,
    };
  }

  // ---- updateWalkable -------------------------------------------------

  /** Midnight: a new day finished, so one more cell becomes walkable. */
  function updateWalkable(newCount: number): void {
    if (newCount <= _wc) return;
    _wc = newCount;
    if (_body.length === 0) {
      _init();
      return;
    }
    if (_complete && !_stuck && _eaten.size < _wc) {
      _complete = false;
      _steps = 0;
    }
  }

  // ---- reset ----------------------------------------------------------

  function reset(newCols: number, newWalkableCount: number): void {
    _cols = newCols;
    _wc = newWalkableCount;
    _init();
  }

  function getBody(): number[] {
    return _body.slice();
  }

  function getEaten(): Set<number> {
    return new Set(_eaten);
  }

  function isStuck(): boolean {
    return _stuck;
  }

  function isComplete(): boolean {
    return _complete;
  }

  return {
    step,
    updateWalkable,
    reset,
    getBody,
    getEaten,
    isStuck,
    isComplete,
  };
}

export const SnakeEngine = { createSnake };
