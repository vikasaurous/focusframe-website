import { useState } from "react";
import { Plus, Github } from "lucide-react";
import { CHROME_STORE_URL, EDGE_ADDONS_URL, FIREFOX_ADDON_URL, GITHUB_ISSUES_URL, GITHUB_URL, NAV_LINKS, firefoxHref } from "@/config/site";
import { BrandMark, FirefoxButton, Reveal, SectionHead } from "./shared";
import { PERSON, PETS, Sprite } from "./pixel";

export function Privacy() {
  const yes = ["No account required", "No FocusFrame backend", "No FocusFrame analytics", "No cloud synchronization", "Settings & content stay in local browser storage", "Only the storage permission declared in its manifest"];
  const notes = [
    "The extension loads its fonts from Google Fonts.",
    "Searches and command-bar prompts go directly to the service you choose, when you submit them.",
    "Those services have their own privacy policies.",
    "FocusFrame runs no AI processing of its own.",
  ];
  return (
    <section id="privacy" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <SectionHead index="09" label="Privacy" title="Your space belongs to you.">A personal workspace should stay personal.</SectionHead>
        </div>
        <div className="space-y-6 lg:col-span-7">
          <Reveal className="panel divide-y divide-border">
            {yes.map((y) => <p key={y} className="flex items-center gap-3 px-5 py-4 text-foreground"><span className="size-2 shrink-0 bg-moss" />{y}</p>)}
          </Reveal>
          <Reveal className="rounded border border-dashed border-border p-5">
            <p className="eyebrow mb-3">Full transparency</p>
            <ul className="space-y-2 text-sm text-muted-foreground">{notes.map((n) => <li key={n} className="before:mr-2 before:text-primary before:content-['→']">{n}</li>)}</ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    ["01", "Install FocusFrame from Firefox Add-ons.", <Sprite key="a" rows={["..rr..", ".rrrr.", "rrrrrr", "..rr..", "..rr..", "wwwwww"]} />],
    ["02", "Open a new browser tab.", <Sprite key="b" rows={["wwwwww", "w....w", "w.rr.w", "w....w", "wwwwww"]} />],
    ["03", "Set your intention, organize your day and make the space yours.", <Sprite key="c" rows={[...PETS.cat]} />],
  ] as const;
  return (
    <section id="how-it-works" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHead index="10" label="How it works" title="Three steps. A better starting point." />
        <ol className="mt-16 grid gap-4 md:grid-cols-3">
          {steps.map(([n, t, art]) => (
            <Reveal as="li" key={n} className="panel flex flex-col gap-10 p-6">
              <div className="flex items-start justify-between">
                <span className="font-pixel text-4xl text-primary">{n}</span>
                <svg viewBox="0 0 9 7" shapeRendering="crispEdges" className="h-10 w-auto" aria-hidden>{art}</svg>
              </div>
              <p className="font-serif text-2xl text-foreground">{t}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Browsers() {
  const items = [
    { name: "Firefox", url: FIREFOX_ADDON_URL, available: true },
    { name: "Google Chrome", url: CHROME_STORE_URL, available: false },
    { name: "Microsoft Edge", url: EDGE_ADDONS_URL, available: false },
  ];
  return (
    <section id="download" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHead index="11" label="Availability" title="Ready for your next new tab?" />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {items.map((b) => (
            <Reveal key={b.name} className={`panel flex flex-col gap-8 p-6 ${b.available ? "border-primary/50" : ""}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-3xl text-foreground">{b.name}</h3>
                <span className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${b.available ? "text-moss" : "text-subtle"}`}>
                  <span className={`size-1.5 ${b.available ? "bg-moss" : "bg-subtle"}`} />{b.available ? "Available now" : "Coming soon"}
                </span>
              </div>
              {b.available ? (
                b.url ? <FirefoxButton className="w-full" /> : <span className="btn-ghost w-full" aria-disabled="true">Listing link coming shortly</span>
              ) : (
                <button className="btn-ghost w-full" disabled aria-disabled="true">Coming soon</button>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS: [string, string][] = [
  ["What is FocusFrame?", "A browser extension that turns your empty new-tab page into a personal productivity space — daily focus, three tasks, habits, links, a note, quotes, countdowns, a command launcher, a year-progress tracker and a small pixel-art scene."],
  ["How does FocusFrame work?", "Once installed, it replaces your browser's new-tab page. Every time you open a tab, your dashboard is there."],
  ["Which browsers support FocusFrame?", "Firefox, today. Chrome and Edge versions have been submitted and are not available yet."],
  ["Does FocusFrame require an account?", "No. There is no sign-up and no login."],
  ["Where is my data stored?", "In your browser's local extension storage, on your device. FocusFrame has no backend of its own."],
  ["Does FocusFrame collect analytics?", "No. FocusFrame includes no analytics. Note that the extension loads its fonts from Google Fonts, and searches you submit go to the service you picked."],
  ["Can I customize dashboard modules?", "Yes. Switch any of the seven modules on or off and rearrange cards by dragging them — up to three per row."],
  ["Can I disable the pixel-art scene?", "Yes. You can turn the scene off entirely, or just turn off its animations. Reduced-motion preferences are respected."],
  ["What is the Command Bar?", "A keyboard launcher (Alt + K by default) for sending a query to sites like Wikipedia, Reddit, GitHub or YouTube, or to AI services — with slash commands such as /wiki, /r and /gh."],
  ["Does FocusFrame contain its own AI model?", "No. It simply opens the external AI service you choose. All answers come from that service."],
  ["Can I use my favourite AI tools through FocusFrame?", "You can open ChatGPT, Claude, Gemini, Perplexity and Grok from the command bar. Gemini receives your prompt through the clipboard rather than a prefilled link."],
  ["Can I synchronize data across different devices?", "Not currently. Synchronization isn't implemented — your data lives in the browser where you use FocusFrame."],
  ["What happens to unfinished daily tasks?", "They carry over to the next day. Completed tasks clear overnight."],
  ["How many habits can I track?", "Up to five, tracked Monday to Sunday with streaks."],
  ["Can I change my companion animal?", "Yes — choose a cat, a dog or a dinosaur."],
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4"><SectionHead index="12" label="FAQ" title="Questions, answered." /></div>
        <dl className="divide-y divide-border border-y border-border lg:col-span-8">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q}>
                <dt>
                  <button id={`faq-q-${i}`} aria-expanded={isOpen} aria-controls={`faq-a-${i}`} onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left">
                    <span className="flex gap-4"><span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span><span className="text-lg text-foreground">{q}</span></span>
                    <Plus className={`size-4 shrink-0 text-primary transition-transform ${isOpen ? "rotate-45" : ""}`} aria-hidden />
                  </button>
                </dt>
                <dd id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!isOpen} className="pb-6 pl-10 text-muted-foreground">{a}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-border py-28 lg:py-40">
      <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" aria-hidden />
      <Reveal className="relative mx-auto max-w-4xl px-5 text-center">
        <svg viewBox="0 0 24 14" shapeRendering="crispEdges" className="mx-auto mb-8 h-20 w-auto" aria-hidden>
          <Sprite rows={PERSON} x={0} y={0} /><Sprite rows={[...PETS.cat]} x={14} y={7} />
        </svg>
        <h2 className="display text-6xl text-foreground sm:text-7xl lg:text-8xl">Start with a better <em className="text-primary">new tab.</em></h2>
        <p className="mx-auto mt-6 max-w-md text-lg text-muted-foreground">Your intentions, priorities and little pixel world are one new tab away.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <FirefoxButton />
          <a href="#features" className="btn-ghost">Explore FocusFrame</a>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-12 lg:px-8">
        <div className="md:col-span-5">
          <p className="flex items-center gap-2.5 font-mono text-sm font-semibold text-foreground"><BrandMark />FocusFrame</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">A personal productivity space for your browser.</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow mb-3">Explore</p>
          <ul className="space-y-2">{NAV_LINKS.map((l) => <li key={l.href}><a href={l.href} className="text-sm text-muted-foreground hover:text-foreground">{l.label}</a></li>)}</ul>
        </nav>
        <div className="md:col-span-4">
          <p className="eyebrow mb-3">Elsewhere</p>
          <ul className="space-y-2 text-sm">
            <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"><Github className="size-3.5" />GitHub repository</a></li>
            <li><a href={GITHUB_ISSUES_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Issues & support</a></li>
            <li><a href={firefoxHref()} className="text-muted-foreground hover:text-foreground">Install on Firefox</a></li>
          </ul>
        </div>
        <p className="font-mono text-[11px] text-subtle md:col-span-12">© {new Date().getFullYear()} FocusFrame. Less noise. More intention.</p>
      </div>
    </footer>
  );
}
