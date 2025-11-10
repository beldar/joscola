"use client";

import { motion } from "framer-motion";
import type { NumberOrderExercise as NumberOrderType } from "@/lib/exercises/types";

interface Props {
  exercise: NumberOrderType;
  onAnswer: (answers: Map<string, number>) => void;
  answers: Map<string, number>;
}

export function NumberOrderExercise({ exercise, onAnswer, answers }: Props) {
  const handleNumberClick = (num: number, index: number) => {
    const newAnswers = new Map(answers);

    if (exercise.question === "smallest" || exercise.question === "largest") {
      // For smallest/largest, only one answer
      if (newAnswers.get("answer") === num) {
        newAnswers.delete("answer");
      } else {
        newAnswers.set("answer", num);
      }
    } else {
      // For ordering, multiple positions
      if (newAnswers.get(`pos-${index}`) === num) {
        newAnswers.delete(`pos-${index}`);
      } else {
        newAnswers.set(`pos-${index}`, num);
      }
    }

    onAnswer(newAnswers);
  };

  const getQuestionText = () => {
    switch (exercise.question) {
      case "smallest":
        return "PINTA EL NOMBRE MÉS PETIT";
      case "largest":
        return "PINTA EL NOMBRE MÉS GRAN";
      case "order-asc":
        return "ORDENA DE PETIT A GRAN";
      case "order-desc":
        return "ORDENA DE GRAN A PETIT";
    }
  };

  const isSelected = (num: number, index?: number) => {
    if (exercise.question === "smallest" || exercise.question === "largest") {
      return answers.get("answer") === num;
    } else {
      return index !== undefined && answers.get(`pos-${index}`) === num;
    }
  };

  if (exercise.question === "order-asc" || exercise.question === "order-desc") {
    // Ordering exercise with drag and drop style
    return (
      <div className="space-y-8">
        <div className="text-2xl font-bold text-center text-gray-700 uppercase mb-8">
          {getQuestionText()}
        </div>

        {/* Given numbers to arrange */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {exercise.numbers.map((num) => {
            const isUsed = Array.from(answers.values()).includes(num);
            return (
              <motion.div
                key={num}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-24 h-24 flex items-center justify-center
                  text-3xl font-bold rounded-2xl border-4 cursor-pointer
                  transition-all
                  ${isUsed
                    ? "bg-gray-200 border-gray-400 text-gray-400"
                    : "bg-pink-500 border-pink-600 text-white hover:bg-pink-600"
                  }
                `}
              >
                {num}
              </motion.div>
            );
          })}
        </div>

        {/* Empty slots for ordering */}
        <div className="flex flex-wrap gap-4 justify-center">
          {exercise.numbers.map((_, index) => {
            const value = answers.get(`pos-${index}`);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  if (value !== undefined) {
                    // Remove the number from this position
                    const newAnswers = new Map(answers);
                    newAnswers.delete(`pos-${index}`);
                    onAnswer(newAnswers);
                  }
                }}
                className={`
                  w-24 h-24 flex items-center justify-center
                  text-3xl font-bold rounded-2xl border-4 border-dashed
                  ${value
                    ? "bg-green-100 border-green-500 text-green-700 cursor-pointer hover:bg-red-100 hover:border-red-500"
                    : "bg-white border-gray-300 text-gray-400"
                  }
                  transition-all
                `}
              >
                {value ?? "?"}
              </motion.div>
            );
          })}
        </div>

        {/* Number buttons for selection */}
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          {exercise.numbers.map((num) => (
            <button
              key={num}
              onClick={() => {
                // Find first empty position
                const firstEmpty = exercise.numbers.findIndex((_, i) => !answers.has(`pos-${i}`));
                if (firstEmpty !== -1) {
                  handleNumberClick(num, firstEmpty);
                }
              }}
              disabled={Array.from(answers.values()).includes(num)}
              className="px-6 py-3 bg-blue-500 text-white font-bold text-xl rounded-xl
                       hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                       transition-all uppercase"
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Simple selection exercise (smallest/largest)
  return (
    <div className="space-y-8">
      <div className="text-2xl font-bold text-center text-gray-700 uppercase mb-8">
        {getQuestionText()}
      </div>

      <div className="flex flex-wrap gap-6 justify-center">
        {exercise.numbers.map((num, index) => (
          <motion.button
            key={index}
            onClick={() => handleNumberClick(num, index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              w-32 h-32 flex items-center justify-center
              text-4xl font-bold rounded-3xl border-4
              transition-all duration-200
              ${isSelected(num, index)
                ? "bg-yellow-400 border-yellow-600 text-white shadow-2xl scale-110"
                : "bg-purple-500 border-purple-600 text-white hover:bg-purple-600"
              }
            `}
          >
            {num}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
