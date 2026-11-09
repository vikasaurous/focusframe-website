import { useEffect, useRef, useState } from "react";
import { Moon, Sun, RotateCcw } from "lucide-react";
import { PixelScene, type Pet } from "./pixel";
import { Reveal, SectionHead, WindowFrame } from "./shared";
import { DashboardMock } from "./mockups";
import {
  COLS,
  ROWS,
  GAP,
  SNAKE_SPEEDS,
  type SnakeSpeed,
  getCalendarYearInfo,
  getDotCenter,
  useSnakeCalendar,
} from "@/lib/focusframe/snakeRenderer";

const PETS: Pet[] = ["cat", "dog", "dinosaur"];

export function PixelWorld() {
  const [night, setNight] = useState(false);
  const [pet, setPet] = useState<Pet>("cat");
  const [animate, setAnimate] = useState(true);
  return (
    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHead
          index="06"
          label="Pixel-art world"
          title="A little world inside every new tab."
        >
          Your workspace doesn't need to feel lifeless.
        </SectionHead>
        <Reveal className="mt-14 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-lg glow-frame">
              <PixelScene night={night} pet={pet} animate={animate} />
            </div>
            <p className="mt-3 font-mono text-[10px] text-subtle">
              Website illustration in the FocusFrame style — hover the {pet}. The extension runs its
              own live scene engine.
            </p>
          </div>
          <div className="space-y-6 lg:col-span-4">
            <Control label="Sky">
              <div className="grid grid-cols-2 gap-2">
                <Toggle on={!night} onClick={() => setNight(false)}>
                  <Sun className="size-3.5" />
                  Day
                </Toggle>
                <Toggle on={night} onClick={() => setNight(true)}>
                  <Moon className="size-3.5" />
                  Night
                </Toggle>
              </div>
            </Control>
            <Control label="Companion">
              <div className="grid grid-cols-3 gap-2">
                {PETS.map((p) => (
                  <Toggle key={p} on={pet === p} onClick={() => setPet(p)}>
                    {p === "dinosaur" ? "Dino" : p.charAt(0).toUpperCase() + p.slice(1)}
                  </Toggle>
                ))}
              </div>
            </Control>
            <Control label="Animations">
              <div className="grid grid-cols-2 gap-2">
                <Toggle on={animate} onClick={() => setAnimate(true)}>
                  On
                </Toggle>
                <Toggle on={!animate} onClick={() => setAnimate(false)}>
                  Off
                </Toggle>
              </div>
            </Control>
            <ul className="space-y-1.5 border-t border-border pt-5 font-mono text-[11px] text-muted-foreground">
              {[
                "Person coding on a bench",
                "Sun, moon, stars & sun rays",
                "Walking pet with hover reactions",
                "Scene can be turned off",
                "Respects reduced-motion settings",
              ].map((f) => (
                <li key={f} className="before:mr-1.5 before:text-primary before:content-['▪']">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-2">{label}</p>
      {children}
    </div>
  );
}
function Toggle({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`flex min-h-11 items-center justify-center gap-1.5 rounded border font-mono text-xs transition-colors ${on ? "border-live bg-live/10 text-live" : "border-border text-muted-foreground hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export function YearDots() {
  const now = useNow();
  const cal = getCalendarYearInfo(now ?? new Date());

  const {
    speed,
    running,
    reducedMotion,
    eaten,
    bodyPath,
    tail1Path,
    tail2Path,
    head,
    containerRef,
    changeSpeed,
    toggleAnimate,
    regrowNow,
  } = useSnakeCalendar({
    walkableCount: cal.walkableCount,
    initialSpeed: "Medium",
    initialRunning: true,
    regrow: true,
  });

  return (
    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <SectionHead index="07" label="Year in dots" title="See your year taking shape.">
            Every dot is a day. A little snake roams the days behind you, eating them one by one.
          </SectionHead>
          <Reveal className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6">
            <Stat value={now ? String(cal.daysLeft) : "—"} label="days left this year" />
            <Stat value={now ? cal.countdown : "—"} label="until midnight" />
          </Reveal>
        </div>
        <Reveal className="lg:col-span-8">
          <div ref={containerRef} className="panel p-5 sm:p-8">
            <svg
              viewBox={`0 0 ${COLS * GAP} ${ROWS * GAP}`}
              className="w-full"
              role="img"
              aria-label={`${cal.walkableCount} of ${cal.daysInYear} days of ${cal.year} completed`}
            >
              {Array.from({ length: cal.daysInYear }, (_, i) => {
                const isCompleted = i < cal.walkableCount;
                const isToday = i === cal.todayIndex;
                const isEaten = isCompleted && !reducedMotion && eaten.has(i);

                // Eaten dots fade to approximately 0.18 opacity and scale to 0.7
                const radius = isToday ? 2.6 : isCompleted ? (isEaten ? 1.82 : 2.6) : 2.2;
                const opacity = isEaten ? 0.18 : isCompleted || isToday ? 1 : 0.25;
                const fillClass = isToday
                  ? "fill-primary"
                  : isCompleted
                    ? "fill-foreground"
                    : "fill-muted-foreground/25";

                const pt = getDotCenter(i);
                return (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={radius}
                    className={`transition-[opacity,r,fill] duration-400 ease-out ${fillClass}`}
                    style={{ opacity }}
                  />
                );
              })}
              {/* Snake layers in back-to-front paint order matching extension: tail2, tail1, body, head */}
              {tail2Path && (
                <path
                  d={tail2Path}
                  fill="none"
                  strokeWidth={2.08}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-primary"
                />
              )}
              {tail1Path && (
                <path
                  d={tail1Path}
                  fill="none"
                  strokeWidth={3.12}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-primary"
                />
              )}
              {bodyPath && (
                <path
                  d={bodyPath}
                  fill="none"
                  strokeWidth={4.16}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-primary"
                />
              )}
              {head && (
                <circle
                  cx={head.x}
                  cy={head.y}
                  r={2.392}
                  className="fill-primary"
                  style={{ opacity: 0.82 }}
                />
              )}
            </svg>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary" />
                {now ? `${cal.daysLeft} days left this year` : ""}
              </span>
              <span>·</span>
              <span>
                {cal.year} · day {cal.dayOfYear}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-5">
              <span className="eyebrow mr-2">Snake</span>
              {(Object.keys(SNAKE_SPEEDS) as SnakeSpeed[]).map((s) => (
                <button
                  key={s}
                  onClick={() => changeSpeed(s)}
                  aria-pressed={speed === s}
                  className={`min-h-9 rounded border px-3 font-mono text-xs ${
                    speed === s
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
              <button
                onClick={toggleAnimate}
                aria-pressed={running}
                className="min-h-9 rounded border border-border px-3 font-mono text-xs text-muted-foreground hover:text-foreground"
              >
                {running ? "Pause" : "Animate"}
              </button>
              <button
                onClick={regrowNow}
                className="flex min-h-9 items-center gap-1.5 rounded border border-border px-3 font-mono text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3" />
                Regrow
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-pixel text-3xl text-foreground">{value}</p>
      <p className="mt-1 font-mono text-[11px] text-subtle">{label}</p>
    </div>
  );
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
  const opts = [
    "Toggle dashboard modules",
    "Custom layout",
    "Personal links",
    "Four accent colours",
    "Cat, dog or dinosaur",
    "Pixel scene on / off",
    "Command bar settings",
    "Year animation settings",
  ];
  return (
    <section className={`accent-${accent} border-t border-border py-24 lg:py-32`}>
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <SectionHead
            index="08"
            label="Personalization"
            title={
              <>
                Make it feel like <em className="text-live transition-colors">yours.</em>
              </>
            }
          />
          <Reveal className="mt-10 space-y-6">
            <div>
              <p className="eyebrow mb-3">Accent</p>
              <div className="flex gap-3" role="radiogroup" aria-label="Accent colour">
                {ACCENTS.map((a) => (
                  <button
                    key={a.id}
                    role="radio"
                    aria-checked={accent === a.id}
                    aria-label={a.label}
                    onClick={() => setAccent(a.id)}
                    className={`size-11 rounded-full ${a.cls} ring-offset-4 ring-offset-background transition ${accent === a.id ? "ring-2 ring-foreground" : "opacity-70 hover:opacity-100"}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="eyebrow mb-3">Companion</p>
              <div className="grid grid-cols-3 gap-2">
                {PETS.map((p) => (
                  <Toggle key={p} on={pet === p} onClick={() => setPet(p)}>
                    {p === "dinosaur" ? "Dino" : p.charAt(0).toUpperCase() + p.slice(1)}
                  </Toggle>
                ))}
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-6 font-mono text-[11px] text-muted-foreground">
              {opts.map((o) => (
                <li key={o} className="before:mr-1.5 before:text-live before:content-['▪']">
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-7">
          <WindowFrame title={`focusframe — ${accent}`}>
            <DashboardMock pet={pet} />
          </WindowFrame>
        </Reveal>
      </div>
    </section>
  );
}
