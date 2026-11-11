import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { Pet } from "./pixel";
import { Reveal, SectionHead, WindowFrame } from "./shared";
import { ProductGif } from "./mockups";
import { ACCENTS, useAccent } from "@/lib/theme";
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
      className={`flex min-h-11 items-center justify-center gap-1.5 rounded border font-mono text-xs transition-colors ${on ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
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
          <SectionHead index="06" label="Year in dots" title="See your year taking shape.">
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

export function Personalize() {
  const { accent, setAccent } = useAccent();
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
  const activeAccent = ACCENTS.find((a) => a.id === accent) ?? ACCENTS[0]!;

  return (
    <section className="border-t border-border py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <SectionHead
            index="07"
            label="Personalization"
            title={
              <>
                Make it feel like <em className="text-primary transition-colors">yours.</em>
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
                    className={`size-11 rounded-full ${a.bgClass} ring-offset-4 ring-offset-background transition ${
                      accent === a.id ? "ring-2 ring-foreground" : "opacity-70 hover:opacity-100"
                    }`}
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
                <li key={o} className="before:mr-1.5 before:text-primary before:content-['▪']">
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-7">
          <WindowFrame title={`focusframe — ${accent}`}>
            <ProductGif pet={pet} />
          </WindowFrame>
        </Reveal>
      </div>
    </section>
  );
}
