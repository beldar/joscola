"use client";

import { motion } from "framer-motion";
import type { NumberPatternExercise as NumberPatternType } from "@/lib/exercises/types";

interface Props {
  exercise: NumberPatternType;
  onAnswer: (answers: Map<string, number>) => void;
  answers: Map<string, number>;
}

export function NumberPatternExercise({ exercise, onAnswer, answers }: Props) {
  const handleInputChange = (key: string, value: string) => {
    const newAnswers = new Map(answers);
    if (value === "") {
      newAnswers.delete(key);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 99) {
        newAnswers.set(key, numValue);
      }
    }
    onAnswer(newAnswers);
  };

  const renderPattern = (pattern: typeof exercise.patterns[0], index: number) => {
    const getValue = (pos: string) => {
      const given = pattern.given.find(g => g.position === pos);
      if (given) return given.value;
      return answers.get(`pattern-${index}-${pos}`) ?? null;
    };

    const isMissing = (pos: string) => pattern.missing.includes(pos);

    if (pattern.layout === "cross") {
      // Cross pattern - plus sign shape
      return (
        <div className="flex flex-col items-center gap-1">
          {/* Top */}
          <div className="flex justify-center">
            {renderCell("top", getValue("top"), isMissing("top"), index)}
          </div>

          {/* Middle row */}
          <div className="flex gap-1">
            {renderCell("left", getValue("left"), isMissing("left"), index)}
            {renderCell("center", getValue("center"), isMissing("center"), index)}
            {renderCell("right", getValue("right"), isMissing("right"), index)}
          </div>

          {/* Bottom */}
          <div className="flex justify-center">
            {renderCell("bottom", getValue("bottom"), isMissing("bottom"), index)}
          </div>
        </div>
      );
    } else if (pattern.layout === "line") {
      // Horizontal line - need to show cells in order (0, 1, 2)
      const allPositions = ["0", "1", "2"];

      return (
        <div className="flex gap-1">
          {allPositions.map((pos) => (
            <div key={pos}>
              {renderCell(pos, getValue(pos), isMissing(pos), index)}
            </div>
          ))}
        </div>
      );
    } else if (pattern.layout === "square") {
      // 2x2 square pattern
      return (
        <div className="grid grid-cols-2 gap-1">
          {["0", "1", "2", "3"].map((pos) => (
            <div key={pos}>
              {renderCell(pos, getValue(pos), isMissing(pos), index)}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderCell = (position: string, value: number | null, isMissing: boolean, patternIndex: number) => {
    if (isMissing) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-20 h-20 border-3 border-dashed border-purple-400 rounded-xl bg-purple-50 flex items-center justify-center relative"
        >
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value ?? ""}
            onChange={(e) => handleInputChange(`pattern-${patternIndex}-${position}`, e.target.value)}
            className="w-16 h-16 text-2xl font-bold text-center bg-white border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="?"
            maxLength={2}
          />
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-20 h-20 border-3 border-purple-500 rounded-xl bg-purple-200 flex items-center justify-center shadow-md"
      >
        <div className="text-3xl font-bold text-purple-900">
          {value}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      {/* Patterns container */}
      <div className="w-full max-w-5xl">
        {/* Determine layout based on number of patterns */}
        {exercise.patterns.length <= 2 ? (
          // For 1-2 patterns, use horizontal layout
          <div className="flex flex-wrap justify-center gap-8">
            {exercise.patterns.map((pattern, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg border-2 border-purple-200"
              >
                {renderPattern(pattern, index)}
              </motion.div>
            ))}
          </div>
        ) : exercise.patterns.length === 3 ? (
          // For exactly 3 patterns, use 3 columns
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
            {exercise.patterns.map((pattern, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg border-2 border-purple-200"
              >
                {renderPattern(pattern, index)}
              </motion.div>
            ))}
          </div>
        ) : exercise.patterns.length === 4 ? (
          // For exactly 4 patterns, use 2x2 grid
          <div className="grid grid-cols-2 gap-6 justify-items-center max-w-3xl mx-auto">
            {exercise.patterns.map((pattern, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg border-2 border-purple-200"
              >
                {renderPattern(pattern, index)}
              </motion.div>
            ))}
          </div>
        ) : (
          // For 5+ patterns, use flexible grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {exercise.patterns.map((pattern, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg border-2 border-purple-200"
              >
                {renderPattern(pattern, index)}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
