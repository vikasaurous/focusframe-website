import { describe, it, expect } from "vitest";
import { createSnake, type SnakeEngine } from "../lib/focusframe/snakeEngine";

const COLS = 26;

function seededRng(seed: number) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

function adjacent(a: number, b: number) {
  const d =
    Math.abs(Math.floor(a / COLS) - Math.floor(b / COLS)) + Math.abs((a % COLS) - (b % COLS));
  return d === 1;
}

/** Body invariants: in range, no overlap, max length, consecutive cells adjacent. */
function assertBody(snake: SnakeEngine, wc: number, label: string) {
  const body = snake.getBody();
  expect(body.length, `${label}: body longer than 10`).toBeLessThanOrEqual(10);
  expect(new Set(body).size, `${label}: body overlaps itself`).toBe(body.length);
  for (let i = 0; i < body.length; i++) {
    const cell = body[i]!;
    expect(cell >= 0 && cell < wc, `${label}: cell ${cell} outside [0, ${wc})`).toBe(true);
    if (i < body.length - 1) {
      const nextCell = body[i + 1]!;
      expect(adjacent(cell, nextCell), `${label}: cells ${cell} and ${nextCell} not adjacent`).toBe(
        true,
      );
    }
  }
}

function runToEnd(snake: SnakeEngine, wc: number, label: string, cap = 20000) {
  let n = 0;
  while (!snake.isComplete() && n < cap) {
    const r = snake.step();
    n++;
    assertBody(snake, wc, `${label} step ${n}`);
    if (r.cycleComplete) break;
  }
  return n;
}

