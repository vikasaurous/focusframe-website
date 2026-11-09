import { useEffect, useSyncExternalStore } from "react";

export type AccentId = "coral" | "cobalt" | "moss" | "plum";

export interface AccentOption {
  id: AccentId;
  label: string;
  name: string;
  bgClass: string;
}

export const ACCENTS: readonly AccentOption[] = [
  { id: "coral", label: "Coral", name: "Coral", bgClass: "bg-coral" },
  { id: "cobalt", label: "Blue", name: "Blue", bgClass: "bg-cobalt" },
  { id: "moss", label: "Green", name: "Green", bgClass: "bg-moss" },
  { id: "plum", label: "Purple", name: "Purple", bgClass: "bg-plum" },
] as const;

export const DEFAULT_ACCENT: AccentId = "coral";
export const ACCENT_STORAGE_KEY = "focusframe-accent";

function safeGetLocalStorage(key: string): string | null {
  try {
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      return window.localStorage.getItem(key);
    }
  } catch {}
  return null;
}

function safeSetLocalStorage(key: string, value: string): void {
  try {
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  } catch {}
}

export function isAccentId(val: unknown): val is AccentId {
  return val === "coral" || val === "cobalt" || val === "moss" || val === "plum";
}

export function normalizeAccent(val: unknown): AccentId {
  if (val === "blue") return "cobalt";
  if (val === "green") return "moss";
  if (val === "purple") return "plum";
  if (isAccentId(val)) return val;
  return DEFAULT_ACCENT;
}

export function applyAccentToDocument(accent: AccentId) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset["accent"] = accent;
  document.documentElement.classList.remove(
    "accent-coral",
    "accent-cobalt",
    "accent-moss",
    "accent-plum",
    "accent-blue",
    "accent-green",
    "accent-purple",
  );
  document.documentElement.classList.add(`accent-${accent}`);
}

let currentAccent: AccentId = (function () {
  const stored = safeGetLocalStorage(ACCENT_STORAGE_KEY);
  if (stored) return normalizeAccent(stored);
  if (typeof document !== "undefined" && document.documentElement.dataset["accent"]) {
    return normalizeAccent(document.documentElement.dataset["accent"]);
  }
  return DEFAULT_ACCENT;
})();

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function getAccentSnapshot(): AccentId {
  return currentAccent;
}

export function getServerSnapshot(): AccentId {
  return DEFAULT_ACCENT;
}

export function setGlobalAccent(next: AccentId | string) {
  const normalized = normalizeAccent(next);
  if (currentAccent === normalized) return;
  currentAccent = normalized;
  applyAccentToDocument(normalized);
  safeSetLocalStorage(ACCENT_STORAGE_KEY, normalized);
  notify();
}

export function subscribeAccent(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useAccent() {
  const accent = useSyncExternalStore(subscribeAccent, getAccentSnapshot, getServerSnapshot);

  useEffect(() => {
    // Initial sync with localStorage on mount in case pre-script set it
    const stored = safeGetLocalStorage(ACCENT_STORAGE_KEY);
    if (stored) {
      const normalized = normalizeAccent(stored);
      if (currentAccent !== normalized) {
        setGlobalAccent(normalized);
      } else {
        applyAccentToDocument(normalized);
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === ACCENT_STORAGE_KEY && e.newValue) {
        setGlobalAccent(normalizeAccent(e.newValue));
      }
    };

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "FOCUSFRAME_ACCENT_CHANGED" && e.data.accent) {
        setGlobalAccent(e.data.accent);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return {
    accent,
    setAccent: setGlobalAccent,
    options: ACCENTS,
  };
}
