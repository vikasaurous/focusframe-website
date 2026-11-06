import { useEffect, useRef, useState } from "react";
import { Moon, Sun, RotateCcw } from "lucide-react";
import { PixelScene, type Pet } from "./pixel";
import { Reveal, SectionHead, WindowFrame } from "./shared";
import { DashboardMock } from "./mockups";

const PETS: Pet[] = ["cat", "dog", "dinosaur"];

export function PixelWorld() {
  const [night, setNight] = useState(false);
  const [pet, setPet] = useState<Pet>("cat");
  const [animate, setAnimate] = useState(true);
  return (
    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHead index="06" label="Pixel-art world" title="A little world inside every new tab.">
          Your workspace doesn't need to feel lifeless.
        </SectionHead>
        <Reveal className="mt-14 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-lg glow-frame"><PixelScene night={night} pet={pet} animate={animate} /></div>
            <p className="mt-3 font-mono text-[10px] text-subtle">Website illustration in the FocusFrame style — hover the {pet}. The extension runs its own live scene engine.</p>
          </div>
          <div className="space-y-6 lg:col-span-4">
            <Control label="Sky">
              <div className="grid grid-cols-2 gap-2">
                <Toggle on={!night} onClick={() => setNight(false)}><Sun className="size-3.5" />Day</Toggle>
                <Toggle on={night} onClick={() => setNight(true)}><Moon className="size-3.5" />Night</Toggle>
              </div>
            </Control>
            <Control label="Companion">
              <div className="grid grid-cols-3 gap-2">{PETS.map((p) => <Toggle key={p} on={pet === p} onClick={() => setPet(p)}>{p === "dinosaur" ? "Dino" : p.charAt(0).toUpperCase() + p.slice(1)}</Toggle>)}</div>
            </Control>
            <Control label="Animations">
              <div className="grid grid-cols-2 gap-2">
                <Toggle on={animate} onClick={() => setAnimate(true)}>On</Toggle>
                <Toggle on={!animate} onClick={() => setAnimate(false)}>Off</Toggle>
              </div>
            </Control>
            <ul className="space-y-1.5 border-t border-border pt-5 font-mono text-[11px] text-muted-foreground">
              {["Person coding on a bench", "Sun, moon, stars & sun rays", "Walking pet with hover reactions", "Scene can be turned off", "Respects reduced-motion settings"].map((f) => <li key={f} className="before:mr-1.5 before:text-primary before:content-['▪']">{f}</li>)}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="eyebrow mb-2">{label}</p>{children}</div>;
}
function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={on} className={`flex min-h-11 items-center justify-center gap-1.5 rounded border font-mono text-xs transition-colors ${on ? "border-live bg-live/10 text-live" : "border-border text-muted-foreground hover:text-foreground"}`}>
      {children}
    </button>
  );
}

const SPEEDS = { Slow: 260, Medium: 130, Fast: 60 } as const;
type Speed = keyof typeof SPEEDS;

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setNow(new Date()); const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return now;
}

const COLS = 26;
const ROWS = 15;
const GAP = 10;

function neighbours(i: number) {
  const r = Math.floor(i / COLS), c = i % COLS, out: number[] = [];
  if (c > 0) out.push(i - 1);
  if (c < COLS - 1) out.push(i + 1);
  if (r > 0) out.push(i - COLS);
  if (r < ROWS - 1) out.push(i + COLS);
  return out;
}

