import { describe, it, expect, beforeEach } from "vitest";
import {
  ACCENTS,
  ACCENT_STORAGE_KEY,
  applyAccentToDocument,
  DEFAULT_ACCENT,
  getAccentSnapshot,
  normalizeAccent,
  setGlobalAccent,
  subscribeAccent,
} from "../lib/theme";

describe("Theme Accent System", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-accent");
    document.documentElement.className = "";
    setGlobalAccent(DEFAULT_ACCENT);
  });

  it("normalizes alias names and falls back to default accent", () => {
    expect(normalizeAccent("coral")).toBe("coral");
    expect(normalizeAccent("cobalt")).toBe("cobalt");
    expect(normalizeAccent("blue")).toBe("cobalt");
    expect(normalizeAccent("moss")).toBe("moss");
    expect(normalizeAccent("green")).toBe("moss");
    expect(normalizeAccent("plum")).toBe("plum");
    expect(normalizeAccent("purple")).toBe("plum");
    expect(normalizeAccent("unknown-color")).toBe(DEFAULT_ACCENT);
  });

  it("defines four distinct centralized accent options", () => {
    expect(ACCENTS.map((a) => a.id)).toEqual(["coral", "cobalt", "moss", "plum"]);
    expect(ACCENTS.map((a) => a.label)).toEqual(["Coral", "Blue", "Green", "Purple"]);
  });

  it("applies accent to document dataset and class", () => {
    applyAccentToDocument("cobalt");
    expect(document.documentElement.dataset["accent"]).toBe("cobalt");
    expect(document.documentElement.classList.contains("accent-cobalt")).toBe(true);

    applyAccentToDocument("moss");
    expect(document.documentElement.dataset["accent"]).toBe("moss");
    expect(document.documentElement.classList.contains("accent-moss")).toBe(true);
    expect(document.documentElement.classList.contains("accent-cobalt")).toBe(false);
  });

  it("updates global accent and persists to localStorage", () => {
    setGlobalAccent("moss");
    expect(getAccentSnapshot()).toBe("moss");
    expect(localStorage.getItem(ACCENT_STORAGE_KEY)).toBe("moss");
    expect(document.documentElement.dataset["accent"]).toBe("moss");

    setGlobalAccent("purple"); // alias test
    expect(getAccentSnapshot()).toBe("plum");
    expect(localStorage.getItem(ACCENT_STORAGE_KEY)).toBe("plum");
    expect(document.documentElement.dataset["accent"]).toBe("plum");
  });

  it("notifies subscribers when accent changes", () => {
    let notified = 0;
    const unsubscribe = subscribeAccent(() => {
      notified += 1;
    });

    setGlobalAccent("cobalt");
    expect(notified).toBe(1);

    // Setting same accent should not re-notify
    setGlobalAccent("cobalt");
    expect(notified).toBe(1);

    setGlobalAccent("plum");
    expect(notified).toBe(2);

    unsubscribe();
    setGlobalAccent("coral");
    expect(notified).toBe(2);
  });
});

