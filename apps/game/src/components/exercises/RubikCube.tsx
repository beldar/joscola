"use client";

import type { RubikMove } from "@/lib/exercises/types";

interface RubikCubeProps {
  move?: RubikMove;
  showArrow?: boolean;
  showLabels?: boolean;
  size?: number;
}

// Oblique projection constants
const S = 46;
const EX: [number, number] = [1, 0];
const EY: [number, number] = [0, -1];
const EZ: [number, number] = [-0.46, 0.46];

function proj(x: number, y: number, z: number): [number, number] {
  return [
    S * (x * EX[0] + y * EY[0] + z * EZ[0]),
    S * (x * EX[1] + y * EY[1] + z * EZ[1]),
  ];
}

function toSvgPoints(pts: [number, number][]): string {
  return pts.map(([x, y]) => `${x},${y}`).join(" ");
}

// Highlighted cell sets for each move (face, row, col) where face is U/R/F
// U face: y=3 plane, cells indexed [row 0-2][col 0-2] (row=z from 0 to 2, col=x from 0 to 2)
// R face: x=3 plane, cells indexed [row 0-2][col 0-2] (row=y from 2 to 0, col=z from 2 to 0)
// F face: z=3 plane, cells indexed [row 0-2][col 0-2] (row=y from 2 to 0, col=x from 0 to 2)

type FaceCell = { face: "U" | "R" | "F"; row: number; col: number };

function getHighlightedCells(move: RubikMove): FaceCell[] {
  switch (move) {
    case "R":
    case "R'":
      // Whole R face + right column of F + right column of U
      return [
        ...allCells("R"),
        { face: "F", row: 0, col: 2 },
        { face: "F", row: 1, col: 2 },
        { face: "F", row: 2, col: 2 },
        { face: "U", row: 0, col: 2 },
        { face: "U", row: 1, col: 2 },
        { face: "U", row: 2, col: 2 },
      ];
    case "L":
    case "L'":
      // Left column of F + left column of U (L face is hidden)
      return [
        { face: "F", row: 0, col: 0 },
        { face: "F", row: 1, col: 0 },
        { face: "F", row: 2, col: 0 },
        { face: "U", row: 0, col: 0 },
        { face: "U", row: 1, col: 0 },
        { face: "U", row: 2, col: 0 },
      ];
    case "U":
    case "U'":
      // Whole U face + top row of F + top row of R
      return [
        ...allCells("U"),
        { face: "F", row: 0, col: 0 },
        { face: "F", row: 0, col: 1 },
        { face: "F", row: 0, col: 2 },
        { face: "R", row: 0, col: 0 },
        { face: "R", row: 0, col: 1 },
        { face: "R", row: 0, col: 2 },
      ];
    case "D":
    case "D'":
      // Bottom row of F + bottom row of R (D face hidden)
      return [
        { face: "F", row: 2, col: 0 },
        { face: "F", row: 2, col: 1 },
        { face: "F", row: 2, col: 2 },
        { face: "R", row: 2, col: 0 },
        { face: "R", row: 2, col: 1 },
        { face: "R", row: 2, col: 2 },
      ];
    case "F":
    case "F'":
      return allCells("F");
    case "B":
    case "B'":
      // Back row of U + back column of R (B face hidden)
      return [
        { face: "U", row: 2, col: 0 },
        { face: "U", row: 2, col: 1 },
        { face: "U", row: 2, col: 2 },
        { face: "R", row: 0, col: 2 },
        { face: "R", row: 1, col: 2 },
        { face: "R", row: 2, col: 2 },
      ];
    default:
      return [];
  }
}

function allCells(face: "U" | "R" | "F"): FaceCell[] {
  const cells: FaceCell[] = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      cells.push({ face, row: r, col: c });
  return cells;
}

