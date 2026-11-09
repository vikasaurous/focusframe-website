/**
 * snakeRenderer.ts
 *
 * Source reference:
 *   FocusFrame Extension repository: src/snake/snakeRenderer.js
 *   https://github.com/vikasaurous/FocusFrame/blob/main/src/snake/snakeRenderer.js
 *
 * React-compatible rendering adapter and hook for the FocusFrame year-dot calendar snake.
 * Preserves the exact visual treatment and timing of the extension renderer:
 *   - Smooth SVG curves (quadratic bezier polyline with rounded caps and joins)
 *   - Circular snake head
 *   - Tapered tail (main body 80%, tail-1 60%, tail-2 40% of dot diameter)
 *   - Eaten dots faded to 0.18 opacity and scaled to 0.7
 *   - Color follows FocusFrame coral accent (--primary / stroke-primary / fill-primary)
 *   - Extension timing: Slow 220ms, Medium 140ms, Fast 90ms, Regrow delay 1500ms
 *   - Visibility lifecycle: pause on tab hidden, resume on visible
 *   - Accessibility: prefers-reduced-motion renders static snake, no tick loop
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createSnake, type SnakeEngine } from "./snakeEngine";

export const COLS = 26;
export const ROWS = 15;
export const GAP = 10;
export const REGROW_DELAY = 1500;

export const SNAKE_SPEEDS = {
  Slow: 220,
  Medium: 140,
  Fast: 90,
} as const;

export type SnakeSpeed = keyof typeof SNAKE_SPEEDS;

export interface Point {
  x: number;
  y: number;
}

export function getDotCenter(index: number, cols = COLS, gap = GAP): Point {
  const col = index % cols;
  const row = Math.floor(index / cols);
  return {
    x: col * gap + gap / 2,
    y: row * gap + gap / 2,
  };
}

function fmt(n: number): string {
  return n.toFixed(1);
}

function mid(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/**
 * Smooth polyline through cell centers: straight runs, rounded bends.
 * Exact algorithm from FocusFrame snakeRenderer.js _smoothPath.
 */
export function buildSmoothPath(pts: Point[]): string {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) {
    const p0 = pts[0]!;
    return `M ${fmt(p0.x)} ${fmt(p0.y)} L ${fmt(p0.x)} ${fmt(p0.y)}`;
  }
  if (n === 2) {
    const p0 = pts[0]!;
    const p1 = pts[1]!;
    return `M ${fmt(p0.x)} ${fmt(p0.y)} L ${fmt(p1.x)} ${fmt(p1.y)}`;
  }
  const m = mid(pts[0]!, pts[1]!);
  let d = `M ${fmt(pts[0]!.x)} ${fmt(pts[0]!.y)} L ${fmt(m.x)} ${fmt(m.y)}`;
  for (let k = 1; k < n - 1; k++) {
    const mm = mid(pts[k]!, pts[k + 1]!);
    d += ` Q ${fmt(pts[k]!.x)} ${fmt(pts[k]!.y)} ${fmt(mm.x)} ${fmt(mm.y)}`;
  }
  d += ` L ${fmt(pts[n - 1]!.x)} ${fmt(pts[n - 1]!.y)}`;
  return d;
}

/**
 * Computes calendar day information matching the FocusFrame extension.
 * Local calendar date, 26 columns, completed days strictly before today.
 */
