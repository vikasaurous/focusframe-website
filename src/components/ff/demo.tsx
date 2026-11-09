import { useRef, useState, useEffect } from "react";
import { SectionHead, Reveal } from "./shared";
import { useAccent } from "@/lib/theme";

/**
 * LiveDemo — embeds the actual FocusFrame extension interface as an interactive
 * iframe served from /focusframe-demo/newtab.html.
 *
 * The demo uses a separate localStorage key ("focusFrameDemo") so it never
 * touches the visitor's real extension data. A Reset button clears that key and
 * reloads the iframe so they can start fresh.
 */
export function LiveDemo() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { accent } = useAccent();

  /* Keep demo iframe in sync with global theme accent */
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    try {
      iframe.contentWindow.postMessage({ type: "SET_ACCENT", accent }, "*");
    } catch {}
  }, [accent]);

  /* Autoplay the WebP in the preview while iframe loads */
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  function handleReset() {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      /* Call the reset helper exposed by the demo shim */
      (
        iframe.contentWindow as unknown as { FocusFrameDemo?: { reset(): void } }
      )?.FocusFrameDemo?.reset?.();
    } catch {
      /* cross-origin guard — reload the iframe directly */
      const current = iframe.getAttribute("src");
      if (current) iframe.setAttribute("src", current);
    }
  }

  return (
    <section
      id="try"
      className="border-t border-border py-24 lg:py-32"
      aria-label="Interactive demo"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead index="02" label="Live demo" title="Try it right here." />
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-xs text-muted-foreground">
              Fully interactive · your data stays in this browser
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="rounded border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              ↺ Reset demo
            </button>
          </div>
        </Reveal>

        <Reveal className="relative mt-10 overflow-hidden rounded-xl border border-border shadow-2xl">
          {/* Loading skeleton while iframe boots */}
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <span className="font-mono text-xs text-muted-foreground">Loading demo…</span>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={`/focusframe-demo/newtab.html?accent=${accent}`}
            title="FocusFrame interactive demo — try the actual extension"
            className="block w-full"
            style={{ height: "820px", border: "none" }}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </Reveal>

        <p className="mt-4 font-mono text-[11px] text-subtle">
          ↳ This is the actual extension code running in your browser — not a recording. Changes
          persist via localStorage until you reset.
        </p>
      </div>
    </section>
  );
}
