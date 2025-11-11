"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { TrainPositionExercise as TrainPositionType } from "@/lib/exercises/types";

const BEAD_WIDTH = 40;
const BEAD_HEIGHT = 40;
const BEAD_GAP = 10;
const TUNNEL_OVERHANG = 34;
const TRACK_CLEARANCE = 10;
const TUNNEL_CONTAINER_HEIGHT = 210;
const TUNNEL_BASE_HEIGHT = 48;
const TUNNEL_WALKWAY_HEIGHT = 28;
const TUNNEL_VERTICAL_OFFSET = 50;

const BEAD_COLORS = [
  {
    base: "#6ad38b",
    shadow: "#2f994f",
    highlight: "#c7f7d5",
    rim: "#2f6f3f",
    innerGlow: "rgba(213, 255, 226, 0.65)",
  },
  {
    base: "#ffd762",
    shadow: "#e6a909",
    highlight: "#fff6c2",
    rim: "#c48204",
    innerGlow: "rgba(255, 243, 191, 0.65)",
  },
  {
    base: "#b6e24f",
    shadow: "#6da31d",
    highlight: "#e9f9bf",
    rim: "#4d7a15",
    innerGlow: "rgba(242, 255, 210, 0.65)",
  },
];

const TUNNEL_VARIANT_STYLES = {
  stone: {
    archGradient: "linear-gradient(135deg, #f8fafc 0%, #dbe3f1 45%, #9aa9bf 100%)",
    archBorder: "#5b6475",
    innerGradient: "linear-gradient(180deg, rgba(30,41,59,0.65) 0%, rgba(30,41,59,0.25) 60%, rgba(30,41,59,0.05) 100%)",
    blockPattern:
      "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 46px, rgba(15,23,42,0.25) 46px 50px)",
    topGradient: "linear-gradient(180deg, #a3e635 0%, #4d7c0f 100%)",
    baseGradient: "linear-gradient(135deg, #585e68 0%, #374151 100%)",
    baseBorder: "#2b313b",
  },
  moss: {
    archGradient: "linear-gradient(135deg, #eefde1 0%, #b5e98f 45%, #6eaf4d 100%)",
    archBorder: "#44732f",
    innerGradient: "linear-gradient(180deg, rgba(35,78,32,0.6) 0%, rgba(42,108,36,0.2) 70%, rgba(42,108,36,0.05) 100%)",
    blockPattern:
      "repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0 44px, rgba(27,64,30,0.25) 44px 48px)",
    topGradient: "linear-gradient(180deg, #dffabe 0%, #6ab04d 100%)",
    baseGradient: "linear-gradient(135deg, #5f852f 0%, #446622 100%)",
    baseBorder: "#2f4a17",
  },
  wood: {
    archGradient: "linear-gradient(135deg, #ffe8bc 0%, #f6c377 45%, #d08b36 100%)",
    archBorder: "#9c5c16",
    innerGradient: "linear-gradient(180deg, rgba(92,47,12,0.6) 0%, rgba(92,47,12,0.2) 70%, rgba(92,47,12,0.05) 100%)",
    blockPattern:
      "repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 42px, rgba(80,38,5,0.3) 42px 46px)",
    topGradient: "linear-gradient(180deg, #fcdba8 0%, #d99a3d 100%)",
    baseGradient: "linear-gradient(135deg, #a0621b 0%, #6d3e0f 100%)",
    baseBorder: "#61370c",
  },
} as const;

interface Props {
  exercise: TrainPositionType;
  onAnswer: (answers: Map<string, number>) => void;
  answers: Map<string, number>;
}

