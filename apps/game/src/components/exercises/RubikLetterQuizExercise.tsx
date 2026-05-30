"use client";

import { motion } from "framer-motion";
import type { RubikLetterQuizExercise as RubikLetterQuizExerciseType } from "@/lib/exercises/types";
import { RubikCube } from "./RubikCube";

interface Props {
  exercise: RubikLetterQuizExerciseType;
  answers: Map<string, string | number>;
  onAnswer: (answers: Map<string, string | number>) => void;
}

export function RubikLetterQuizExercise({ exercise, answers, onAnswer }: Props) {
  const selected = answers.get("answer") as string | undefined;

  const handleSelect = (option: string) => {
    const next = new Map(answers);
    next.set("answer", option);
    onAnswer(next);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <RubikCube move={exercise.move} showArrow size={240} />
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {exercise.options.map((option) => {
          const isSelected = selected === option;
          return (
            <motion.button
              key={option}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleSelect(option)}
              className={`w-24 h-24 rounded-2xl text-4xl font-bold border-4 transition-colors ${
                isSelected
                  ? "bg-blue-500 border-blue-700 text-white shadow-lg"
                  : "bg-white border-gray-300 text-gray-800 hover:border-blue-400"
              }`}
            >
              {option}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