// Compute the 4 SVG corners of a face cell
// U face: y=3, x goes 0→3 (col), z goes 0→3 (row, 0=front)
// R face: x=3, z goes 3→0 (col), y goes 3→0 (row, 0=top)
// F face: z=3, x goes 0→3 (col), y goes 3→0 (row, 0=top)
function cellPolygon(face: "U" | "R" | "F", row: number, col: number): [number, number][] {
  if (face === "F") {
    const x0 = col, x1 = col + 1;
    const y0 = 3 - row, y1 = 3 - row - 1;
    return [proj(x0, y0, 3), proj(x1, y0, 3), proj(x1, y1, 3), proj(x0, y1, 3)];
  } else if (face === "R") {
    const z0 = 3 - col, z1 = 3 - col - 1;
    const y0 = 3 - row, y1 = 3 - row - 1;
    return [proj(3, y0, z0), proj(3, y0, z1), proj(3, y1, z1), proj(3, y1, z0)];
  } else {
    // U
    const x0 = col, x1 = col + 1;
    const z0 = row, z1 = row + 1;
    return [proj(x0, 3, z0), proj(x1, 3, z0), proj(x1, 3, z1), proj(x0, 3, z1)];
  }
}

// Arrow arc parameters per face
// A: right vector (3D), Dn: down vector (3D), center of the face in 3D
const faceArrowParams: Record<string, { center: [number, number, number]; A: [number, number, number]; Dn: [number, number, number] }> = {
  F: { center: [1.5, 1.5, 3], A: [1, 0, 0], Dn: [0, -1, 0] },
  B: { center: [1.5, 1.5, 0], A: [-1, 0, 0], Dn: [0, -1, 0] },
  R: { center: [3, 1.5, 1.5], A: [0, 0, -1], Dn: [0, -1, 0] },
  L: { center: [0, 1.5, 1.5], A: [0, 0, 1], Dn: [0, -1, 0] },
  U: { center: [1.5, 3, 1.5], A: [1, 0, 0], Dn: [0, 0, 1] },
  D: { center: [1.5, 0, 1.5], A: [1, 0, 0], Dn: [0, 0, -1] },
};

function vecProj(v: [number, number, number]): [number, number] {
  return proj(v[0], v[1], v[2]);
}

function add2(a: [number, number], b: [number, number]): [number, number] {
  return [a[0] + b[0], a[1] + b[1]];
}

function scale2(a: [number, number], s: number): [number, number] {
  return [a[0] * s, a[1] * s];
}

function buildArrow(move: RubikMove): { path: string; arrowTip: [number, number]; arrowDir: [number, number] } | null {
  const face = move.replace("'", "") as "R" | "L" | "U" | "D" | "F" | "B";
  const params = faceArrowParams[face];
  if (!params) return null;

  const { center, A, Dn } = params;
  const isPrime = move.endsWith("'");

  // Project center and axis vectors to 2D
  const c2 = proj(center[0], center[1], center[2]);
  const a2 = [vecProj(A)[0] - proj(0, 0, 0)[0], vecProj(A)[1] - proj(0, 0, 0)[1]] as [number, number];
  const d2 = [vecProj(Dn)[0] - proj(0, 0, 0)[0], vecProj(Dn)[1] - proj(0, 0, 0)[1]] as [number, number];

  const R = 52; // arc radius in SVG units
  const startDeg = isPrime ? 230 : -50;
  const endDeg = isPrime ? -50 : 230;

  function arcPoint(deg: number): [number, number] {
    const rad = (deg * Math.PI) / 180;
    const local: [number, number] = [Math.cos(rad) * R, Math.sin(rad) * R];
    return add2(c2, add2(scale2(a2, local[0] / S), scale2(d2, local[1] / S)));
  }

  const startPt = arcPoint(startDeg);
  const endPt = arcPoint(endDeg);
  // midpoint for SVG arc (we use a quadratic approximation with a mid arc point)
  const midPt = arcPoint((startDeg + endDeg) / 2);

  // SVG large-arc
  const dx = endPt[0] - startPt[0];
  const dy = endPt[1] - startPt[1];
  // Use rx=ry=R in ellipse terms (approximated in projected space)
  const path = `M ${startPt[0].toFixed(1)} ${startPt[1].toFixed(1)} Q ${midPt[0].toFixed(1)} ${midPt[1].toFixed(1)} ${endPt[0].toFixed(1)} ${endPt[1].toFixed(1)}`;

  // Arrow tip tangent at endDeg
  const tangentDeg = endDeg + (isPrime ? -90 : 90);
  const tangentRad = (tangentDeg * Math.PI) / 180;
  const tangent: [number, number] = [Math.cos(tangentRad), Math.sin(tangentRad)];
  const tangent2d = add2(scale2(a2, tangent[0] / S * R * 0.3), scale2(d2, tangent[1] / S * R * 0.3)) as [number, number];
  const norm = Math.sqrt(tangent2d[0] ** 2 + tangent2d[1] ** 2) || 1;

  return {
    path,
    arrowTip: endPt,
    arrowDir: [tangent2d[0] / norm, tangent2d[1] / norm],
  };
}

