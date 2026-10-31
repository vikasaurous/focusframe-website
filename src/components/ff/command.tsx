import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, CornerDownLeft } from "lucide-react";
import { Reveal, SectionHead } from "./shared";

type Dest = { name: string; group: "Search & sites" | "AI services"; alias?: string; note?: string };

const DESTINATIONS: Dest[] = [
  { name: "Wikipedia", group: "Search & sites", alias: "/wiki" },
  { name: "Reddit", group: "Search & sites", alias: "/r" },
  { name: "GitHub", group: "Search & sites", alias: "/gh" },
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
  { name: "Gemini", group: "AI services", note: "Prompt is copied to your clipboard, then Gemini opens" },
  { name: "Perplexity", group: "AI services" },
  { name: "Grok", group: "AI services" },
];

function CommandDemo() {
  const [value, setValue] = useState("");
  const [dest, setDest] = useState<Dest | null>(null);
  const [active, setActive] = useState(0);
  const [handoff, setHandoff] = useState<{ dest: Dest; q: string } | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const suggesting = !dest && value.startsWith("/");
  const matches = useMemo(() => {
    const q = value.slice(1).toLowerCase();
    return DESTINATIONS.filter((d) => d.name.toLowerCase().includes(q) || d.alias?.slice(1).startsWith(q));
  }, [value]);

  const choose = (d: Dest) => { setDest(d); setValue(""); setActive(0); setHandoff(null); input.current?.focus(); };
  const submit = () => {
    const q = value.trim();
    if (!q) return;
    setHandoff({ dest: dest ?? DESTINATIONS.find((d) => d.name === "Google")!, q });
    setValue(""); setDest(null);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (suggesting && matches.length) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((active + 1) % matches.length); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive((active - 1 + matches.length) % matches.length); return; }
      if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); choose(matches[active]); return; }
    }
    if (e.key === "Backspace" && !value && dest) { setDest(null); return; }
    if (e.key === "Escape") { setValue(""); setDest(null); setHandoff(null); return; }
    if (e.key === "Enter") { e.preventDefault(); submit(); }
  };

  const tryCmd = (alias: string, q: string) => {
    const d = DESTINATIONS.find((x) => x.alias === alias)!;
    setDest(d); setValue(q); setHandoff(null); input.current?.focus();
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border border-border bg-card glow-frame">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
          <span className="font-mono text-primary">›</span>
          {dest && <span className="rounded bg-primary/15 px-2 py-0.5 font-mono text-xs text-primary">{dest.name}</span>}
          <input
            ref={input} value={value} onKeyDown={onKey}
            onChange={(e) => { setValue(e.target.value); setActive(0); setHandoff(null); }}
            placeholder={dest ? `Search ${dest.name}…` : "Type / for destinations, or just search"}
            aria-label="Command bar demo" role="combobox" aria-expanded={suggesting} aria-controls="cmd-list"
            aria-activedescendant={suggesting && matches[active] ? `cmd-${matches[active].name}` : undefined}
            className="min-w-0 flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-subtle"
          />
          <span className="kbd hidden sm:inline-flex">ALT</span><span className="kbd hidden sm:inline-flex">K</span>
        </div>
        <div className="min-h-64">
          {suggesting ? (
            <ul id="cmd-list" role="listbox" className="max-h-64 overflow-y-auto py-1">
              {matches.length === 0 && <li className="px-4 py-3 font-mono text-xs text-subtle">No destination matches.</li>}
              {matches.map((d, i) => (
                <li key={d.name} id={`cmd-${d.name}`} role="option" aria-selected={i === active}
                  onMouseEnter={() => setActive(i)} onMouseDown={(e) => { e.preventDefault(); choose(d); }}
                  className={`flex cursor-pointer items-center justify-between px-4 py-2 font-mono text-xs ${i === active ? "bg-card-hover text-foreground" : "text-muted-foreground"}`}>
                  <span className="flex items-center gap-2">{i === active && <span className="size-1.5 bg-primary" />}{d.name}</span>
                  <span className="text-subtle">{d.alias ?? d.group}</span>
                </li>
              ))}
            </ul>
          ) : handoff ? (
            <div className="anim-rise flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-subtle">Illustrative handoff</p>
              <p className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm text-foreground">
                FocusFrame <ArrowRight className="size-4 text-primary" /> <span className="text-primary">{handoff.dest.name}</span>
              </p>
              <p className="font-serif text-2xl text-foreground">“{handoff.q}”</p>
              <p className="max-w-sm text-sm text-muted-foreground">{handoff.dest.note ?? `Opens ${handoff.dest.name} with your query — in the same tab or a new one, your choice.`}</p>
            </div>
          ) : (
            <div className="flex min-h-64 flex-col justify-center gap-3 p-6">
              <p className="font-mono text-xs text-subtle">Try one:</p>
              {[["/wiki", "cats"], ["/r", "python"], ["/gh", "react"]].map(([a, q]) => (
                <button key={a} onClick={() => tryCmd(a, q)} className="flex w-fit items-center gap-3 rounded border border-border px-3 py-2 font-mono text-sm text-foreground hover:border-primary">
                  <span className="text-primary">{a}</span>{q}<CornerDownLeft className="size-3 text-subtle" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border px-4 py-2 font-mono text-[10px] text-subtle">
          <span>↑↓ navigate</span><span>↵ select / submit</span><span>⌫ clear destination</span><span>esc reset</span>
        </div>
      </div>
      <p className="font-mono text-[10px] text-subtle">Website demo — nothing is sent anywhere.</p>
    </div>
  );
}

export function CommandSection() {
  const groups = ["Search & sites", "AI services"] as const;
  return (
    <section className="relative overflow-hidden border-t border-border bg-card/40 py-24 lg:py-32">
      <div className="dot-grid absolute inset-0 opacity-50" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <SectionHead index="05" label="Command bar" title="Your destinations. One shortcut.">
            Jump from an idea to the right search engine, community or AI assistant without hunting through bookmarks.
          </SectionHead>
          <Reveal className="mt-8 flex items-center gap-2"><span className="kbd text-sm">ALT</span><span className="text-subtle">+</span><span className="kbd text-sm">K</span><span className="ml-2 font-mono text-xs text-subtle">default, configurable</span></Reveal>
          <Reveal className="mt-10 space-y-6">
            {groups.map((g) => (
              <div key={g}>
                <p className="eyebrow">{g}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {DESTINATIONS.filter((d) => d.group === g).map((d) => <li key={d.name} className="rounded border border-border bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground">{d.name}</li>)}
                </ul>
              </div>
            ))}
            <p className="text-sm text-muted-foreground">
              FocusFrame has no AI model of its own — it opens the external service you pick. Gemini gets your prompt via clipboard instead of a prefilled URL.
            </p>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-7">
          <CommandDemo />
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[11px] text-muted-foreground sm:grid-cols-3">
            {["Slash commands", "Keyboard navigation", "Custom shortcut", "Default destination", "Same or new tab", "Can be disabled"].map((f) => <li key={f} className="before:mr-1.5 before:text-primary before:content-['▪']">{f}</li>)}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
