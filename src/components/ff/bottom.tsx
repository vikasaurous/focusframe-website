import { useState } from "react";
import { Plus, Github } from "lucide-react";
import {
  CHROME_STORE_URL,
  EDGE_ADDONS_URL,
  FIREFOX_ADDON_URL,
  GITHUB_ISSUES_URL,
  GITHUB_URL,
  NAV_LINKS,
  firefoxHref,
} from "@/config/site";
import { BrandMark, FirefoxButton, Reveal, SectionHead } from "./shared";
import { PETS, Sprite } from "./pixel";
import { CtaMascots } from "./ctaMascots";

export function Privacy() {
  const yes = [
    "No account required",
    "No FocusFrame backend",
    "No FocusFrame analytics",
    "No cloud synchronization",
    "Settings & content stay in local browser storage",
    "Only the storage permission declared in its manifest",
  ];
  const notes = [
    "The extension loads locally bundled WOFF2 fonts from fonts/ with no requests to Google Fonts.",
    "Searches and command-bar prompts go directly to the service you choose, when you submit them.",
    "Those services have their own privacy policies.",
    "FocusFrame runs no AI processing of its own.",
  ];
  return (
    <section id="privacy" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <SectionHead index="09" label="Privacy" title="Your space belongs to you.">
            A personal workspace should stay personal.
          </SectionHead>
        </div>
        <div className="space-y-6 lg:col-span-7">
          <Reveal className="panel divide-y divide-border">
            {yes.map((y) => (
              <p key={y} className="flex items-center gap-3 px-5 py-4 text-foreground">
                <span className="size-2 shrink-0 bg-moss" />
                {y}
              </p>
            ))}
          </Reveal>
          <Reveal className="rounded border border-dashed border-border p-5">
            <p className="eyebrow mb-3">Full transparency</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {notes.map((n) => (
                <li key={n} className="before:mr-2 before:text-primary before:content-['→']">
                  {n}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    [
      "01",
      "Install FocusFrame from Firefox Add-ons.",
      <Sprite key="a" rows={["..rr..", ".rrrr.", "rrrrrr", "..rr..", "..rr..", "wwwwww"]} />,
    ],
    [
      "02",
      "Open a new browser tab.",
      <Sprite key="b" rows={["wwwwww", "w....w", "w.rr.w", "w....w", "wwwwww"]} />,
    ],
    [
      "03",
      "Set your intention, organize your day and make the space yours.",
      <Sprite key="c" rows={[...PETS.cat]} />,
    ],
  ] as const;
  return (
    <section id="how-it-works" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHead
          index="10"
          label="How it works"
          title="Three steps. A better starting point."
        />
        <ol className="mt-16 grid gap-4 md:grid-cols-3">
          {steps.map(([n, t, art]) => (
            <Reveal as="li" key={n} className="panel flex flex-col gap-10 p-6">
              <div className="flex items-start justify-between">
                <span className="font-pixel text-4xl text-primary">{n}</span>
                <svg
                  viewBox="0 0 9 7"
                  shapeRendering="crispEdges"
                  className="h-10 w-auto"
                  aria-hidden
                >
                  {art}
                </svg>
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
            <Reveal
              key={b.name}
              className={`panel flex flex-col gap-8 p-6 ${b.available ? "border-primary/50" : ""}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-3xl text-foreground">{b.name}</h3>
                <span
                  className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${b.available ? "text-moss" : "text-subtle"}`}
                >
                  <span className={`size-1.5 ${b.available ? "bg-moss" : "bg-subtle"}`} />
                  {b.available ? "Available now" : "Coming soon"}
                </span>
              </div>
              {b.available ? (
                b.url ? (
                  <FirefoxButton className="w-full" />
                ) : (
                  <span className="btn-ghost w-full" aria-disabled="true">
                    Listing link coming shortly
                  </span>
                )
              ) : (
                <button className="btn-ghost w-full" disabled aria-disabled="true">
                  Coming soon
                </button>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderFaqAnswer(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-xs text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

const FAQS: [string, string][] = [
  [
    "What is FocusFrame?",
    "FocusFrame replaces your browser's new-tab page with a personal dashboard. It includes Daily Focus, Top 3 Tasks, Habits and Quick Links by default, with optional notes, quotes and countdowns. It also features web search, a Command Bar, year progress and a pixel-art scene.",
  ],
  [
    "Can I customize my dashboard?",
    "Yes. Enable or disable any of the seven modules, rearrange cards using drag and drop, and place up to three cards per row. You can also change accent colours, choose your companion and customize scene settings.",
  ],
  [
    "Where is my data stored?",
    "Your settings and dashboard data are stored locally in your browser using `chrome.storage.local`. FocusFrame has no cloud synchronization, so your data does not automatically sync between devices.",
  ],
  [
    "Does FocusFrame collect analytics or send my data anywhere?",
    "FocusFrame has no account system, backend or analytics. Your dashboard data stays in local browser storage. When you use search or a Command Bar destination, your browser opens the external service you selected. That service handles your query under its own privacy policy. FocusFrame does not log your searches.",
  ],
  [
    "What permissions does FocusFrame require?",
    "FocusFrame requires only the `storage` permission, used to save your dashboard settings and content locally.",
  ],
  [
    "How does the Command Bar work?",
    "Press `Alt + K` to open the Command Bar. Search or use slash commands to open one of 16 built-in destinations, including GitHub, Reddit and AI services. FocusFrame has no AI model of its own. Gemini uses clipboard-based prompt transfer, so you must paste your query manually.",
  ],
  [
    "What happens to unfinished tasks?",
    "Unfinished tasks carry over to the next day. Completed tasks are cleared when the day changes.",
  ],
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <SectionHead index="12" label="FAQ" title="Questions, answered." />
        </div>
        <dl className="divide-y divide-border border-y border-border lg:col-span-8">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q}>
                <dt>
                  <button
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="flex gap-4">
                      <span className="font-mono text-xs text-subtle">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-lg text-foreground">{q}</span>
                    </span>
                    <Plus
                      className={`size-4 shrink-0 text-primary transition-transform ${isOpen ? "rotate-45" : ""}`}
                      aria-hidden
                    />
                  </button>
                </dt>
                <dd
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  hidden={!isOpen}
                  className="pb-6 pl-10 text-muted-foreground"
                >
                  {renderFaqAnswer(a)}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

export function FinalCta() {
  // Shared FirefoxButton keeps its look; label stays honest until a listing URL exists.
  const listed = Boolean(FIREFOX_ADDON_URL);
  const trust = ["No account", "No analytics", "Local browser storage"];
  return (
    <section className="cta-screen relative border-t border-border">
      <div
        className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-3xl">
          <p className="eyebrow flex items-center gap-3">
            <span className="text-primary">13</span>
            <span className="h-px w-8 bg-border" />
            Start
          </p>
        </Reveal>
      </div>
      <Reveal className="cta-stack relative">
        <CtaMascots className="cta-mascot shrink-0" />
        <h2 className="display cta-title text-foreground">
          Start with a better <em className="text-primary">new tab.</em>
        </h2>
        <p className="cta-copy text-muted-foreground">
          Daily focus, three tasks, your habits and a tiny pixel world. Stays in your browser. No
          account.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <FirefoxButton label={listed ? "Add to Firefox" : "See Firefox availability"} />
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <Github className="size-4" aria-hidden />
            View on GitHub
          </a>
        </div>
        {!listed && (
          <p className="font-mono text-[11px] text-subtle">
            Listings for all major browsers coming soon.
          </p>
        )}
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[11px] text-subtle">
          {trust.map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="size-1.5 bg-moss" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-12 lg:px-8">
        <div className="md:col-span-5">
          <p className="flex items-center gap-2.5 font-mono text-sm font-semibold text-foreground">
            <BrandMark />
            FocusFrame
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A personal productivity space for your browser.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow mb-3">Explore</p>
          <ul className="space-y-2">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="eyebrow mb-3">Elsewhere</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Github className="size-3.5" />
                GitHub repository
              </a>
            </li>
            <li>
              <a
                href={GITHUB_ISSUES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                Issues & support
              </a>
            </li>
            <li>
              <a href={firefoxHref()} className="text-muted-foreground hover:text-foreground">
                Install on Firefox
              </a>
            </li>
          </ul>
        </div>
        <p className="font-mono text-[11px] text-subtle md:col-span-12">
          © {new Date().getFullYear()} FocusFrame. Less noise. More intention.
        </p>
      </div>
    </footer>
  );
}
