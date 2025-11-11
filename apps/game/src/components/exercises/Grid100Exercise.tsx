"use client";

import { motion } from "framer-motion";
import type { Grid100Exercise as Grid100Type } from "@/lib/exercises/types";

interface Props {
  exercise: Grid100Type;
  onAnswer: (answers: Map<string, number>) => void;
  answers: Map<string, number>;
}

export function Grid100Exercise({ exercise, onAnswer, answers }: Props) {
  const totalCells = exercise.maxNumber ?? 100;

  const handleInputChange = (number: number, value: string) => {
    const newAnswers = new Map(answers);
    if (value === "") {
      newAnswers.delete(`num-${number}`);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        newAnswers.set(`num-${number}`, numValue);
      }
    }
    onAnswer(newAnswers);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="inline-block bg-orange-50 rounded-2xl p-6 border-4 border-orange-300">
          <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: totalCells }, (_, i) => {
              const num = i + 1;
              const isMissing = exercise.missingNumbers.includes(num);

              return (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.005 }}
                >
                  {isMissing ? (
                    <input
                      type="number"
                      value={answers.get(`num-${num}`) ?? ""}
                      onChange={(e) => handleInputChange(num, e.target.value)}
                      className="w-14 h-14 text-xl font-bold text-center border-2 border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                      placeholder="?"
                    />
                  ) : (
                    <div
                      className={`w-14 h-14 flex items-center justify-center text-xl font-bold rounded-lg ${
                        num % 10 === 0
                          ? "bg-blue-200 border-2 border-blue-400"
                          : num % 2 === 0
                          ? "bg-orange-100 border-2 border-orange-200"
                          : "bg-white border-2 border-gray-200"
                      }`}
                    >
                      {num}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg text-gray-600 uppercase">
          COMPLETA LA GRAELLA DEL 1 AL {totalCells}
        </p>
      </div>
    </div>
  );
}
