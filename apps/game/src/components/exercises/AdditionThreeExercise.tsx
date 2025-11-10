"use client";

import { motion } from "framer-motion";
import type { AdditionThreeExercise as AdditionThreeType } from "@/lib/exercises/types";

interface Props {
  exercise: AdditionThreeType;
  onAnswer: (answers: Map<string, number>) => void;
  answers: Map<string, number>;
}

export function AdditionThreeExercise({ exercise, onAnswer, answers }: Props) {
  const [num1, num2, num3] = exercise.numbers;

  const handleInputChange = (value: string) => {
    const newAnswers = new Map(answers);
    if (value === "") {
      newAnswers.delete("result");
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        newAnswers.set("result", numValue);
      }
    }
    onAnswer(newAnswers);
  };

  return (
    <div className="space-y-8">
      {exercise.showVisual && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center gap-8 mb-8"
        >
          {/* Visual representation with groups of dots */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap gap-2 max-w-[100px]">
              {Array.from({ length: num1 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-blue-500 rounded-full" />
              ))}
            </div>
            <span className="text-2xl font-bold">{num1}</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap gap-2 max-w-[100px]">
              {Array.from({ length: num2 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-green-500 rounded-full" />
              ))}
            </div>
            <span className="text-2xl font-bold">{num2}</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-wrap gap-2 max-w-[100px]">
              {Array.from({ length: num3 }).map((_, i) => (
                <div key={i} className="w-4 h-4 bg-purple-500 rounded-full" />
              ))}
            </div>
            <span className="text-2xl font-bold">{num3}</span>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-6"
      >
        <div className="w-24 h-24 flex items-center justify-center text-5xl font-bold bg-blue-100 border-4 border-blue-300 rounded-2xl">
          {num1}
        </div>

        <div className="text-5xl font-bold text-gray-600">+</div>

        <div className="w-24 h-24 flex items-center justify-center text-5xl font-bold bg-green-100 border-4 border-green-300 rounded-2xl">
          {num2}
        </div>

        <div className="text-5xl font-bold text-gray-600">+</div>

        <div className="w-24 h-24 flex items-center justify-center text-5xl font-bold bg-purple-100 border-4 border-purple-300 rounded-2xl">
          {num3}
        </div>

        <div className="text-5xl font-bold text-gray-600">=</div>

        <input
          type="number"
          value={answers.get("result") ?? ""}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-32 h-24 text-5xl font-bold text-center border-4 border-orange-400 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-300"
          placeholder="?"
        />
      </motion.div>
    </div>
  );
}
