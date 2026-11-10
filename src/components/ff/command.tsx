import { Reveal, SectionHead } from "./shared";

type Dest = { name: string; group: "Search & sites" | "AI services" };

const DESTINATIONS: Dest[] = [
  { name: "Wikipedia", group: "Search & sites" },
  { name: "Reddit", group: "Search & sites" },
  { name: "GitHub", group: "Search & sites" },
  { name: "Stack Overflow", group: "Search & sites" },
  { name: "Google Maps", group: "Search & sites" },
  { name: "Google Images", group: "Search & sites" },
  { name: "Google Translate", group: "Search & sites" },
  { name: "Spotify", group: "Search & sites" },
  { name: "Amazon", group: "Search & sites" },
  { name: "Google", group: "Search & sites" },
  { name: "YouTube", group: "Search & sites" },
  { name: "ChatGPT", group: "AI services" },
  { name: "Claude", group: "AI services" },
  { name: "Gemini", group: "AI services" },
  { name: "Perplexity", group: "AI services" },
  { name: "Grok", group: "AI services" },
];

export function CommandSection() {
  const groups = ["Search & sites", "AI services"] as const;
  return (
    <section className="relative overflow-hidden border-t border-border bg-card/40 py-24 lg:py-32">
      <div className="dot-grid absolute inset-0 opacity-50" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <SectionHead index="05" label="Command bar" title="Your destinations. One shortcut.">
            Jump from an idea to the right search engine, community or AI assistant without hunting
            through bookmarks.
          </SectionHead>
          <Reveal className="mt-8 flex items-center gap-2">
            <span className="kbd text-sm">ALT</span>
            <span className="text-subtle">+</span>
            <span className="kbd text-sm">K</span>
            <span className="ml-2 font-mono text-xs text-subtle">default, configurable</span>
          </Reveal>
          <Reveal className="mt-10 space-y-6">
            {groups.map((g) => (
              <div key={g}>
                <p className="eyebrow">{g}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {DESTINATIONS.filter((d) => d.group === g).map((d) => (
                    <li
                      key={d.name}
                      className="rounded border border-border bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground"
                    >
                      {d.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">
              FocusFrame has no AI model of its own — it opens the external service you pick. Gemini
              gets your prompt via clipboard instead of a prefilled URL.
            </p>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-7">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-md border border-border bg-card glow-frame">
              <iframe
                src="/focusframe-demo/commandbar-preview.html"
                title="FocusFrame Command Bar interactive preview"
                className="block h-[520px] w-full border-0 sm:h-[560px]"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                allow="clipboard-write"
              />
            </div>
            <p className="font-mono text-[10px] text-subtle">
              Website demo — nothing is sent anywhere.
            </p>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[11px] text-muted-foreground sm:grid-cols-3">
            {[
              "Slash commands",
              "Keyboard navigation",
              "Custom shortcut",
              "Default destination",
              "Same or new tab",
              "Can be disabled",
            ].map((f) => (
              <li key={f} className="before:mr-1.5 before:text-primary before:content-['▪']">
                {f}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
