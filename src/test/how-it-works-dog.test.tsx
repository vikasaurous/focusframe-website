import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FinalCta, HowItWorks } from "@/components/ff/bottom";
import { CtaMascots, PixelDog } from "@/components/ff/ctaMascots";

const EXTENSION_DOG_COLORS = ["#eceef1", "#a7adb9", "#1b1d22", "#f6f7f9", "#3b3e46", "#c2c6cf"];

function getRectSnapshot(group: Element | null) {
  if (!group) return [];
  return Array.from(group.querySelectorAll("rect")).map((r) => ({
    x: r.getAttribute("x"),
    y: r.getAttribute("y"),
    fill: r.getAttribute("fill"),
  }));
}

describe("How It Works Step 03 extension dog", () => {
  const originalIO = globalThis.IntersectionObserver;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    vi.useFakeTimers();
    globalThis.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    globalThis.IntersectionObserver = originalIO;
    window.matchMedia = originalMatchMedia;
  });

  it("renders the exact extension dog in Step 03 without modifying Steps 01-02 or adding CTA elements", () => {
    const { container } = render(<HowItWorks />);

    const items = container.querySelectorAll("ol > li");
    expect(items).toHaveLength(3);

    const step1Svg = items[0]?.querySelector("svg");
    const step2Svg = items[1]?.querySelector("svg");
    const step3Svg = items[2]?.querySelector('svg[data-pet="dog"]');

    expect(step1Svg).toHaveAttribute("viewBox", "0 0 9 7");
    expect(step2Svg).toHaveAttribute("viewBox", "0 0 9 7");
    expect(step3Svg).toHaveAttribute("viewBox", "0 0 20 14");
    expect(step3Svg).toHaveAttribute("shape-rendering", "crispEdges");
    expect(step3Svg?.getAttribute("class")).toContain("h-10");

    // Step 03 contains only the dog (no boy/cat/bench/ground)
    expect(items[2]?.textContent).toContain("03");
    expect(items[2]?.textContent).toContain(
      "Set your intention, organize your day and make the space yours.",
    );
    expect(items[2]?.querySelectorAll("svg")).toHaveLength(1);

    const fills = new Set(
      Array.from(step3Svg?.querySelectorAll("rect") ?? [])
        .map((r) => r.getAttribute("fill"))
        .filter((f): f is string => Boolean(f) && f !== "transparent"),
    );
    for (const color of EXTENSION_DOG_COLORS) {
      expect(fills.has(color)).toBe(true);
    }
    expect(fills.has("var(--px-cat)")).toBe(false);
    expect(fills.has("var(--px-dog)")).toBe(false);
  });

  it("wags tail at 700 ms idle and 300 ms on hover while keeping the body stationary", () => {
    const { container } = render(<PixelDog />);
    const svg = container.querySelector('svg[data-pet="dog"]');
    expect(svg).not.toBeNull();

    const bodyGroup = svg?.querySelector('g[data-part="body"]') ?? null;
    const tailGroup = svg?.querySelector('g[data-part="tail"]') ?? null;

    const initialBody = getRectSnapshot(bodyGroup);
    const tailDown = getRectSnapshot(tailGroup);
    expect(initialBody.length).toBeGreaterThan(0);
    expect(tailDown).toHaveLength(6);

    // Not yet flipped before 700 ms
    act(() => {
      vi.advanceTimersByTime(699);
    });
    expect(getRectSnapshot(tailGroup)).toEqual(tailDown);
    expect(getRectSnapshot(bodyGroup)).toEqual(initialBody);

    // Flips at 700 ms idle
    act(() => {
      vi.advanceTimersByTime(1);
    });
    const tailUp = getRectSnapshot(tailGroup);
    expect(tailUp).toHaveLength(10);
    expect(tailUp).not.toEqual(tailDown);
    expect(getRectSnapshot(bodyGroup)).toEqual(initialBody);

    // Hover speeds up wagging to 300 ms
    fireEvent.pointerEnter(svg!);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(getRectSnapshot(tailGroup)).toEqual(tailDown);
    expect(getRectSnapshot(bodyGroup)).toEqual(initialBody);

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(getRectSnapshot(tailGroup)).toEqual(tailUp);
    expect(getRectSnapshot(bodyGroup)).toEqual(initialBody);

    // Leaving hover returns to 700 ms idle interval
    fireEvent.pointerLeave(svg!);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(getRectSnapshot(tailGroup)).toEqual(tailUp);

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(getRectSnapshot(tailGroup)).toEqual(tailDown);
    expect(getRectSnapshot(bodyGroup)).toEqual(initialBody);
  });

  it("stops tail animation when prefers-reduced-motion is enabled", () => {
    window.matchMedia = ((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;

    const { container } = render(<PixelDog />);
    const svg = container.querySelector('svg[data-pet="dog"]');
    const tailGroup = svg?.querySelector('g[data-part="tail"]') ?? null;
    const restingTail = getRectSnapshot(tailGroup);

    act(() => {
      vi.advanceTimersByTime(2100);
    });
    expect(getRectSnapshot(tailGroup)).toEqual(restingTail);

    fireEvent.pointerEnter(svg!);
    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(getRectSnapshot(tailGroup)).toEqual(restingTail);
  });

  it("preserves CtaMascots boy and cat appearance and behavior in FinalCta", () => {
    render(<FinalCta />);
    const ctaSvg = screen.getByRole("img", {
      name: "Pixel-art FocusFrame boy waving, a laptop under his arm, with his cat sitting beside him",
    });
    expect(ctaSvg).toHaveAttribute("viewBox", "0 0 46 45");
    expect(ctaSvg.querySelector('svg[data-pet="dog"]')).toBeNull();

    const { container } = render(<CtaMascots />);
    expect(container.querySelector('svg[data-pet="dog"]')).toBeNull();
  });
});
