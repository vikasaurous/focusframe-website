import { useEffect, useState } from "react";

/**
 * CTA-only mascots: the SAME boy and cat as the extension scene, new pose.
 * Pixel rows + palette copied from src/scene/sceneSprites.js (unchanged there).
 *   - head: headFront / headFrontBlink, verbatim
 *   - body: original `body`; rows 8-14 (hidden behind the laptop lid in the
 *     extension) filled with the original hoodie torso row
 *   - cat: catSitA / catSitB, verbatim. Only difference is the tail, so
 *     swapping A/B on hover is the tail wag
 *   - new art (derived, original palette keys only): standing arms, small laptop
 *   - ground: same top line + dot pattern as the extension renderer
 */

const PALETTE: Record<string, string> = {
  k: "#6c717d",
  K: "#8f95a2",
  s: "#eceef2",
  S: "#c6cad3",
  e: "#1b1d22",
  m: "#6b707b",
  P: "#d3d6dd",
  H: "#f3f4f6",
  h: "#b7bcc7",
  A: "#ffffff",
  J: "#9aa0ad",
  j: "#757b88",
  F: "#fbfbfc",
  f: "#a3a9b6",
  l: "#d2d6dd",
  W: "#fafafb",
  D: "#7b818d",
  o: "#c3c7cf",
  O: "#9399a5",
  p: "#e3e5ea",
  n: "#aeb3bd",
  c: "#f6f7f9",
};
const GROUND = { top: "#3b3f47", body: "#1b1d22", dot: "#262a31" };

const HEAD_FRONT = [
  "...kkkkkk...",
  "..kkKKkkkk..",
  ".kkkKkkkkkk.",
  ".kkkkkkkkkk.",
  ".kkskskkskk.",
  ".kssssssssk.",
  ".SssessessS.",
  ".SssessessS.",
  ".SsPssssPsS.",
  "..ssmssmss..",
  "...ssmmss...",
];
const HEAD_FRONT_BLINK = [
  "...kkkkkk...",
  "..kkKKkkkk..",
  ".kkkKkkkkkk.",
  ".kkkkkkkkkk.",
  ".kkskskkskk.",
  ".kssssssssk.",
  ".SssssssssS.",
  ".SssessessS.",
  ".SsPssssPsS.",
  "..ssmssmss..",
  "...ssmmss...",
];

const TORSO = "...HHHHHHHHHHhhhh...";
const BODY_SRC = [
  "......hh.SS.hh......",
  "....HHHHHHHHHHHH....",
  "...HHHHHFHHFHhhhh...",
  "...HHHHHFHHFHhhhh...",
  "...HHHHHHHHHHhhhh...",
  "...HHHHHHHHHHhhhh...",
  "...HHHHHHHHHHhhhh...",
  "...HHHHHHHHHHhhhh...",
  "....................",
  "....................",
  "....................",
  "....................",
  "....................",
  "....................",
  "....................",
  "...JJJJJJJJJJJJJJ...",
  "...JJJJJJJJJJJJJJ...",
  "....JJJj....JJJj....",
  "....JJJj....JJJj....",
  "....JJJj....JJJj....",
  "....JJJj....JJJj....",
  "....JJJj....JJJj....",
  "....JJJj....JJJj....",
  "....JJJj....JJJj....",
  "....JJJj....JJJj....",
  "....JJJj....JJJj....",
  "...FFFFF....FFFFF...",
  "...fffff....fffff...",
];
const BODY = BODY_SRC.map((r, i) => (i >= 8 && i <= 14 ? TORSO : r));

/** Closed laptop held to the chest. Lid colours from the extension `lid` sprite. */
const LAPTOP = ["WWWWWWWD", "WllllllD", "WllAAllD", "WllllllD", "DDDDDDDD"];

/** Viewer-left arm: sleeve down, hand wrapped over laptop edge. */
const ARM_HOLD = [
  "....................",
  "....................",
  "hHH.................",
  "hHH.................",
  "hHH.................",
  "hHH.................",
  "hHH.................",
  "hHH.................",
  "HHH.................",
  "HHH.................",
  "HHH.................",
  "HHHss...............",
  "..ss................",
];

/** Viewer-right arm raised, two wave frames. */
const ARM_WAVE_A = [".ss.", ".ss.", "hHH.", "hHH.", "hHH.", "hHH.", "hHH.", "hHH.", "HHH.", "HHH."];
const ARM_WAVE_B = ["..ss", "..ss", ".hHH", ".hHH", "hHH.", "hHH.", "hHH.", "hHH.", "HHH.", "HHH."];

