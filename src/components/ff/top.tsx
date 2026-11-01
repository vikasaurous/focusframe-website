import { useState } from "react";
import { Github, Menu, X } from "lucide-react";
import { GITHUB_URL, NAV_LINKS } from "@/config/site";
import { BrandMark, FirefoxButton, Reveal, SectionHead, WindowFrame } from "./shared";
import { CommandBarMock, DashboardMock, ProductGif } from "./mockups";
import { PixelScene } from "./pixel";

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Main">
        <a href="#top" className="flex items-center gap-2.5 font-mono text-sm font-semibold tracking-tight text-foreground">
          <BrandMark /> FocusFrame
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}><a href={l.href} className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground">{l.label}</a></li>
          ))}
        </ul>
        <div className="hidden items-center gap-3 md:flex">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="FocusFrame on GitHub" className="grid size-10 place-items-center rounded text-muted-foreground hover:bg-card hover:text-foreground"><Github className="size-4" /></a>
          <a href="#download" className="btn-primary">Get FocusFrame</a>
        </div>
        <button className="grid size-11 place-items-center rounded text-foreground md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background px-5 pb-6 md:hidden">
          <ul className="divide-y divide-border">
            {NAV_LINKS.map((l) => (
              <li key={l.href}><a href={l.href} onClick={() => setOpen(false)} className="block py-4 font-mono text-sm text-foreground">{l.label}</a></li>
            ))}
            <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-4 font-mono text-sm text-foreground"><Github className="size-4" />GitHub</a></li>
          </ul>
          <a href="#download" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">Get FocusFrame</a>
        </div>
      )}
    </header>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-16 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="anim-rise lg:col-span-5 lg:pt-10">
          <p className="eyebrow flex items-center gap-3"><span className="size-1.5 bg-primary" />Your new tab, reimagined</p>
          <h1 className="display mt-6 text-6xl text-foreground sm:text-7xl xl:text-8xl">
            Make every new tab <em className="text-primary">count.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Your daily focus, tasks, habits and favourite links — wrapped in a little pixel-art world that feels like yours.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <FirefoxButton />
            <a href="#features" className="btn-ghost">Explore features</a>
          </div>
          <p className="mt-6 font-mono text-[11px] text-subtle">Available on Firefox · Chrome and Edge coming soon</p>
        </div>
        <div className="anim-rise relative lg:col-span-7 [animation-delay:150ms]">
          <WindowFrame title="focusframe — new tab">
            <ProductGif />
          </WindowFrame>
          <p className="mt-3 text-right font-mono text-[10px] text-subtle">↳ replaces your browser's empty new-tab page</p>
        </div>
      </div>
    </section>
  );
}

const PREVIEW_TABS = [
  { id: "dashboard", label: "Dashboard", meta: "newtab.html", caption: "Focus, tasks, links and habits on one quiet screen." },
  { id: "command", label: "Command Bar", meta: "ALT + K", caption: "A keyboard launcher for search engines, communities and AI tools." },
  { id: "scene", label: "Pixel Scene", meta: "scene engine", caption: "A small animated world that shifts from day to night." },
] as const;

export function Preview() {
  const [tab, setTab] = useState<(typeof PREVIEW_TABS)[number]["id"]>("dashboard");
  const current = PREVIEW_TABS.find((t) => t.id === tab)!;
  return (
    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead index="01" label="Product preview" title="A better place to begin." />
          <div role="tablist" aria-label="Preview" className="flex gap-1 rounded-md border border-border p-1">
            {PREVIEW_TABS.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} aria-controls="preview-panel" onClick={() => setTab(t.id)}
                className={`rounded px-3 py-2 font-mono text-xs transition-colors sm:px-4 ${tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <Reveal className="relative mt-14">
          <div className="pointer-events-none absolute -left-2 -top-6 hidden font-mono text-[10px] text-subtle lg:block">[ {current.meta} ]</div>
          <div className="pointer-events-none absolute -right-2 -top-6 hidden font-mono text-[10px] text-subtle lg:block">1280 × 800</div>
          <div id="preview-panel" role="tabpanel" aria-label={current.label}>
            <WindowFrame title={`focusframe — ${current.label.toLowerCase()}`}>
              <div key={tab} className="anim-rise">
                {tab === "dashboard" && <ProductGif />}
                {tab === "command" && <CommandBarMock />}
                {tab === "scene" && <PixelScene night pet="dog" />}
              </div>
            </WindowFrame>
          </div>
          <p className="mt-4 font-mono text-xs text-muted-foreground">{current.caption}</p>
        </Reveal>
      </div>
    </section>
  );
}

const STATEMENTS = [
  ["01", "Decide what matters", "Keep your daily intention visible instead of losing it among dozens of browser tabs."],
  ["02", "Build consistency", "Track a small number of meaningful habits without managing an overwhelming productivity system."],
  ["03", "Make your space personal", "Customize your dashboard, choose your companion and organize your digital workspace."],
];

export function Statement() {
  return (
    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-12 lg:px-8">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow"><span className="text-primary">02</span> — Philosophy</p>
          <h2 className="display mt-5 text-6xl text-foreground sm:text-7xl lg:text-8xl">Less noise.<br /><em className="text-primary">More intention.</em></h2>
          <p className="mt-6 max-w-sm text-lg text-muted-foreground">Your browser is where your day begins. Give that space a purpose.</p>
        </Reveal>
        <ol className="space-y-0 lg:col-span-5 lg:col-start-8">
          {STATEMENTS.map(([n, t, d]) => (
            <Reveal as="li" key={n} className="group grid grid-cols-[3rem_1fr] gap-4 border-t border-border py-8 last:border-b">
              <span className="font-pixel text-sm text-primary">{n}</span>
              <div>
                <h3 className="font-serif text-3xl text-foreground">{t}</h3>
                <p className="mt-2 text-muted-foreground">{d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
