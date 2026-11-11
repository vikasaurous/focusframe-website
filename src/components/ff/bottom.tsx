import { useState } from "react";
import { ArrowUpRight, Plus, Github } from "lucide-react";
import { BETA_ZIP_URL, GITHUB_ISSUES_URL, GITHUB_URL, NAV_LINKS } from "@/config/site";
import { BrandMark, InstallBetaButton, Reveal, SectionHead } from "./shared";
import { Sprite } from "./pixel";
import { CtaMascots, PixelDog } from "./ctaMascots";

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
          <SectionHead index="08" label="Privacy" title="Your space belongs to you.">
            A personal workspace should stay personal.
          </SectionHead>
        </div>
        <div className="space-y-6 lg:col-span-7">
          <Reveal className="panel divide-y divide-border">
            {yes.map((y) => (
              <p key={y} className="flex items-center gap-3 px-5 py-4 text-foreground">
                <span className="size-2 shrink-0 bg-primary" />
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
      "Download the FocusFrame repository ZIP from GitHub using Code → Download ZIP, extract it, and load the folder containing manifest.json in Chrome.",
      <svg
        key="a"
        viewBox="0 0 9 7"
        shapeRendering="crispEdges"
        className="h-10 w-auto"
        aria-hidden
      >
        <Sprite rows={["..rr..", ".rrrr.", "rrrrrr", "..rr..", "..rr..", "wwwwww"]} />
      </svg>,
    ],
    [
      "02",
      "Open a new browser tab.",
      <svg
        key="b"
        viewBox="0 0 9 7"
        shapeRendering="crispEdges"
        className="h-10 w-auto"
        aria-hidden
      >
        <Sprite rows={["wwwwww", "w....w", "w.rr.w", "w....w", "wwwwww"]} />
      </svg>,
    ],
    [
      "03",
      "Set your intention, organize your day and make the space yours.",
      <PixelDog key="c" decorative className="h-10 w-auto" />,
    ],
  ] as const;
  return (
    <section id="how-it-works" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHead
          index="09"
          label="How it works"
          title="Three steps. A better starting point."
        />
        <ol className="mt-16 grid gap-4 md:grid-cols-3">
          {steps.map(([n, t, art]) => (
            <Reveal as="li" key={n} className="panel flex flex-col gap-10 p-6">
              <div className="flex items-start justify-between">
                <span className="font-pixel text-4xl text-primary">{n}</span>
                {art}
              </div>
              <p className="font-serif text-2xl text-foreground">{t}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

type BrowserStatus = "testing" | "experimental" | "untested";

const BROWSER_AVAILABILITY: readonly {
  name: string;
  status: BrowserStatus;
  badge: string;
  note: string;
  actionLabel: string;
}[] = [
  {
    name: "Google Chrome",
    status: "testing",
    badge: "Manual testing setup",
    note: "Unpacked setup via chrome://extensions using the GitHub repository ZIP. Clean install not verified yet.",
    actionLabel: BETA_ZIP_URL ? "Download release ZIP" : "Manual install steps",
  },
  {
    name: "Firefox",
    status: "experimental",
    badge: "Experimental",
    note: "Compatibility testing in progress. Not verified as fully supported yet.",
    actionLabel: "Compatibility testing",
  },
  {
    name: "Microsoft Edge",
    status: "untested",
    badge: "Not tested yet",
    note: "Not independently tested in Microsoft Edge yet.",
    actionLabel: "Not tested yet",
  },
];

const MANUAL_INSTALL_STEPS = [
  "Download the FocusFrame repository ZIP from GitHub using Code → Download ZIP.",
  "Extract the downloaded ZIP archive.",
  "Open `chrome://extensions`.",
  "Enable Developer mode.",
  "Click Load unpacked.",
  "Select the extracted folder containing `manifest.json`.",
  "Open a new tab.",
] as const;

export function Browsers() {
  const hasReleaseZip = Boolean(BETA_ZIP_URL);
  return (
    <section id="download" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHead index="10" label="Availability" title="Ready for your next new tab?">
          Chrome has manual unpacked setup instructions for testing. Clean installation and store
          listings are not verified or published yet.
        </SectionHead>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {BROWSER_AVAILABILITY.map((b) => {
            const isTesting = b.status === "testing";
            const isExperimental = b.status === "experimental";
            const badgeTone = isTesting
              ? "text-primary"
              : isExperimental
                ? "text-primary"
                : "text-subtle";
            const dotTone = isTesting ? "bg-primary" : isExperimental ? "bg-primary" : "bg-subtle";
            return (
              <Reveal
                key={b.name}
                className={`panel flex flex-col justify-between gap-6 p-6 ${isTesting ? "border-primary/50" : ""}`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-3xl text-foreground">{b.name}</h3>
                    <span
                      className={`mt-1.5 flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${badgeTone}`}
                    >
                      <span className={`size-1.5 ${dotTone}`} aria-hidden />
                      {b.badge}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{b.note}</p>
                </div>
                {isTesting ? (
                  hasReleaseZip ? (
                    <InstallBetaButton
                      label={b.actionLabel}
                      href={BETA_ZIP_URL}
                      external
                      className="w-full"
                    />
                  ) : (
                    <a href="#manual-install" className="btn-primary w-full">
                      {b.actionLabel}
                    </a>
                  )
                ) : (
                  <button className="btn-ghost w-full" disabled aria-disabled="true">
                    {b.actionLabel}
                  </button>
                )}
              </Reveal>
            );
          })}
        </div>

        <Reveal className="panel mt-6 p-6 sm:p-8">
          <div id="manual-install" className="scroll-mt-24">
            <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">Manual installation · Chrome testing setup</p>
                <h3 className="mt-2 font-serif text-2xl text-foreground sm:text-3xl">
                  Load the unpacked extension in seven steps.
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {hasReleaseZip
                    ? "Download the release ZIP archive below and load it in Developer mode."
                    : renderFaqAnswer(
                        "No versioned release ZIP exists yet. Download the FocusFrame repository ZIP from GitHub using Code → Download ZIP, extract it, and select the folder containing `manifest.json`.",
                      )}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {hasReleaseZip ? (
                  <InstallBetaButton label="Download release ZIP" href={BETA_ZIP_URL} external />
                ) : (
                  <>
                    <button className="btn-ghost" disabled aria-disabled="true">
                      No versioned release ZIP published
                    </button>
                    <a
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Get ZIP on GitHub
                      <ArrowUpRight className="size-4" aria-hidden />
                    </a>
                  </>
                )}
              </div>
            </div>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {MANUAL_INSTALL_STEPS.map((step, index) => (
                <li
                  key={step}
                  className="rounded border border-border bg-background/60 p-4 text-sm text-muted-foreground"
                >
                  <span className="font-mono text-xs text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-foreground">{renderFaqAnswer(step)}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
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
  [
    "Which browsers are currently supported?",
    "Google Chrome can be loaded manually for testing as an unpacked extension (`chrome://extensions`) by downloading the FocusFrame repository ZIP from GitHub using Code → Download ZIP, extracting it, and selecting the folder containing `manifest.json` — clean Chrome installation has not been independently verified yet. Firefox is in experimental compatibility testing and is not advertised as fully supported yet. Microsoft Edge has not been tested yet. Browser store listings and versioned release ZIPs are not published yet.",
  ],
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <SectionHead index="11" label="FAQ" title="Questions, answered." />
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
            <span className="text-primary">12</span>
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
          <InstallBetaButton label="Manual install" href="#download" />
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <Github className="size-4" aria-hidden />
            View on GitHub
          </a>
        </div>
        <p className="font-mono text-[11px] text-subtle">
          Chrome manual testing setup · Firefox experimental · Edge not tested yet
        </p>
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
              <a href="#download" className="text-muted-foreground hover:text-foreground">
                Browser availability & manual install
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
