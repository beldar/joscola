"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { RubikMatchExercise as RubikMatchExerciseType, RubikMove } from "@/lib/exercises/types";
import { RubikCube } from "./RubikCube";

interface Props {
  exercise: RubikMatchExerciseType;
  answers: Map<string, string | number>;
  onAnswer: (answers: Map<string, string | number>) => void;
}

export function RubikMatchExercise({ exercise, answers, onAnswer }: Props) {
  const [selectedCube, setSelectedCube] = useState<RubikMove | null>(null);

  // Shuffle labels once (stable across re-renders via useMemo-like approach)
  const shuffledLabels = [...exercise.pairs].sort((a, b) => {
    const order = ["R'", "L'", "U'", "D'", "F'", "B'", "R", "L", "U", "D", "F", "B"];
    return order.indexOf(b) - order.indexOf(a);
  });

  const getMatchedLabel = (move: RubikMove): string | undefined =>
    answers.get(`match-${move}`) as string | undefined;

  const handleCubeClick = (move: RubikMove) => {
    setSelectedCube(move);
  };

  const handleLabelClick = (label: RubikMove) => {
    if (!selectedCube) return;
    const next = new Map(answers);
    // Remove any previous cube that had this label
    for (const pair of exercise.pairs) {
      if (answers.get(`match-${pair}`) === label) {
        next.delete(`match-${pair}`);
      }
    }
    next.set(`match-${selectedCube}`, label);
    onAnswer(next);
    setSelectedCube(null);
  };

  const usedLabels = new Set(exercise.pairs.map(m => answers.get(`match-${m}`)).filter(Boolean));

  return (
    <div className="flex gap-8 justify-center items-start flex-wrap">
      {/* Left: cubes */}
      <div className="flex flex-col gap-4">
        {exercise.pairs.map((move) => {
          const matched = getMatchedLabel(move);
          const isSelected = selectedCube === move;
          return (
            <motion.div
              key={move}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCubeClick(move)}
              className={`flex items-center gap-3 p-3 rounded-2xl border-4 cursor-pointer transition-colors ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : matched
                  ? "border-green-400 bg-green-50"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              <RubikCube move={move} showArrow size={120} />
              {matched && (
                <span className="text-2xl font-bold text-green-700 ml-2">→ {matched}</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Right: letter buttons */}
      <div className="flex flex-col gap-4 justify-center">
        {shuffledLabels.map((label) => {
          const isUsed = usedLabels.has(label);
          return (
            <motion.button
              key={label}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleLabelClick(label)}
              disabled={!selectedCube}
              className={`w-20 h-16 rounded-2xl text-2xl font-bold border-4 transition-colors ${
                isUsed
                  ? "bg-green-100 border-green-400 text-green-700 opacity-60"
                  : selectedCube
                  ? "bg-white border-blue-400 text-gray-800 hover:bg-blue-50"
                  : "bg-white border-gray-300 text-gray-500"
              }`}
            >
              {label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