const CAT_SIT_A = [
  "........oo..oo....",
  "........opoopo....",
  "........ooooeo....",
  "........oooccn....",
  ".....ooooooccc....",
  ".....ooooooccc....",
  ".....ooooooooo....",
  ".....oOOooo.......",
  ".....oOOoocc......",
  ".....oOOoocc......",
  ".....ooooocc......",
  ".OoooooOOOcc......",
  ".ooooooOOOcc......",
];
const CAT_SIT_B = [
  "........oo..oo....",
  "........opoopo....",
  "........ooooeo....",
  "........oooccn....",
  ".....ooooooccc....",
  "..Oo.ooooooccc....",
  "..oo.ooooooooo....",
  "..oo.oOOooo.......",
  "..oo.oOOoocc......",
  "..oo.oOOoocc......",
  "..oo.ooooocc......",
  "..ooooOOOOcc......",
  "..ooooOOOOcc......",
];

const W = 46;
const GROUND_Y = 39;
const H = GROUND_Y + 6;
const BX = 2;
const BY = 11;
const CAT_X = 26;
const CAT_W = 18;
const CAT_H = 13;

function Layer({ rows, x, y }: { rows: readonly string[]; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {rows.flatMap((row, ry) =>
        [...row].map((ch, rx) =>
          ch === "." ? null : (
            <rect key={`${rx}-${ry}`} x={rx} y={ry} width={1.02} height={1.02} fill={PALETTE[ch]} />
          ),
        ),
      )}
    </g>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Give a fixed width in className (whole-number pixel scale: 46 cols x 3 or x 4). */
export function CtaMascots({ className = "w-full" }: { className?: string }) {
  const reduced = useReducedMotion();
  const [wave, setWave] = useState(false);
  const [blink, setBlink] = useState(false);
  const [hover, setHover] = useState(false);
  const [tail, setTail] = useState(false);

  // boy: stepped wave, independent of laptop, body, cat
  useEffect(() => {
    if (reduced) {
      setWave(false);
      return;
    }
    const id = window.setInterval(() => setWave((w) => !w), 450);
    return () => window.clearInterval(id);
  }, [reduced]);

  // boy: occasional blink
  useEffect(() => {
    if (reduced) {
      setBlink(false);
      return;
    }
    let t1 = 0;
    let t2 = 0;
    const loop = () => {
      t1 = window.setTimeout(
        () => {
          setBlink(true);
          t2 = window.setTimeout(() => {
            setBlink(false);
            loop();
          }, 160);
        },
        2200 + Math.random() * 3500,
      );
    };
    loop();
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reduced]);

  // cat: tail wags only while hovered; head and body never change
  useEffect(() => {
    if (reduced || !hover) {
      setTail(false);
      return;
    }
    setTail(true);
    const id = window.setInterval(() => setTail((t) => !t), 280);
    return () => window.clearInterval(id);
  }, [hover, reduced]);

  const dots: number[] = [];
  for (let x = 3; x < W; x += 7) dots.push(x);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Pixel-art FocusFrame boy waving, a laptop under his arm, with his cat sitting beside him"
      className={`block h-auto ${className}`}
    >
      <rect y={GROUND_Y} width={W} height={H - GROUND_Y} fill={GROUND.body} />
      <rect y={GROUND_Y} width={W} height={1} fill={GROUND.top} />
      {dots.map((x) => (
        <g key={x} fill={GROUND.dot}>
          <rect x={x} y={GROUND_Y + 2} width={2} height={1} />
          <rect x={x + 3} y={GROUND_Y + 4} width={2} height={1} />
        </g>
      ))}

      {/* boy: body, laptop, holding arm, head; waving arm separate */}
      <Layer rows={BODY} x={BX} y={BY} />
      <Layer rows={LAPTOP} x={BX + 3} y={BY + 9} />
      <Layer rows={ARM_HOLD} x={BX} y={BY} />
      <Layer rows={blink ? HEAD_FRONT_BLINK : HEAD_FRONT} x={BX + 4} y={BY - 11} />
      <Layer rows={wave ? ARM_WAVE_B : ARM_WAVE_A} x={BX + 16} y={BY - 6} />

      {/* cat: sits, flipped to face the boy; hover wags tail */}
      <g
        transform={`translate(${CAT_X + CAT_W} ${GROUND_Y - CAT_H}) scale(-1 1)`}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onPointerCancel={() => setHover(false)}
      >
        <Layer rows={tail ? CAT_SIT_B : CAT_SIT_A} x={0} y={0} />
        <rect width={CAT_W} height={CAT_H} fill="transparent" />
      </g>
    </svg>
  );
}
