"use client";

import { motion } from "framer-motion";
import type { CountingExercise as CountingType } from "@/lib/exercises/types";

interface Props {
  exercise: CountingType;
  onAnswer: (answers: Map<string, number>) => void;
  answers: Map<string, number>;
}

export function CountingExercise({ exercise, onAnswer, answers }: Props) {
  const handleInputChange = (value: string) => {
    const newAnswers = new Map(answers);
    if (value === "") {
      newAnswers.delete("count");
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        newAnswers.set("count", numValue);
      }
    }
    onAnswer(newAnswers);
  };

  const renderItems = () => {
    if (exercise.imageType === "grid") {
      // Render in a grid pattern (like egg cartons)
      const rows = Math.ceil(exercise.count / 10);
      const items = [];

      for (let i = 0; i < rows; i++) {
        const cols = Math.min(10, exercise.count - i * 10);
        items.push(
          <div key={i} className="flex gap-2 justify-center">
            {Array.from({ length: cols }).map((_, j) => (
              <motion.div
                key={j}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (i * 10 + j) * 0.02 }}
                className="w-12 h-12 text-3xl flex items-center justify-center"
              >
                {exercise.items}
              </motion.div>
            ))}
          </div>
        );
      }

      return <div className="space-y-2">{items}</div>;
    } else if (exercise.imageType === "scattered") {
      // Render scattered across the area
      return (
        <div className="flex flex-wrap gap-4 justify-center max-w-3xl">
          {Array.from({ length: exercise.count }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: Math.random() * 40 - 20 }}
              transition={{ delay: i * 0.03 }}
              className="w-16 h-16 text-4xl flex items-center justify-center"
            >
              {exercise.items}
            </motion.div>
          ))}
        </div>
      );
    } else {
      // Groups (like groups of 10)
      const groups = Math.floor(exercise.count / 10);
      const remainder = exercise.count % 10;

      return (
        <div className="flex flex-wrap gap-8 justify-center">
          {Array.from({ length: groups }).map((_, g) => (
            <motion.div
              key={`group-${g}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: g * 0.1 }}
              className="bg-blue-100 rounded-2xl p-4 border-4 border-blue-300"
            >
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="w-10 h-10 text-2xl flex items-center justify-center">
                    {exercise.items}
                  </div>
                ))}
              </div>
              <div className="text-center mt-2 font-bold text-xl">10</div>
            </motion.div>
          ))}

          {remainder > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: groups * 0.1 + 0.1 }}
              className="bg-yellow-100 rounded-2xl p-4 border-4 border-yellow-300"
            >
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: remainder }).map((_, i) => (
                  <div key={i} className="w-10 h-10 text-2xl flex items-center justify-center">
                    {exercise.items}
                  </div>
                ))}
              </div>
              <div className="text-center mt-2 font-bold text-xl">{remainder}</div>
            </motion.div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Items to count */}
      <div className="bg-white rounded-2xl p-8 border-4 border-gray-200">
        {renderItems()}
      </div>

      {/* Answer input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-6"
      >
        <div className="text-4xl font-bold text-gray-700 uppercase">
          TOTAL:
        </div>

        <input
          type="number"
          value={answers.get("count") ?? ""}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-32 h-24 text-5xl font-bold text-center border-4 border-orange-400 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-300"
          placeholder="?"
        />

        <div className="text-4xl font-bold text-gray-700">
          {exercise.items}
        </div>
      </motion.div>
    </div>
  );
}
