/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";

/** Character → pixel-palette CSS var. "." is transparent. */
const PALETTE: Record<string, string> = {
  h: "var(--px-hair)",
  s: "var(--px-skin)",
  t: "var(--px-shirt)",
  p: "var(--px-pants)",
  l: "var(--px-laptop)",
  v: "var(--px-screen)",
  b: "var(--px-wood)",
  B: "var(--px-wood-2)",
  c: "var(--px-cat)",
  d: "var(--px-dog)",
  g: "var(--px-dino)",
  e: "var(--px-eye)",
  y: "var(--px-sun)",
  m: "var(--px-moon)",
  k: "var(--px-hair)",
  T: "var(--px-tree)",
  w: "var(--foreground)",
  r: "var(--primary)",
};

export function Sprite({
  rows,
  x = 0,
  y = 0,
  className,
}: {
  rows: string[];
  x?: number;
  y?: number;
  className?: string;
}) {
  const cells: ReactNode[] = [];
  rows.forEach((row, ry) =>
    [...row].forEach((ch, rx) => {
      if (ch === "." || ch === " ") return;
      cells.push(
        <rect
          key={`${rx}-${ry}`}
          x={x + rx}
          y={y + ry}
          width={1.02}
          height={1.02}
          fill={PALETTE[ch]}
        />,
      );
    }),
  );
  return <g className={className}>{cells}</g>;
}

export const PERSON = [
  "...hhhh.....",
  "..hhhhhh....",
  "..hsssss....",
  "..ssesss....",
  "...ssss.....",
  "..tttttt....",
  ".ttttttvvv..",
  ".tt.ttlvvv..",
  ".tt.tlllll..",
  "..pppppppp..",
  "..pppppppp..",
  ".......pp...",
  ".......pp...",
  ".......kk...",
];

export const BENCH = [
  "bbbbbbbbbbbbbbbbbb",
  "BBBBBBBBBBBBBBBBBB",
  ".B..............B.",
  ".B..............B.",
  ".B..............B.",
];

export const PETS = {
  cat: ["c...c....", "cc.cc....", "ccccc...c", "cecec...c", "cccccccc.", ".cccccc..", ".c.c.c.c."],
  dog: ["dd.......", "ddddd....", "ddedd...d", "ddddddddd", ".ddddddd.", ".ddddddd.", ".d.d.d.d."],
  dinosaur: [
    "...gggg..",
    "...gegg..",
    "...gggg..",
    "g.gggg...",
    "gggggggg.",
    ".gggggg..",
    "..g...g..",
  ],
} as const;

export type Pet = keyof typeof PETS;

const SUN = [".yyy.", "yyyyy", "yyyyy", "yyyyy", ".yyy."];
const MOON = [".mmm.", "mmm..", "mm...", "mmm..", ".mmm."];
const TREE = ["..TT..", ".TTTT.", "TTTTTT", "TTTTTT", ".TTTT.", "..BB..", "..BB..", "..BB.."];
const STARS = [
  [12, 8],
  [30, 15],
  [48, 6],
  [70, 12],
  [92, 5],
  [104, 18],
  [20, 26],
  [60, 24],
  [84, 28],
  [140, 30],
];

export function PixelScene({
  night = false,
  pet = "cat",
  animate = true,
  className,
  label,
}: {
  night?: boolean;
  pet?: Pet;
  animate?: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 90"
      shapeRendering="crispEdges"
      role="img"
      aria-label={
        label ??
        `Pixel-art scene: a person coding on a bench beside a ${pet} under a ${night ? "night" : "daytime"} sky`
      }
      className={`${className ?? ""} ${animate ? "" : "scene-paused"} pet-hover block h-auto w-full`}
    >
      <rect
        width="160"
        height="90"
        fill={night ? "var(--px-sky-night)" : "var(--px-sky-day)"}
        className="transition-[fill] duration-700"
      />
      <rect
        y="40"
        width="160"
        height="32"
        fill={night ? "var(--px-sky-night-2)" : "var(--px-sky-day-2)"}
        className="transition-[fill] duration-700"
      />
      {night ? (
        <>
          {STARS.map(([sx, sy], i) => (
            <rect
              key={i}
              x={sx}
              y={sy}
              width="1"
              height="1"
              fill="var(--px-star)"
              className="anim-twinkle"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
          <Sprite rows={MOON} x={128} y={10} />
        </>
      ) : (
        <>
          <Sprite rows={SUN} x={128} y={10} />
          {[
            [130, 6],
            [134, 6],
            [124, 12],
            [124, 14],
            [135, 18],
            [139, 12],
            [139, 14],
          ].map(([rx, ry], i) => (
            <rect
              key={i}
              x={rx}
              y={ry}
              width="1"
              height="1"
              fill="var(--px-sun)"
              className="anim-ray"
              style={{ animationDelay: `${i * 0.25}s` }}
            />
          ))}
        </>
      )}
      <Sprite rows={TREE} x={10} y={64} />
      <Sprite rows={TREE} x={142} y={64} />
      <rect y="72" width="160" height="18" fill="var(--px-ground)" />
      <rect y="72" width="160" height="2" fill="var(--px-ground-2)" />
      <Sprite rows={BENCH} x={56} y={63} />
      <Sprite rows={PERSON} x={60} y={52} />
      <g className="anim-pet">
        <g className="pet-body">
          <Sprite rows={[...PETS[pet]]} x={84} y={65} />
        </g>
      </g>
    </svg>
  );
}