export function getCalendarYearInfo(now: Date = new Date()) {
  const year = now.getFullYear();
  const yearStart = new Date(year, 0, 1);
  const nextYearStart = new Date(year + 1, 0, 1);
  const daysInYear = Math.round((nextYearStart.getTime() - yearStart.getTime()) / 86400000);
  // 1-indexed day of year using local time matching extension newtab.js
  const dayOfYear = Math.floor((now.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
  // Completed days only; today is excluded
  const walkableCount = Math.max(0, dayOfYear - 1);
  const todayIndex = dayOfYear - 1;
  const daysLeft = Math.max(0, daysInYear - dayOfYear);

  const midnight = new Date(year, now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
  const hh = String(Math.floor(midnight / 36e5)).padStart(2, "0");
  const mm = String(Math.floor((midnight % 36e5) / 6e4)).padStart(2, "0");
  const ss = String(Math.floor((midnight % 6e4) / 1e3)).padStart(2, "0");

  return {
    year,
    daysInYear,
    dayOfYear,
    walkableCount,
    todayIndex,
    daysLeft,
    countdown: `${hh}:${mm}:${ss}`,
  };
}

export interface UseSnakeCalendarOptions {
  walkableCount: number;
  initialSpeed?: SnakeSpeed;
  initialRunning?: boolean;
  regrow?: boolean;
}

export function useSnakeCalendar({
  walkableCount,
  initialSpeed = "Medium",
  initialRunning = true,
  regrow = true,
}: UseSnakeCalendarOptions) {
  const [speed, setSpeedState] = useState<SnakeSpeed>(initialSpeed);
  const [running, setRunningState] = useState<boolean>(initialRunning);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [renderState, setRenderState] = useState<{
    body: number[];
    eaten: Set<number>;
  }>({
    body: [],
    eaten: new Set(),
  });

  const engineRef = useRef<SnakeEngine | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef<"tick" | "restart" | "rest">("tick");
  const speedRef = useRef<SnakeSpeed>(speed);
  speedRef.current = speed;
  const runningRef = useRef<boolean>(running);
  runningRef.current = running;
  const regrowRef = useRef<boolean>(regrow);
  regrowRef.current = regrow;
  const walkableCountRef = useRef<number>(walkableCount);
  walkableCountRef.current = walkableCount;
  const hiddenRef = useRef<boolean>(false);
  const reducedMotionRef = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [, setResizeCount] = useState<number>(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const schedule = useCallback((ms: number, fn: () => void) => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(fn, ms);
  }, []);

  const afterComplete = useCallback(() => {
    if (!runningRef.current || hiddenRef.current || reducedMotionRef.current) return;
    if (!engineRef.current) return;

    if (regrowRef.current) {
      engineRef.current.reset(COLS, walkableCountRef.current);
      setRenderState({
        body: engineRef.current.getBody(),
        eaten: engineRef.current.getEaten(),
      });
      phaseRef.current = "tick";
      schedule(SNAKE_SPEEDS[speedRef.current], tick);
    } else {
      phaseRef.current = "rest";
      setRenderState((prev) => ({
        ...prev,
        body: [],
      }));
    }
  }, [schedule]); // eslint-disable-line react-hooks/exhaustive-deps

  const tick = useCallback(() => {
    if (!runningRef.current || hiddenRef.current || reducedMotionRef.current) return;
    if (phaseRef.current !== "tick" || !engineRef.current) return;

    const result = engineRef.current.step();
    setRenderState({
      body: engineRef.current.getBody(),
      eaten: engineRef.current.getEaten(),
    });

    if (result.cycleComplete) {
      phaseRef.current = "restart";
      schedule(REGROW_DELAY, afterComplete);
      return;
    }

    schedule(SNAKE_SPEEDS[speedRef.current], tick);
  }, [schedule, afterComplete]);

  // Initial engine setup
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = createSnake({
        cols: COLS,
        walkableCount,
      });
      setRenderState({
        body: engineRef.current.getBody(),
        eaten: engineRef.current.getEaten(),
      });
    }
  }, [walkableCount]);

  // Handle midnight / walkable count increase without resetting engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateWalkable(walkableCount);
      if (
        !reducedMotionRef.current &&
        phaseRef.current !== "tick" &&
        !engineRef.current.isComplete()
      ) {
        phaseRef.current = "tick";
        if (runningRef.current && !hiddenRef.current) {
          schedule(SNAKE_SPEEDS[speedRef.current], tick);
        }
      }
    }
  }, [walkableCount, schedule, tick]);

  // Run loop on mount if enabled
  useEffect(() => {
    if (runningRef.current && !hiddenRef.current && !reducedMotionRef.current) {
      schedule(SNAKE_SPEEDS[speedRef.current], tick);
    }
    return () => {
      clearTimer();
    };
  }, [schedule, tick, clearTimer]);

  // Tab visibility change
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        hiddenRef.current = true;
        clearTimer();
      } else {
        hiddenRef.current = false;
        if (runningRef.current && !reducedMotionRef.current) {
          if (phaseRef.current === "tick") {
            schedule(SNAKE_SPEEDS[speedRef.current], tick);
          } else if (phaseRef.current === "restart") {
            schedule(REGROW_DELAY, afterComplete);
          }
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [clearTimer, schedule, tick, afterComplete]);

  // Reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = (matches: boolean) => {
      reducedMotionRef.current = matches;
      setReducedMotion(matches);
      if (matches) {
        clearTimer();
        phaseRef.current = "rest";
      } else {
        if (runningRef.current && !hiddenRef.current) {
          phaseRef.current = "tick";
          schedule(SNAKE_SPEEDS[speedRef.current], tick);
        }
      }
    };
    updateMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => updateMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => {
      mq.removeEventListener("change", handler);
    };
  }, [clearTimer, schedule, tick]);

  // Resize observer to handle layout changes without resetting the engine
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        setResizeCount((c) => c + 1);
      });
      ro.observe(el);
      return () => ro.disconnect();
    } else {
      const onResize = () => setResizeCount((c) => c + 1);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
  }, []);

  // Control actions
  const changeSpeed = useCallback(
    (newSpeed: SnakeSpeed) => {
      setSpeedState(newSpeed);
      speedRef.current = newSpeed;
      if (
        runningRef.current &&
        !hiddenRef.current &&
        !reducedMotionRef.current &&
        phaseRef.current === "tick"
      ) {
        clearTimer();
        schedule(SNAKE_SPEEDS[newSpeed], tick);
      }
    },
    [clearTimer, schedule, tick],
  );

  const toggleAnimate = useCallback(() => {
    setRunningState((prev) => {
      const next = !prev;
      runningRef.current = next;
      if (!next) {
        clearTimer();
      } else {
        if (!hiddenRef.current && !reducedMotionRef.current) {
          if (phaseRef.current === "tick") {
            schedule(SNAKE_SPEEDS[speedRef.current], tick);
          } else if (phaseRef.current === "restart") {
            schedule(REGROW_DELAY, afterComplete);
          } else if (phaseRef.current === "rest") {
            if (regrowRef.current && engineRef.current) {
              engineRef.current.reset(COLS, walkableCountRef.current);
              setRenderState({
                body: engineRef.current.getBody(),
                eaten: engineRef.current.getEaten(),
              });
              phaseRef.current = "tick";
              schedule(SNAKE_SPEEDS[speedRef.current], tick);
            }
          }
        }
      }
      return next;
    });
  }, [clearTimer, schedule, tick, afterComplete]);

  const regrowNow = useCallback(() => {
    clearTimer();
    if (!engineRef.current) return;
    engineRef.current.reset(COLS, walkableCountRef.current);
    setRenderState({
      body: engineRef.current.getBody(),
      eaten: engineRef.current.getEaten(),
    });
    phaseRef.current = "tick";
    if (runningRef.current && !hiddenRef.current && !reducedMotionRef.current) {
      schedule(SNAKE_SPEEDS[speedRef.current], tick);
    }
  }, [clearTimer, schedule, tick]);

  // Build SVG segments
  const len = renderState.body.length;
  const mainEnd = Math.max(0, len - 3);
  const bodyIndices = len > 0 ? renderState.body.slice(0, mainEnd + 1) : [];
  const tail1Indices = len >= 3 ? [renderState.body[len - 3]!, renderState.body[len - 2]!] : [];
  const tail2Indices = len >= 2 ? [renderState.body[len - 2]!, renderState.body[len - 1]!] : [];

  const bodyPath = buildSmoothPath(bodyIndices.map((i) => getDotCenter(i)));
  const tail1Path = buildSmoothPath(tail1Indices.map((i) => getDotCenter(i)));
  const tail2Path = buildSmoothPath(tail2Indices.map((i) => getDotCenter(i)));
  const head =
    len > 0 && renderState.body[0] !== undefined ? getDotCenter(renderState.body[0]!) : null;

  return {
    speed,
    running,
    reducedMotion,
    body: renderState.body,
    eaten: renderState.eaten,
    bodyPath,
    tail1Path,
    tail2Path,
    head,
    containerRef,
    changeSpeed,
    toggleAnimate,
    regrowNow,
  };
}
