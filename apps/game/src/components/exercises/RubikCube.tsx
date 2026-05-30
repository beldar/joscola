"use client";

import type { RubikMove } from "@/lib/exercises/types";

interface RubikCubeProps {
  move?: RubikMove;
  showArrow?: boolean;
  showLabels?: boolean;
  size?: number;
}

// Oblique projection: x→right, y→up, z→toward viewer
const S = 46;
function proj(x: number, y: number, z: number): [number, number] {
  return [S * (x - 0.46 * z), S * (-y + 0.46 * z)];
}

function toSvgPoints(pts: [number, number][]): string {
  return pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

// ─── Cell highlight definitions ─────────────────────────────────────────────
// Coordinate system:
//   F face (z=3): row=0 is TOP (y=3→2), row=2 is BOTTOM (y=1→0)
//                 col=0 is LEFT (x=0→1), col=2 is RIGHT (x=2→3)
//   R face (x=3): row=0 is TOP (y=3→2), row=2 is BOTTOM (y=1→0)
//                 col=0 is FRONT (z=3→2), col=2 is BACK (z=1→0)
//   U face (y=3): row=0 is BACK (z=0→1), row=2 is FRONT (z=2→3)
//                 col=0 is LEFT (x=0→1), col=2 is RIGHT (x=2→3)

type FaceCell = { face: "U" | "R" | "F"; row: number; col: number };

function allCells(face: "U" | "R" | "F"): FaceCell[] {
  const cells: FaceCell[] = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      cells.push({ face, row: r, col: c });
  return cells;
}

function getHighlightedCells(move: RubikMove): FaceCell[] {
  switch (move) {
    case "R":
    case "R'":
      // Entire R face + right col of F (col 2) + right col of U (col 2)
      return [
        ...allCells("R"),
        ...([0, 1, 2].map(r => ({ face: "F" as const, row: r, col: 2 }))),
        ...([0, 1, 2].map(r => ({ face: "U" as const, row: r, col: 2 }))),
      ];
    case "L":
    case "L'":
      // Left col of F (col 0) + left col of U (col 0) — L face is hidden
      return [
        ...([0, 1, 2].map(r => ({ face: "F" as const, row: r, col: 0 }))),
        ...([0, 1, 2].map(r => ({ face: "U" as const, row: r, col: 0 }))),
      ];
    case "U":
    case "U'":
      // Entire U face + top row of F (row 0) + top row of R (row 0)
      return [
        ...allCells("U"),
        ...([0, 1, 2].map(c => ({ face: "F" as const, row: 0, col: c }))),
        ...([0, 1, 2].map(c => ({ face: "R" as const, row: 0, col: c }))),
      ];
    case "D":
    case "D'":
      // Bottom row of F (row 2) + bottom row of R (row 2) — D face hidden
      return [
        ...([0, 1, 2].map(c => ({ face: "F" as const, row: 2, col: c }))),
        ...([0, 1, 2].map(c => ({ face: "R" as const, row: 2, col: c }))),
      ];
    case "F":
    case "F'":
      return allCells("F");
    case "B":
    case "B'":
      // Back row of U (row 0) + back col of R (col 2) — B face hidden
      return [
        ...([0, 1, 2].map(c => ({ face: "U" as const, row: 0, col: c }))),
        ...([0, 1, 2].map(r => ({ face: "R" as const, row: r, col: 2 }))),
      ];
    default:
      return [];
  }
}

// ─── Cell polygon ────────────────────────────────────────────────────────────
function cellPolygon(face: "U" | "R" | "F", row: number, col: number): [number, number][] {
  if (face === "F") {
    const x0 = col, x1 = col + 1;
    const y0 = 3 - row, y1 = 3 - row - 1;
    return [proj(x0, y0, 3), proj(x1, y0, 3), proj(x1, y1, 3), proj(x0, y1, 3)];
  } else if (face === "R") {
    // col=0→front (z=3), col=2→back (z=1)
    const z0 = 3 - col, z1 = 3 - col - 1;
    const y0 = 3 - row, y1 = 3 - row - 1;
    return [proj(3, y0, z0), proj(3, y0, z1), proj(3, y1, z1), proj(3, y1, z0)];
  } else {
    // U: row=0→back (z=0), row=2→front (z=2)
    const x0 = col, x1 = col + 1;
    const z0 = row, z1 = row + 1;
    return [proj(x0, 3, z0), proj(x1, 3, z0), proj(x1, 3, z1), proj(x0, 3, z1)];
  }
}

// ─── Arrow system ────────────────────────────────────────────────────────────
// Each arrow is a quadratic Bézier defined by 3 3D points, projected to 2D.
// Arrows sit on the visible highlighted strips.
// For prime moves: start and end are swapped to reverse the direction.

type P3 = [number, number, number];

// Non-prime arrow definitions [start, ctrl, end] in cube coords
// Direction = direction pieces move (standard Singmaster notation):
//   R : F-right-col / U-right-col go UP
//   L : F-left-col / U-left-col go DOWN
//   U : F-top-row goes RIGHT (toward R)
//   D : F-bottom-row goes RIGHT (toward R)
//   F : CW circular arc on F face
//   B : U-back-row goes LEFT (toward L)
const ARROW_DEFS: Partial<Record<string, [P3, P3, P3]>> = {
  R: [[3, 0.3, 3],   [3.65, 1.5, 3],   [3, 2.7, 3]],    // up on F-R edge
  L: [[0, 2.7, 3],   [-0.65, 1.5, 3],  [0, 0.3, 3]],    // down on F-L edge
  U: [[0.3, 3, 2.8], [1.5, 3.3, 2.8],  [2.7, 3, 2.8]], // right near front of U face
  D: [[0.3, 0, 3],   [1.5, -0.5, 3],   [2.7, 0, 3]],   // right on F bottom edge
  B: [[2.7, 3, 0.2], [1.5, 3.6, 0.2],  [0.3, 3, 0.2]], // left on U back row
};

interface ArrowResult {
  path: string;
  tip: [number, number];
  tipDir: [number, number];
}

function buildArrow(move: RubikMove): ArrowResult | null {
  const base = move.replace("'", "");
  const isPrime = move.endsWith("'");

  if (base === "F") return buildFArrow(isPrime);

  const def = ARROW_DEFS[base];
  if (!def) return null;

  let [s3, c3, e3] = def;
  if (isPrime) [s3, e3] = [e3, s3];

  const s2 = proj(...s3);
  const c2 = proj(...c3);
  const e2 = proj(...e3);

  const path = `M ${s2[0].toFixed(1)} ${s2[1].toFixed(1)} Q ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${e2[0].toFixed(1)} ${e2[1].toFixed(1)}`;

  // Tangent at end of quadratic Bézier = direction from ctrl to end
  const dx = e2[0] - c2[0];
  const dy = e2[1] - c2[1];
  const len = Math.sqrt(dx * dx + dy * dy) || 1;

  return { path, tip: e2, tipDir: [dx / len, dy / len] };
}

function buildFArrow(isPrime: boolean): ArrowResult {
  // F face projects to a square in SVG, so a true circle arc works.
  const [cx, cy] = proj(1.5, 1.5, 3);
  const R = 56;

  // Gap at top of circle (SVG 270° = up). Arc spans 300°.
  // CW (F) : sweep=1, start=300°, end=240°
  // CCW (F'): sweep=0, start=240°, end=300°
  const startDeg = isPrime ? 240 : 300;
  const endDeg = isPrime ? 300 : 240;

  const sr = (startDeg * Math.PI) / 180;
  const er = (endDeg * Math.PI) / 180;

  const sx = cx + R * Math.cos(sr);
  const sy = cy + R * Math.sin(sr);
  const ex = cx + R * Math.cos(er);
  const ey = cy + R * Math.sin(er);

  const sweep = isPrime ? 0 : 1;
  const path = `M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${R} ${R} 0 1 ${sweep} ${ex.toFixed(1)} ${ey.toFixed(1)}`;

  // Tangent at end: for CW (sweep=1), d/dθ at θ = (-sin θ, cos θ)
  // For CCW (sweep=0), tangent is negated
  const sign = isPrime ? -1 : 1;
  const tx = sign * (-Math.sin(er));
  const ty = sign * Math.cos(er);
  const tlen = Math.sqrt(tx * tx + ty * ty) || 1;

  return { path, tip: [ex, ey], tipDir: [tx / tlen, ty / tlen] };
}

function arrowhead(tip: [number, number], dir: [number, number]): string {
  const len = 11, spread = 5;
  const perp: [number, number] = [-dir[1], dir[0]];
  const bx = tip[0] - dir[0] * len;
  const by = tip[1] - dir[1] * len;
  const p1x = bx + perp[0] * spread, p1y = by + perp[1] * spread;
  const p2x = bx - perp[0] * spread, p2y = by - perp[1] * spread;
  return `M ${tip[0].toFixed(1)} ${tip[1].toFixed(1)} L ${p1x.toFixed(1)} ${p1y.toFixed(1)} L ${p2x.toFixed(1)} ${p2y.toFixed(1)} Z`;
}

// ─── ViewBox ─────────────────────────────────────────────────────────────────
const CUBE_CORNERS = [
  proj(0,0,0), proj(3,0,0), proj(0,3,0), proj(3,3,0),
  proj(0,0,3), proj(3,0,3), proj(0,3,3), proj(3,3,3),
];
const PAD = 75;
const VB_X = Math.min(...CUBE_CORNERS.map(([x]) => x)) - PAD;
const VB_Y = Math.min(...CUBE_CORNERS.map(([, y]) => y)) - PAD;
const VB_W = Math.max(...CUBE_CORNERS.map(([x]) => x)) - VB_X + PAD;
const VB_H = Math.max(...CUBE_CORNERS.map(([, y]) => y)) - VB_Y + PAD;

// ─── Colors ──────────────────────────────────────────────────────────────────
const FACE_BASE: Record<"U" | "R" | "F", string> = { U: "#e0e0e0", R: "#c8c8c8", F: "#ebebeb" };
const HIGHLIGHT = "#FFD700";
const STROKE_BASE = "#666";
const STROKE_HL = "#b87800";
const ARROW_COLOR = "#d94000";

// ─── Component ───────────────────────────────────────────────────────────────
export function RubikCube({ move, showArrow = true, showLabels = false, size = 220 }: RubikCubeProps) {
  const highlightSet = move
    ? new Set(getHighlightedCells(move).map(c => `${c.face}-${c.row}-${c.col}`))
    : new Set<string>();

  const renderFace = (face: "U" | "R" | "F") =>
    [0, 1, 2].flatMap(row =>
      [0, 1, 2].map(col => {
        const key = `${face}-${row}-${col}`;
        const hl = highlightSet.has(key);
        return (
          <polygon
            key={key}
            points={toSvgPoints(cellPolygon(face, row, col))}
            fill={hl ? HIGHLIGHT : FACE_BASE[face]}
            stroke={hl ? STROKE_HL : STROKE_BASE}
            strokeWidth={hl ? 1.5 : 0.8}
          />
        );
      })
    );

  const arrow = move && showArrow ? buildArrow(move) : null;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
      style={{ display: "block" }}
    >
      {renderFace("U")}
      {renderFace("R")}
      {renderFace("F")}

      {showLabels && (() => {
        const lF = proj(1.5, 1.5, 3);
        const lU = proj(1.5, 3, 1.5);
        const lR = proj(3, 1.5, 1.5);
        return (
          <>
            <text x={lF[0]} y={lF[1]} textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="bold" fill="#333">F</text>
            <text x={lU[0]} y={lU[1]} textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="bold" fill="#333">U</text>
            <text x={lR[0]} y={lR[1]} textAnchor="middle" dominantBaseline="middle" fontSize="15" fontWeight="bold" fill="#333">R</text>
          </>
        );
      })()}

      {arrow && (
        <>
          <path d={arrow.path} fill="none" stroke={ARROW_COLOR} strokeWidth="3.5" strokeLinecap="round" />
          <path d={arrowhead(arrow.tip, arrow.tipDir)} fill={ARROW_COLOR} />
        </>
      )}
    </svg>
  );
}
