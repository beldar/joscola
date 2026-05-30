"use client";

import { motion } from "framer-motion";
import type { RubikSequenceTapExercise as RubikSequenceTapExerciseType, RubikMove } from "@/lib/exercises/types";

interface Props {
  exercise: RubikSequenceTapExerciseType;
  answers: Map<string, string | number>;
  onAnswer: (answers: Map<string, string | number>) => void;
}

export function RubikSequenceTapExercise({ exercise, answers, onAnswer }: Props) {
  const tapsRaw = answers.get("taps") as string | undefined;
  const taps: RubikMove[] = tapsRaw ? tapsRaw.split(",").filter(Boolean) as RubikMove[] : [];

  const handleTap = (move: RubikMove) => {
    if (taps.length >= exercise.sequence.length) return;
    const next = [...taps, move];
    const nextAnswers = new Map(answers);
    nextAnswers.set("taps", next.join(","));
    onAnswer(nextAnswers);
  };

  const handleUndo = () => {
    if (taps.length === 0) return;
    const next = taps.slice(0, -1);
    const nextAnswers = new Map(answers);
    nextAnswers.set("taps", next.join(","));
    onAnswer(nextAnswers);
  };

  const handleReset = () => {
    const nextAnswers = new Map(answers);
    nextAnswers.set("taps", "");
    onAnswer(nextAnswers);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Target sequence display */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-lg text-gray-500 uppercase font-semibold">SEQÜÈNCIA A REPRODUIR:</p>
        <div className="flex gap-3 flex-wrap justify-center">
          {exercise.sequence.map((move, i) => (
            <span
              key={i}
              className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center text-2xl font-bold ${
                i < taps.length
                  ? taps[i] === move
                    ? "border-green-500 bg-green-100 text-green-700"
                    : "border-red-400 bg-red-100 text-red-700"
                  : "border-gray-300 bg-gray-50 text-gray-700"
              }`}
            >
              {move}
            </span>
          ))}
        </div>
      </div>

      {/* Taps so far */}
      {taps.length > 0 && (
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm text-gray-400 uppercase">HAS TOCAT:</p>
          <div className="flex gap-2 flex-wrap justify-center">
            {taps.map((t, i) => (
              <span key={i} className="px-3 py-1 rounded-xl bg-blue-100 text-blue-700 font-bold text-lg">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Move buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {exercise.buttons.map((move) => (
          <motion.button
            key={move}
            whileTap={{ scale: 0.88 }}
            onClick={() => handleTap(move)}
            disabled={taps.length >= exercise.sequence.length}
            className="w-20 h-20 rounded-2xl border-4 border-gray-300 bg-white text-gray-800 text-2xl font-bold hover:border-blue-400 hover:bg-blue-50 disabled:opacity-40 transition-colors"
          >
            {move}
          </motion.button>
        ))}
      </div>

      {/* Undo / Reset */}
      <div className="flex gap-4">
        <button
          onClick={handleUndo}
          disabled={taps.length === 0}
          className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm uppercase hover:bg-gray-200 disabled:opacity-30"
        >
          ← DESFER
        </button>
        <button
          onClick={handleReset}
          disabled={taps.length === 0}
          className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm uppercase hover:bg-gray-200 disabled:opacity-30"
        >
          REINICIAR
        </button>
      </div>
    </div>
  );
}
