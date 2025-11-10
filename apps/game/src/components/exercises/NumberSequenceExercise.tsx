"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { NumberSequenceExercise as NumberSequenceType } from "@/lib/exercises/types";

interface Props {
  exercise: NumberSequenceType;
  onAnswer: (answers: Map<string, number>) => void;
  answers: Map<string, number>;
}

export function NumberSequenceExercise({ exercise, onAnswer, answers }: Props) {
  const generateSequence = () => {
    const sequence: (number | null)[] = [];
    let current = exercise.start;

    for (let i = 0; i < exercise.length; i++) {
      if (exercise.missingIndices.includes(i)) {
        sequence.push(null);
      } else {
        sequence.push(current);
      }

      if (exercise.direction === "forward") {
        current += exercise.step;
      } else {
        current -= exercise.step;
      }
    }

    return sequence;
  };

  const sequence = generateSequence();

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = new Map(answers);
    if (value === "") {
      newAnswers.delete(`pos-${index}`);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        newAnswers.set(`pos-${index}`, numValue);
      }
    }
    onAnswer(newAnswers);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {sequence.map((num, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {num === null ? (
              <input
                type="number"
                value={answers.get(`pos-${index}`) ?? ""}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-24 h-24 text-4xl font-bold text-center border-4 border-blue-400 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300"
                placeholder="?"
              />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center text-4xl font-bold bg-blue-100 border-4 border-blue-300 rounded-2xl">
                {num}
              </div>
            )}

            {index < sequence.length - 1 && (
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-3xl text-gray-400">
                {exercise.direction === "forward" ? "→" : "←"}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {exercise.step > 1 && (
        <div className="text-center">
          <p className="text-xl text-gray-600 uppercase">
            {exercise.direction === "forward"
              ? `COMPTEM DE ${exercise.step} EN ${exercise.step}`
              : `COMPTEM ENRERE DE ${exercise.step} EN ${exercise.step}`}
          </p>
        </div>
      )}
    </div>
  );
}
