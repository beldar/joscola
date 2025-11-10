"use client";

import { motion } from "framer-motion";
import type { NumberLineExercise as NumberLineType } from "@/lib/exercises/types";

interface Props {
  exercise: NumberLineType;
  onAnswer: (answers: Map<string, number>) => void;
  answers: Map<string, number>;
}

export function NumberLineExercise({ exercise, onAnswer, answers }: Props) {
  const range = exercise.max - exercise.min;
  const step = range >= 20 ? 5 : range >= 10 ? 2 : 1;
  const ticks = [];

  // Generate tick marks
  for (let i = exercise.min; i <= exercise.max; i += step) {
    ticks.push(i);
  }

  const getPosition = (value: number): number => {
    return ((value - exercise.min) / range) * 100;
  };

  const handleNumberClick = (num: number, position: number) => {
    const newAnswers = new Map(answers);
    // Check if this number already has a position
    const existingKey = Array.from(newAnswers.entries()).find(
      ([_, val]) => val === num
    )?.[0];

    if (existingKey) {
      newAnswers.delete(existingKey);
    }

    newAnswers.set(`pos-${position}`, num);
    onAnswer(newAnswers);
  };

  const handleLineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = (clickX / rect.width) * 100;
    const clickedValue = Math.round((percent / 100) * range + exercise.min);

    // Find which number is selected to place
    const selectedNumber = exercise.numbersToPlace.find((num) => {
      return !Array.from(answers.values()).includes(num);
    });

    if (selectedNumber !== undefined) {
      handleNumberClick(selectedNumber, clickedValue);
    }
  };

  const getPlacedNumber = (position: number): number | null => {
    return answers.get(`pos-${position}`) ?? null;
  };

  const isNumberPlaced = (num: number): boolean => {
    return Array.from(answers.values()).includes(num);
  };

  return (
    <div className="space-y-12">
      {/* Numbers to place */}
      <div>
        <div className="text-2xl font-bold text-center text-gray-700 uppercase mb-6">
          PINTA AQUESTS NOMBRES A LA RECTA
        </div>
        <div className="flex justify-center gap-6">
          {exercise.numbersToPlace.map((num) => (
            <motion.div
              key={num}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold border-4 transition-all ${
                isNumberPlaced(num)
                  ? "bg-gray-200 border-gray-400 text-gray-500 line-through"
                  : "bg-blue-100 border-blue-500 text-blue-900 hover:bg-blue-200 cursor-pointer"
              }`}
            >
              {num}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Number line */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-3xl p-12 border-4 border-purple-200"
      >
        {/* Instructions */}
        <div className="text-xl font-bold text-center text-gray-600 uppercase mb-8">
          CLICA A LA RECTA PER COL·LOCAR ELS NOMBRES
        </div>

        {/* The number line */}
        <div className="relative h-32">
          {/* Clickable area (invisible, larger hit area) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-full h-20 cursor-pointer"
            onClick={handleLineClick}
          />
          {/* Main line (visual element) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-full h-3 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full pointer-events-none"
          >
          </div>

          {/* Tick marks */}
          {ticks.map((tick) => (
            <div
              key={tick}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-12 bg-gray-700 pointer-events-none"
              style={{ left: `${getPosition(tick)}%` }}
            >
              {/* Tick label */}
              <div className="absolute top-full mt-3 -translate-x-1/2 text-2xl font-bold text-gray-700">
                {tick}
              </div>
            </div>
          ))}

          {/* Placed numbers with arrows */}
          {exercise.numbersToPlace.map((num) => {
            const position = Array.from(answers.entries()).find(
              ([_, val]) => val === num
            )?.[0];

            if (!position) return null;

            const posValue = parseInt(position.split("-")[1]);
            const percent = getPosition(posValue);

            return (
              <motion.div
                key={num}
                initial={{ scale: 0, y: -50 }}
                animate={{ scale: 1, y: 0 }}
                className="absolute"
                style={{ left: `${percent}%`, top: "-80px" }}
              >
                {/* Number bubble */}
                <div className="absolute -translate-x-1/2 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-400 border-4 border-green-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {num}
                  </div>
                  {/* Arrow */}
                  <div className="w-1 h-12 bg-green-600"></div>
                  <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-green-600"></div>
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newAnswers = new Map(answers);
                    newAnswers.delete(position);
                    onAnswer(newAnswers);
                  }}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white text-xl font-bold hover:bg-red-600 flex items-center justify-center"
                >
                  ×
                </button>
              </motion.div>
            );
          })}

          {/* Start and end markers */}
          <div className="absolute left-0 -bottom-4 text-3xl font-bold text-orange-600">
            {exercise.min}
          </div>
          <div className="absolute right-0 -bottom-4 text-3xl font-bold text-pink-600">
            {exercise.max}
          </div>
        </div>
      </motion.div>

      {/* Helper text */}
      <div className="text-center text-gray-600 text-lg uppercase">
        CLICA LA X PER TREURE UN NOMBRE DE LA RECTA
      </div>
    </div>
  );
}
