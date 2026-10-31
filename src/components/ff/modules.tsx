import { useState, type ReactNode } from "react";
import { Shuffle, Pin, GripVertical } from "lucide-react";
import { Reveal, SectionHead } from "./shared";

function Module({ n, name, desc, points, children, className = "", isDefault }: {
  n: string; name: string; desc: string; points: string[]; children: ReactNode; className?: string; isDefault?: boolean;
}) {
  return (
    <Reveal className={`panel flex flex-col gap-6 p-6 transition-colors hover:bg-card-hover lg:p-8 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] text-subtle">{n}</p>
          <h3 className="mt-1 font-serif text-3xl text-foreground lg:text-4xl">{name}</h3>
        </div>
        <span className={`rounded border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${isDefault ? "border-primary/50 text-primary" : "border-border text-subtle"}`}>
          {isDefault ? "On by default" : "Optional"}
        </span>
      </div>
      <p className="text-muted-foreground">{desc}</p>
      <div className="flex-1">{children}</div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {points.map((p) => <li key={p} className="font-mono text-[11px] text-subtle before:mr-1.5 before:text-primary before:content-['▪']">{p}</li>)}
      </ul>
    </Reveal>
  );
}

function FocusDemo() {
  const [v, setV] = useState("Finish chapter four");
  return (
    <label className="block">
      <span className="sr-only">Daily focus</span>
      <input value={v} onChange={(e) => setV(e.target.value)} className="w-full border-b border-border bg-transparent py-2 font-serif text-3xl text-foreground outline-none focus:border-primary lg:text-4xl" />
    </label>
  );
}

function TasksDemo() {
  const [done, setDone] = useState([true, false, false]);
  const tasks = ["Reply to Maya", "Outline the talk", "30 min walk"];
  return (
    <ul className="space-y-2">
      {tasks.map((t, i) => (
        <li key={t}>
          <button onClick={() => setDone(done.map((d, j) => (j === i ? !d : d)))} aria-pressed={done[i]} className="flex w-full items-center gap-3 rounded border border-border bg-background px-3 py-2.5 text-left hover:border-subtle">
            <span className={`grid size-4 place-items-center border ${done[i] ? "border-primary bg-primary" : "border-subtle"}`} />
            <span className={done[i] ? "text-subtle line-through" : "text-foreground"}>{t}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
function HabitsDemo() {
  const habits = ["Read", "Stretch", "Journal"];
  const [grid, setGrid] = useState(() => habits.map((_, h) => DAYS.map((_, d) => (d * 3 + h) % 4 !== 0 && d < 5)));
  const streak = (row: boolean[]) => { let s = 0; for (let i = row.length - 1; i >= 0; i--) { if (row[i]) s++; else if (s) break; } return s; };
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[5rem_repeat(7,1fr)_2.5rem] gap-1 font-mono text-[10px] text-subtle">
        <span />{DAYS.map((d, i) => <span key={i} className="text-center">{d}</span>)}<span className="text-right">🔥</span>
      </div>
      {habits.map((h, hi) => (
        <div key={h} className="grid grid-cols-[5rem_repeat(7,1fr)_2.5rem] items-center gap-1">
          <span className="truncate text-sm text-foreground">{h}</span>
          {DAYS.map((d, di) => (
            <button key={di} aria-label={`${h} on day ${di + 1}`} aria-pressed={grid[hi]?.[di]}
              onClick={() => setGrid(grid.map((r, i) => (i === hi ? r.map((c, j) => (j === di ? !c : c)) : r)))}
              className={`aspect-square rounded-sm border ${grid[hi]?.[di] ? "border-primary bg-primary" : "border-border bg-background hover:border-subtle"}`} />
          ))}
          <span className="text-right font-mono text-xs text-primary">{streak(grid[hi] ?? [])}</span>
        </div>
      ))}
    </div>
  );
}

const QUOTES = [
  ["The secret of getting ahead is getting started.", "Mark Twain"],
  ["Well begun is half done.", "Aristotle"],
  ["Simplicity is the ultimate sophistication.", "Leonardo da Vinci"],
  ["It is not enough to be busy. The question is: what are we busy about?", "Henry David Thoreau"],
];
function QuoteDemo() {
  const [i, setI] = useState(0);
  const [pinned, setPinned] = useState(false);
  return (
    <figure>
      <blockquote key={i} className="anim-rise font-serif text-2xl leading-snug text-foreground">“{QUOTES[i]?.[0]}”</blockquote>
      <figcaption className="mt-3 flex items-center justify-between font-mono text-xs text-subtle">
        — {QUOTES[i]?.[1]}
        <span className="flex gap-1">
          <button onClick={() => { setI((i + 1) % QUOTES.length); setPinned(false); }} aria-label="Shuffle quote" className="grid size-9 place-items-center rounded border border-border hover:text-foreground"><Shuffle className="size-3.5" /></button>
          <button onClick={() => setPinned(!pinned)} aria-pressed={pinned} aria-label="Pin quote" className={`grid size-9 place-items-center rounded border ${pinned ? "border-primary text-primary" : "border-border hover:text-foreground"}`}><Pin className="size-3.5" /></button>
        </span>
      </figcaption>
    </figure>
  );
}

export function Modules() {
  return (
    <section id="features" className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHead index="03" label="Seven modules" title={<>Everything you need.<br /><span className="text-muted-foreground">Nothing you don't.</span></>}>
          Four modules are on from the start. The rest wait quietly until you switch them on.
        </SectionHead>
        <div className="mt-16 grid gap-4 lg:grid-cols-6">
          <Module n="01" name="Daily Focus" isDefault className="lg:col-span-4" desc="One daily intention, with an optional note — so the most important thing stays in sight." points={["One intention", "Optional note"]}>
            <FocusDemo />
          </Module>
          <Module n="02" name="Top 3 Tasks" isDefault className="lg:col-span-2" desc="Three tasks. No more." points={["Max three", "Completed clear overnight", "Unfinished carry over"]}>
            <TasksDemo />
          </Module>
          <Module n="03" name="Habits" isDefault className="lg:col-span-3" desc="Up to five habits, tracked Monday to Sunday with streaks." points={["Max five", "Weekly grid", "Streaks"]}>
            <HabitsDemo />
          </Module>
          <Module n="04" name="Quick Links" isDefault className="lg:col-span-3" desc="Your own shortcuts to the places you visit most." points={["Personal shortcuts", "One click away"]}>
            <div className="grid grid-cols-3 gap-2">
              {["GitHub", "Calendar", "Notion", "YouTube", "Mail", "+ Add"].map((l) => (
                <span key={l} className={`rounded border px-2 py-3 text-center font-mono text-xs ${l === "+ Add" ? "border-dashed border-subtle text-subtle" : "border-border bg-background text-foreground"}`}>{l}</span>
              ))}
            </div>
          </Module>
          <Module n="05" name="Now" className="lg:col-span-2" desc="An editable note for what you're doing right now." points={["Editable note"]}>
            <p contentEditable suppressContentEditableWarning className="rounded border border-border bg-background p-3 font-mono text-sm text-foreground outline-none focus:border-primary">Deep work until 4pm. Then emails.</p>
          </Module>
          <Module n="06" name="Quote" className="lg:col-span-4" desc="A daily quote. Shuffle it, pin a favourite, or add your own." points={["Daily", "Shuffle", "Pin", "Custom quotes"]}>
            <QuoteDemo />
          </Module>
          <Module n="07" name="Countdown" className="lg:col-span-6" desc="Count down to something that matters — an exam, a trip, a launch, a milestone." points={["Exams", "Travel", "Launches", "Milestones"]}>
            <div className="flex flex-wrap items-end gap-x-10 gap-y-4">
              <div><p className="font-pixel text-6xl text-primary lg:text-7xl">42</p><p className="font-mono text-xs text-subtle">days until</p></div>
              <p className="display pb-2 text-4xl text-foreground lg:text-5xl">Final exams</p>
            </div>
          </Module>
        </div>
      </div>
    </section>
  );
}

const ARRANGEMENTS = {
  "Two rows": [["Daily Focus", "Top 3 Tasks"], ["Quick Links", "Habits"]],
  "Three across": [["Daily Focus", "Top 3 Tasks", "Habits"], ["Quick Links"]],
  "Stacked": [["Daily Focus"], ["Top 3 Tasks", "Habits"], ["Quick Links"]],
} as const;
type ArrKey = keyof typeof ARRANGEMENTS;

export function LayoutSection() {
  const [arr, setArr] = useState<ArrKey>("Two rows");
  const rules = ["Drag cards by the DRAG handle", "Drop side by side", "Move above or below a row", "Max three cards per row", "Widths adjust automatically", "Cards swap when needed"];
  return (
    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <SectionHead index="04" label="Custom layout" title="Your workspace. Your arrangement.">
            Rearrange dashboard cards with drag and drop.
          </SectionHead>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {rules.map((r, i) => <li key={r} className="flex gap-4 py-3 font-mono text-xs text-muted-foreground"><span className="text-primary">{String(i + 1).padStart(2, "0")}</span>{r}</li>)}
          </ul>
        </div>
        <Reveal className="lg:col-span-7">
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Example arrangements">
            {(Object.keys(ARRANGEMENTS) as ArrKey[]).map((k) => (
              <button key={k} onClick={() => setArr(k)} aria-pressed={arr === k} className={`rounded border px-3 py-2 font-mono text-xs ${arr === k ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>{k}</button>
            ))}
          </div>
          <div className="dot-grid space-y-3 rounded-lg border border-border bg-background p-4 sm:p-6">
            {ARRANGEMENTS[arr].map((row, ri) => (
              <div key={`${arr}-${ri}`} className="anim-rise flex gap-3" style={{ animationDelay: `${ri * 80}ms` }}>
                {row.map((c) => (
                  <div key={c} className="min-h-24 flex-1 rounded border border-border bg-card p-3 transition-all duration-500">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{c}</span>
                      <span className="flex items-center gap-0.5 font-mono text-[9px] text-subtle"><GripVertical className="size-3" />DRAG</span>
                    </div>
                    <div className="mt-3 space-y-1.5"><div className="h-1.5 w-3/4 bg-border" /><div className="h-1.5 w-1/2 bg-border" /></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[10px] text-subtle">Illustration of layouts you can build — rows hold up to three cards.</p>
        </Reveal>
      </div>
    </section>
  );
}