describe("FocusFrame Snake Engine", () => {
  it("walkableCount=0: complete immediately, no body", () => {
    const s = createSnake({ cols: COLS, walkableCount: 0, rng: seededRng(1) });
    expect(s.isComplete()).toBe(true);
    expect(s.getBody().length).toBe(0);
    const r = s.step();
    expect(r.cycleComplete).toBe(true);
    expect(r.moved).toBe(false);
    expect(r.head).toBeNull();
  });

  it("walkableCount=1: complete immediately on the single cell", () => {
    const s = createSnake({ cols: COLS, walkableCount: 1, rng: seededRng(1) });
    expect(s.getBody()).toEqual([0]);
    expect(s.isComplete()).toBe(true);
    expect(s.step().moved).toBe(false);
  });

  it("walkableCount=2: eats both cells then completes", () => {
    const s = createSnake({ cols: COLS, walkableCount: 2, rng: seededRng(5) });
    runToEnd(s, 2, "wc=2");
    expect(s.getEaten().size).toBe(2);
    expect(s.isComplete()).toBe(true);
  });

  it("start cell is random: different seeds give different starts", () => {
    const starts = new Set<number>();
    for (let seed = 1; seed <= 30; seed++) {
      const head = createSnake({
        cols: COLS,
        walkableCount: 296,
        rng: seededRng(seed),
      }).getBody()[0];
      if (head !== undefined) starts.add(head);
    }
    expect(starts.size, `only ${starts.size} distinct starts across 30 seeds`).toBeGreaterThan(10);
  });

  it("start cell is always walkable", () => {
    for (const wc of [1, 2, 3, 26, 27, 100, 296, 365]) {
      for (let seed = 1; seed <= 20; seed++) {
        const s = createSnake({
          cols: COLS,
          walkableCount: wc,
          rng: seededRng(seed),
        });
        const head = s.getBody()[0];
        expect(
          head !== undefined && head >= 0 && head < wc,
          `wc=${wc}: start ${head} out of range`,
        ).toBe(true);
      }
    }
  });

  it("invariants hold and cycle completes for many sizes and seeds", () => {
    const sizes = [3, 4, 5, 10, 25, 26, 27, 28, 52, 53, 100, 200, 296, 364, 365];
    for (const wc of sizes) {
      for (let seed = 1; seed <= 15; seed++) {
        const s = createSnake({
          cols: COLS,
          walkableCount: wc,
          rng: seededRng(seed * 13 + wc),
        });
        runToEnd(s, wc, `wc=${wc} seed=${seed}`);
        expect(s.isComplete(), `wc=${wc} seed=${seed}: not complete`).toBe(true);
        expect(s.getEaten().size, `wc=${wc} seed=${seed}: eaten ${s.getEaten().size}`).toBe(wc);
      }
    }
  }, 30000);

  it("never steps onto future or today cells", () => {
    const wc = 100;
    const s = createSnake({ cols: COLS, walkableCount: wc, rng: seededRng(13) });
    let n = 0;
    while (!s.isComplete() && n++ < 5000) {
      const r = s.step();
      if (r.head !== null) {
        expect(r.head < wc, `head ${r.head} >= ${wc}`).toBe(true);
      }
    }
  });

  it("eatenAdded is true only on first visit to a cell", () => {
    const s = createSnake({ cols: COLS, walkableCount: 60, rng: seededRng(3) });
    const visited = new Set(s.getBody());
    let n = 0;
    while (!s.isComplete() && n++ < 5000) {
      const r = s.step();
      if (!r.moved || r.head === null) break;
      if (visited.has(r.head)) {
        expect(r.eatenAdded, `revisit of ${r.head} marked as eaten`).toBe(false);
      } else {
        expect(r.eatenAdded, `first visit of ${r.head} not marked as eaten`).toBe(true);
        visited.add(r.head);
      }
    }
  });

  it("snake grows to 10 and stays capped", () => {
    const s = createSnake({ cols: COLS, walkableCount: 296, rng: seededRng(17) });
    let max = 0;
    let n = 0;
    while (!s.isComplete() && n++ < 5000) {
      s.step();
      max = Math.max(max, s.getBody().length);
    }
    expect(max).toBe(10);
  });

  it("eaten set grows monotonically within a cycle", () => {
    const s = createSnake({ cols: COLS, walkableCount: 80, rng: seededRng(19) });
    let prev = s.getEaten().size;
    let n = 0;
    while (!s.isComplete() && n++ < 5000) {
      s.step();
      const size = s.getEaten().size;
      expect(size >= prev, "eaten set shrank").toBe(true);
      prev = size;
    }
  });

  it("thin last row (wc=27, one cell on row 2) still completes", () => {
    for (let seed = 1; seed <= 40; seed++) {
      const s = createSnake({
        cols: COLS,
        walkableCount: 27,
        rng: seededRng(seed),
      });
      runToEnd(s, 27, `wc=27 seed=${seed}`);
      expect(s.getEaten().size, `seed ${seed}: left cell 26 uneaten`).toBe(27);
    }
  });

  it("updateWalkable: re-opens a completed cycle when a new day appears", () => {
    const s = createSnake({ cols: COLS, walkableCount: 10, rng: seededRng(31) });
    runToEnd(s, 10, "phase 1");
    expect(s.isComplete()).toBe(true);
    s.updateWalkable(11);
    expect(s.isComplete(), "new walkable cell should re-open the cycle").toBe(false);
    runToEnd(s, 11, "phase 2");
    expect(s.getEaten().size).toBe(11);
  });

  it("updateWalkable: ignores equal or smaller counts", () => {
    const s = createSnake({ cols: COLS, walkableCount: 50, rng: seededRng(7) });
    const before = s.getBody();
    s.updateWalkable(50);
    s.updateWalkable(10);
    expect(s.getBody()).toEqual(before);
    expect(s.isComplete()).toBe(false);
  });

  it("updateWalkable from 0 starts a fresh snake", () => {
    const s = createSnake({ cols: COLS, walkableCount: 0, rng: seededRng(2) });
    expect(s.isComplete()).toBe(true);
    s.updateWalkable(5);
    expect(s.getBody().length >= 1).toBe(true);
    expect(s.isComplete()).toBe(false);
  });

  it("reset: clears state and respects the new size", () => {
    const s = createSnake({ cols: COLS, walkableCount: 50, rng: seededRng(23) });
    for (let i = 0; i < 100; i++) s.step();
    s.reset(10, 20);
    expect(s.isComplete()).toBe(false);
    expect(s.getEaten().size).toBe(1);
    for (const cell of s.getBody()) {
      expect(cell >= 0 && cell < 20).toBe(true);
    }
  });

  it("determinism: same seed gives same path", () => {
    const a = createSnake({ cols: COLS, walkableCount: 100, rng: seededRng(42) });
    const b = createSnake({ cols: COLS, walkableCount: 100, rng: seededRng(42) });
    expect(a.getBody()).toEqual(b.getBody());
    for (let i = 0; i < 80; i++) {
      const ra = a.step();
      const rb = b.step();
      expect(ra.head, `head mismatch at step ${i}`).toBe(rb.head);
    }
  });

  it("snake is not a raster sweep: it turns", () => {
    const s = createSnake({ cols: COLS, walkableCount: 296, rng: seededRng(8) });
    let turns = 0;
    let lastDelta: number | null = null;
    let n = 0;
    while (!s.isComplete() && n++ < 5000) {
      const head = s.getBody()[0];
      if (head === undefined) break;
      const before = head;
      const r = s.step();
      if (!r.moved || r.reversed || r.head === null) {
        lastDelta = null;
        continue;
      }
      const delta = r.head - before;
      if (lastDelta !== null && delta !== lastDelta) turns++;
      lastDelta = delta;
    }
    expect(turns, `only ${turns} turns`).toBeGreaterThan(20);
  });
});
