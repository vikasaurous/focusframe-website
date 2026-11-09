import { useEffect, useRef } from "react";
import { useAccent } from "@/lib/theme";
import type { Pet } from "./pixel";

/**
 * Product preview — embeds the actual FocusFrame extension as a live
 * iframe so previews show the real dashboard, dynamically synced with
 * the selected brand accent and companion pet.
 */
export function ProductGif({
  pet,
  interactive = false,
  className = "",
}: {
  pet?: Pet | "dino";
  interactive?: boolean;
  className?: string;
} = {}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { accent } = useAccent();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    try {
      iframe.contentWindow.postMessage({ type: "SET_ACCENT", accent }, "*");
      if (pet) {
        const normalizedPet = pet === "dinosaur" ? "dino" : pet;
        iframe.contentWindow.postMessage({ type: "SET_PET", pet: normalizedPet }, "*");
      }
    } catch {
      // guard
    }
  }, [accent, pet]);

  const normalizedPet = pet === "dinosaur" ? "dino" : pet;
  const searchParams = new URLSearchParams();
  if (accent) searchParams.set("accent", accent);
  if (normalizedPet) searchParams.set("pet", normalizedPet);
  searchParams.set("preview", "true");
  const src = `/focusframe-demo/newtab.html?${searchParams.toString()}`;

  return (
    <div className={`relative w-full overflow-hidden bg-background ${className}`}>
      <iframe
        ref={iframeRef}
        src={src}
        title="FocusFrame new-tab dashboard"
        className="block w-full"
        style={{
          height: "480px",
          border: "none",
          pointerEvents: interactive ? "auto" : "none",
        }}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}

/**
 * Backwards compatibility alias: points directly to the real extension preview
 * rather than any simulated imitation.
 */
export const DashboardMock = ProductGif;