const shuffle = (array: any[]) => {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

export function TrainPositionExercise({ exercise, onAnswer, answers }: Props) {
  const mode =
    exercise.mode ??
    (exercise.tunnels && exercise.tunnels.length > 0 ? "tunnel-fill" : "fill-signs");

  const [selectedSign, setSelectedSign] = useState<number | null>(null);

  useEffect(() => {
    setSelectedSign(null);
  }, [exercise.id]);

  const availableSigns = useMemo(() => {
    if (mode !== "place-signs") return [];
    if (exercise.availableSigns && exercise.availableSigns.length > 0) {
      return shuffle(exercise.availableSigns);
    }
    return exercise.missingPositions;
  }, [mode, exercise.availableSigns, exercise.missingPositions]);

  const assignedValues = useMemo(() => {
    return exercise.missingPositions
      .map((pos) => answers.get(`pos-${pos}`))
      .filter((val): val is number => typeof val === "number");
  }, [answers, exercise.missingPositions]);

  const isInsideTunnel = (wagonNumber: number) => {
    return (
      exercise.tunnels?.some(({ start, length }) => {
        const end = start + length - 1;
        return wagonNumber >= start && wagonNumber <= end;
      }) ?? false
    );
  };

  const handleInputChange = (position: number, value: string) => {
    const newAnswers = new Map(answers);
    if (value === "") {
      newAnswers.delete(`pos-${position}`);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 1 && numValue <= 99) {
        newAnswers.set(`pos-${position}`, numValue);
      }
    }
    onAnswer(newAnswers);
  };

  const handleSignSelect = (sign: number) => {
    if (mode !== "place-signs") return;
    if (assignedValues.includes(sign)) return;
    setSelectedSign((prev) => (prev === sign ? null : sign));
  };

  const handleSignSpotClick = (wagonNumber: number) => {
    if (mode !== "place-signs") return;
    const key = `pos-${wagonNumber}`;
    const currentValue = answers.get(key);
    const newAnswers = new Map(answers);

    if (selectedSign !== null) {
      for (const [existingKey, val] of newAnswers.entries()) {
        if (val === selectedSign) {
          newAnswers.delete(existingKey);
        }
      }
      newAnswers.set(key, selectedSign);
      setSelectedSign(null);
      onAnswer(newAnswers);
      return;
    }

    if (currentValue !== undefined) {
      newAnswers.delete(key);
      setSelectedSign(currentValue);
      onAnswer(newAnswers);
    }
  };

  const renderTunnel = (
    tunnel: NonNullable<TrainPositionType["tunnels"]>[number],
    idx: number
  ) => {
    const styles =
      TUNNEL_VARIANT_STYLES[tunnel.variant ?? "stone"] ??
      TUNNEL_VARIANT_STYLES.stone;
    const startIndex = tunnel.start - 1;
    const spacing = BEAD_WIDTH + BEAD_GAP;
    const left = startIndex * spacing - TUNNEL_OVERHANG;
    const width =
      tunnel.length * BEAD_WIDTH +
      (tunnel.length - 1) * BEAD_GAP +
      TUNNEL_OVERHANG * 2;
    const baseHeight = TUNNEL_BASE_HEIGHT;
    const walkwayHeight = TUNNEL_WALKWAY_HEIGHT;
    const archBottom = 12;
    const archHeight = TUNNEL_CONTAINER_HEIGHT - archBottom - walkwayHeight;
    const walkwayBottom = archBottom + archHeight - walkwayHeight / 2;

    return (
      <div
        key={`tunnel-${idx}-${tunnel.start}`}
        className="absolute pointer-events-none z-40"
        style={{
          left: `${left}px`,
          width: `${width}px`,
          top: `-${TUNNEL_VERTICAL_OFFSET}px`,
          height: `${TUNNEL_CONTAINER_HEIGHT}px`,
        }}
      >
        <div className="relative h-full w-full">
          <div className="absolute inset-x-10 bottom-3 h-6 rounded-full bg-black/18 blur-lg"></div>

          <div
            className="absolute inset-x-[22px] bottom-0 rounded-b-[32px] border-[6px]"
            style={{
              height: `${baseHeight}px`,
              background: styles.baseGradient,
              borderColor: styles.baseBorder,
              boxShadow: "0 18px 26px rgba(0,0,0,0.28)",
            }}
          ></div>

          <div
            className="absolute inset-x-[30px] rounded-full shadow-inner"
            style={{
              bottom: `${walkwayBottom}px`,
              height: `${walkwayHeight}px`,
              background: styles.topGradient,
              boxShadow: "inset 0 4px 8px rgba(255,255,255,0.55), inset 0 -6px 10px rgba(0,0,0,0.22)",
            }}
          ></div>

          <div
            className="absolute inset-x-[22px] overflow-hidden rounded-t-[132px] border-[6px]"
            style={{
              bottom: `${archBottom}px`,
              height: `${archHeight}px`,
              background: styles.archGradient,
              borderColor: styles.archBorder,
              boxShadow: "0 20px 32px rgba(0,0,0,0.22)",
            }}
          >
            <div
              className="absolute inset-0 opacity-60"
              style={{ backgroundImage: styles.blockPattern }}
            ></div>
            <div
              className="absolute inset-x-[26px] rounded-t-[96px]"
              style={{
                bottom: `${Math.max(24, archBottom + 8)}px`,
                height: `${archHeight - walkwayHeight}px`,
                background: styles.innerGradient,
              }}
            ></div>
            <div className="absolute inset-x-[32px] top-[24px] h-[32px] rounded-full bg-white/55 blur-[1.5px] opacity-70"></div>
          </div>
        </div>
      </div>
    );
  };

  const renderBall = (index: number) => {
    const wagonNumber = index + 1;
    const hasSign = exercise.signPositions.includes(wagonNumber);
    const isMissing = exercise.missingPositions.includes(wagonNumber);
    const value = answers.get(`pos-${wagonNumber}`);
    const colorGroup = Math.floor(index / 5) % BEAD_COLORS.length;
    const color = BEAD_COLORS[colorGroup];
    const underTunnel = mode === "tunnel-fill" && isInsideTunnel(wagonNumber);

    const showEditableSign = mode !== "place-signs" && isMissing;
    const showStaticSign = mode !== "place-signs" && hasSign && !isMissing;
    const showPlacementSpot = mode === "place-signs" && hasSign;

    return (
      <motion.div
        key={index}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.02, type: "spring", stiffness: 200 }}
        className="relative flex flex-col items-center"
        style={{ width: `${BEAD_WIDTH}px`, paddingBottom: `${TRACK_CLEARANCE}px` }}
      >
        {showEditableSign && (
          <div className="absolute -top-36 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center">
            <div className="relative flex h-20 w-[110px] items-center justify-center rounded-2xl border-[5px] border-amber-700 bg-gradient-to-b from-amber-50 to-amber-200 px-5 shadow-lg">
              <span className="pointer-events-none absolute inset-2 rounded-xl border-2 border-amber-400/70 border-dashed"></span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={value ?? ""}
                onChange={(e) => handleInputChange(wagonNumber, e.target.value)}
                className="relative z-10 h-12 w-20 rounded-lg border-2 border-amber-500 bg-white/90 text-center text-2xl font-bold text-amber-800 shadow-inner focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder=""
                maxLength={2}
                aria-label={`Posició ${wagonNumber}`}
              />
            </div>
            <div className="h-14 w-[6px] rounded-full bg-amber-700 shadow-sm"></div>
          </div>
        )}

        {showStaticSign && (
          <div className="absolute -top-36 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center">
            <div className="flex h-20 w-[110px] items-center justify-center rounded-2xl border-[5px] border-amber-700 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 px-5 text-2xl font-bold text-white shadow-lg">
              {wagonNumber}
            </div>
            <div className="h-14 w-[6px] rounded-full bg-amber-700 shadow-sm"></div>
          </div>
        )}

        {showPlacementSpot && (
          <button
            type="button"
            onClick={() => handleSignSpotClick(wagonNumber)}
            className="absolute -top-36 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center focus:outline-none"
          >
            <div
              className={`relative flex h-20 w-[90px] items-center justify-center rounded-2xl border-[5px] border-amber-700 bg-gradient-to-b from-amber-100 to-amber-200 px-5 text-2xl font-bold shadow-lg transition ${
                selectedSign !== null && isMissing ? "ring-4 ring-amber-300" : ""
              }`}
            >
              {value !== undefined && (
                <span className="pointer-events-none absolute inset-2 rounded-xl border-2 border-amber-500/70 border-dashed"></span>
              )}
              <span className={value !== undefined ? "text-amber-800" : "text-amber-400"}>
                {value !== undefined ? value : "?"}
              </span>
            </div>
            <div className="h-14 w-[6px] rounded-full bg-amber-700 shadow-sm"></div>
          </button>
        )}

        <div
          className={`relative flex flex-col items-center transition-opacity duration-300 ${
            underTunnel ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            className="relative overflow-hidden rounded-full border-[3px]"
            style={{
              width: `${BEAD_WIDTH}px`,
              height: `${BEAD_HEIGHT}px`,
              background: `linear-gradient(135deg, ${color.highlight} 5%, ${color.base} 55%, ${color.shadow} 100%)`,
              borderColor: color.rim,
              boxShadow: `0 14px 18px ${color.shadow}33, inset 0 6px 10px ${color.innerGlow}, inset 0 -6px 12px ${color.shadow}55`,
            }}
          >
            <span
              className="pointer-events-none absolute left-4 top-3 h-6 w-8 rounded-full blur-[2px]"
              style={{ background: color.innerGlow }}
            ></span>
            <span
              className="pointer-events-none absolute right-4 bottom-3 h-4 w-6 rounded-full bg-black/20 blur-[1px]"
            ></span>
          </div>
        </div>
      </motion.div>
    );
  };

  const rowWidth =
    exercise.trainLength * BEAD_WIDTH +
    (exercise.trainLength - 1) * BEAD_GAP;

  const instructionText =
    exercise.instructions ||
    (mode === "place-signs"
      ? "POSA CADA CARTELL AL LLOC CORRECTE"
      : "ESCRIU ELS NOMBRES QUE FALTEN ALS CARTELLS");

  return (
    <div className="flex flex-col items-center space-y-8 p-4">
      <div className="text-xl sm:text-2xl font-bold text-gray-700 text-center uppercase">
        {exercise.title || "COMPLETA ELS CARTELLS"}
      </div>

      {mode === "place-signs" && (
        <div className="flex flex-col gap-3 items-center">
          <div className="text-lg font-semibold text-gray-700 uppercase">
            TRIA UN CARTELL I POSA&apos;L AL LLOC CORRECTE
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {availableSigns.map((sign) => {
              const isAssigned = assignedValues.includes(sign);
              const isSelected = selectedSign === sign;

              return (
                <button
                  key={`sign-${sign}`}
                  type="button"
                  disabled={isAssigned}
                  onClick={() => handleSignSelect(sign)}
                  className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-4 border-amber-600 min-w-[70px] bg-amber-100 shadow-lg transition
                    ${isAssigned ? "opacity-40 cursor-not-allowed" : "hover:scale-105"}
                    ${isSelected ? "ring-4 ring-amber-300" : ""}
                  `}
                >
                  <span className="text-2xl font-bold text-amber-700">{sign}</span>
                  <div className="w-1 h-10 bg-amber-600"></div>
                </button>
              );
            })}
          </div>
          <div className="text-sm text-gray-500 uppercase">
            CLICA UN CARTELL PER SELECCIONAR-LO I DESPRÉS EL POSTE
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl overflow-x-auto bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl p-8 shadow-inner">
        <div className="flex items-end min-w-max">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative mr-6"
          >
            <div className="relative w-28 h-28">
              <div className="absolute -top-6 left-6 w-6 h-6 bg-blue-200 rounded-full shadow"></div>
              <div className="absolute -top-6 left-8 w-6 h-10 bg-slate-700 rounded-t-full"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-blue-600 border-4 border-blue-700 rounded-2xl flex flex-col justify-between items-center pt-4 pb-3">
                <div className="w-14 h-10 bg-purple-200 border-2 border-purple-400 rounded-md"></div>
                <div className="w-10 h-10 bg-yellow-400 border-4 border-yellow-500 rounded-full"></div>
              </div>
              <div className="absolute bottom-[-16px] left-2 flex gap-4">
                <div className="w-6 h-6 bg-gray-800 border-2 border-gray-900 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-800 border-2 border-gray-900 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-800 border-2 border-gray-900 rounded-full"></div>
              </div>
            </div>
          </motion.div>

          <div className="relative min-h-[140px]" style={{ width: `${rowWidth}px`, marginTop: `70px` }}>
            {exercise.tunnels?.map((tunnel, idx) => renderTunnel(tunnel, idx))}

            <div className="mt-16 flex items-end" style={{ gap: `${BEAD_GAP}px` }}>
              {Array.from({ length: exercise.trainLength }).map((_, index) =>
                renderBall(index)
              )}
            </div>

            <div className="absolute bottom-6 left-0 right-0 h-2 bg-amber-700 rounded-full shadow-inner"></div>
            <div className="absolute bottom-4 left-0 right-0 h-1 bg-amber-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-600 text-base sm:text-lg uppercase font-semibold">
        {instructionText}
      </div>
    </div>
  );
}