export function YearDots() {
  const now = useNow();
  const [speed, setSpeed] = useState<Speed>("Medium");
  const [on, setOn] = useState(true);
  const [body, setBody] = useState<number[]>([]);
  const eaten = useRef<Set<number>>(new Set());

  const year = now?.getFullYear() ?? 2026;
  const total = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
  const doy = now ? Math.floor((Date.UTC(year, now.getMonth(), now.getDate()) - Date.UTC(year, 0, 1)) / 864e5) : 0;
  const done = doy; // days fully completed

  const regrow = () => { eaten.current = new Set(); setBody(done > 1 ? [0] : []); };
  useEffect(() => { if (done > 1) regrow(); }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!on || done < 2) return;
    const t = setInterval(() => {
      setBody((prev) => {
        const head = prev[0];
        if (head === undefined) return [0];
        const blocked = new Set(prev.slice(0, -1));
        // BFS over past days to the nearest uneaten dot
        const from = new Map<number, number>([[head, -1]]);
        const q = [head];
        let target = -1;
        while (q.length) {
          const cur = q.shift()!;
          if (cur !== head && !eaten.current.has(cur)) { target = cur; break; }
          for (const n of neighbours(cur)) if (n < done && !from.has(n) && !blocked.has(n)) { from.set(n, cur); q.push(n); }
        }
        if (target < 0) { eaten.current = new Set(); return [head]; }
        let step = target;
        while (from.get(step) !== head) step = from.get(step)!;
        const ate = !eaten.current.has(step);
        eaten.current.add(step);
        const next = [step, ...prev];
        const max = Math.min(4 + Math.floor(eaten.current.size / 12), 14);
        return ate && next.length <= max ? next : next.slice(0, Math.min(next.length - 1, max));
      });
    }, SPEEDS[speed]);
    return () => clearInterval(t);
  }, [on, speed, done]);

  const midnight = now ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime() : 0;
  const hh = String(Math.floor(midnight / 36e5)).padStart(2, "0");
  const mm = String(Math.floor((midnight % 36e5) / 6e4)).padStart(2, "0");
  const ss = String(Math.floor((midnight % 6e4) / 1e3)).padStart(2, "0");
  const pt = (i: number) => `${(i % COLS) * GAP + GAP / 2},${Math.floor(i / COLS) * GAP + GAP / 2}`;
  const path = body.length ? `M${body.map(pt).join(" L")}` : "";

  return (
    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <SectionHead index="07" label="Year in dots" title="See your year taking shape." >
            Every dot is a day. A little snake roams the days behind you, eating them one by one.
          </SectionHead>
          <Reveal className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6">
            <Stat value={now ? String(total - done) : "—"} label="days left this year" />
            <Stat value={now ? `${hh}:${mm}:${ss}` : "—"} label="until midnight" />
          </Reveal>
        </div>
        <Reveal className="lg:col-span-8">
          <div className="panel p-5 sm:p-8">
            <svg viewBox={`0 0 ${COLS * GAP} ${ROWS * GAP}`} className="w-full" role="img" aria-label={`${done} of ${total} days of ${year} completed`}>
              {Array.from({ length: total }, (_, i) => {
                const past = i < done && !eaten.current.has(i);
                const cls = i === done ? "fill-primary" : past ? "fill-foreground" : "fill-muted-foreground/25";
                const [x, y] = pt(i).split(",").map(Number);
                return <circle key={i} cx={x} cy={y} r={i < done || i === done ? 2.6 : 2.2} className={`transition-colors duration-300 ${cls}`} />;
              })}
              {path && <path d={path} fill="none" strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" className="stroke-primary" />}
            </svg>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-primary" />{now ? `${total - done} days left this year` : ""}</span>
              <span>·</span><span>{year} · day {done + 1}</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-5">
              <span className="eyebrow mr-2">Snake</span>
              {(Object.keys(SPEEDS) as Speed[]).map((s) => (
                <button key={s} onClick={() => setSpeed(s)} aria-pressed={speed === s} className={`min-h-9 rounded border px-3 font-mono text-xs ${speed === s ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>{s}</button>
              ))}
              <button onClick={() => setOn(!on)} aria-pressed={on} className="min-h-9 rounded border border-border px-3 font-mono text-xs text-muted-foreground hover:text-foreground">{on ? "Pause" : "Animate"}</button>
              <button onClick={regrow} className="flex min-h-9 items-center gap-1.5 rounded border border-border px-3 font-mono text-xs text-muted-foreground hover:text-foreground"><RotateCcw className="size-3" />Regrow</button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div><p className="font-pixel text-3xl text-foreground">{value}</p><p className="mt-1 font-mono text-[11px] text-subtle">{label}</p></div>;
}

const ACCENTS = [
  { id: "coral", label: "Coral", cls: "bg-primary" },
  { id: "cobalt", label: "Cobalt", cls: "bg-cobalt" },
  { id: "moss", label: "Moss", cls: "bg-moss" },
  { id: "plum", label: "Plum", cls: "bg-plum" },
] as const;

export function Personalize() {
  const [accent, setAccent] = useState<(typeof ACCENTS)[number]["id"]>("coral");
  const [pet, setPet] = useState<Pet>("cat");
  const opts = ["Toggle dashboard modules", "Custom layout", "Personal links", "Four accent colours", "Cat, dog or dinosaur", "Pixel scene on / off", "Command bar settings", "Year animation settings"];
  return (
    <section className={`accent-${accent} border-t border-border py-24 lg:py-32`}>
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <SectionHead index="08" label="Personalization" title={<>Make it feel like <em className="text-live transition-colors">yours.</em></>} />
          <Reveal className="mt-10 space-y-6">
            <div>
              <p className="eyebrow mb-3">Accent</p>
              <div className="flex gap-3" role="radiogroup" aria-label="Accent colour">
                {ACCENTS.map((a) => (
                  <button key={a.id} role="radio" aria-checked={accent === a.id} aria-label={a.label} onClick={() => setAccent(a.id)}
                    className={`size-11 rounded-full ${a.cls} ring-offset-4 ring-offset-background transition ${accent === a.id ? "ring-2 ring-foreground" : "opacity-70 hover:opacity-100"}`} />
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3">Companion</p>
              <div className="grid grid-cols-3 gap-2">{PETS.map((p) => <Toggle key={p} on={pet === p} onClick={() => setPet(p)}>{p === "dinosaur" ? "Dino" : p.charAt(0).toUpperCase() + p.slice(1)}</Toggle>)}</div>
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-6 font-mono text-[11px] text-muted-foreground">
              {opts.map((o) => <li key={o} className="before:mr-1.5 before:text-live before:content-['▪']">{o}</li>)}
            </ul>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-7">
          <WindowFrame title={`focusframe — ${accent}`}><DashboardMock pet={pet} /></WindowFrame>
        </Reveal>
      </div>
    </section>
  );
}