function arrowhead(tip: [number, number], dir: [number, number]): string {
  const len = 10;
  const spread = 5;
  const perp: [number, number] = [-dir[1], dir[0]];
  const base = add2(tip, scale2(dir, -len));
  const p1 = add2(base, scale2(perp, spread));
  const p2 = add2(base, scale2(perp, -spread));
  return `M ${tip[0].toFixed(1)} ${tip[1].toFixed(1)} L ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L ${p2[0].toFixed(1)} ${p2[1].toFixed(1)} Z`;
}

// Compute viewBox: find bounds of entire cube projection
function computeViewBox(): { x: number; y: number; w: number; h: number } {
  const corners = [
    proj(0, 0, 0), proj(3, 0, 0), proj(0, 3, 0), proj(3, 3, 0),
    proj(0, 0, 3), proj(3, 0, 3), proj(0, 3, 3), proj(3, 3, 3),
  ];
  const xs = corners.map(([x]) => x);
  const ys = corners.map(([, y]) => y);
  const pad = 70;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const maxX = Math.max(...xs) + pad;
  const maxY = Math.max(...ys) + pad;
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

const FACE_COLORS: Record<"U" | "R" | "F", string> = {
  U: "#e8e8e8",
  R: "#d0d0d0",
  F: "#f0f0f0",
};
const HIGHLIGHT_COLOR = "#FFD700";
const STROKE = "#555";
const STROKE_HIGHLIGHT = "#cc8800";

export function RubikCube({ move, showArrow = true, showLabels = false, size = 220 }: RubikCubeProps) {
  const highlighted = move ? new Set(getHighlightedCells(move).map(c => `${c.face}-${c.row}-${c.col}`)) : new Set<string>();
  const vb = computeViewBox();

  const renderFace = (face: "U" | "R" | "F") =>
    Array.from({ length: 3 }, (_, row) =>
      Array.from({ length: 3 }, (_, col) => {
        const key = `${face}-${row}-${col}`;
        const isHighlighted = highlighted.has(key);
        const pts = cellPolygon(face, row, col);
        return (
          <polygon
            key={key}
            points={toSvgPoints(pts)}
            fill={isHighlighted ? HIGHLIGHT_COLOR : FACE_COLORS[face]}
            stroke={isHighlighted ? STROKE_HIGHLIGHT : STROKE}
            strokeWidth={isHighlighted ? 1.5 : 1}
          />
        );
      })
    );

  const arrow = move && showArrow ? buildArrow(move) : null;

  // Label positions
  const labelF = proj(1.5, 1.5, 3);
  const labelU = proj(1.5, 3, 1.5);
  const labelR = proj(3, 1.5, 1.5);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      style={{ display: "block" }}
    >
      {/* U face (top) — painted first */}
      {renderFace("U")}
      {/* R face (right) */}
      {renderFace("R")}
      {/* F face (front) — painted last so it overlaps */}
      {renderFace("F")}

      {/* Labels */}
      {showLabels && (
        <>
          <text x={labelF[0]} y={labelF[1]} textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="bold" fill="#333">F</text>
          <text x={labelU[0]} y={labelU[1]} textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold" fill="#333">U</text>
          <text x={labelR[0]} y={labelR[1]} textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold" fill="#333">R</text>
        </>
      )}

      {/* Arrow */}
      {arrow && (
        <>
          <path d={arrow.path} fill="none" stroke="#e05000" strokeWidth="3.5" strokeLinecap="round" />
          <path d={arrowhead(arrow.arrowTip, arrow.arrowDir)} fill="#e05000" />
        </>
      )}
    </svg>
  );
}
