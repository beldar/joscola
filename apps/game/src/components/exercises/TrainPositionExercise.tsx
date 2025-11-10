"use client";

import { motion } from "framer-motion";
import type { TrainPositionExercise as TrainPositionType } from "@/lib/exercises/types";

interface Props {
  exercise: TrainPositionType;
  onAnswer: (answers: Map<string, number>) => void;
  answers: Map<string, number>;
}

export function TrainPositionExercise({ exercise, onAnswer, answers }: Props) {
  const handleInputChange = (position: number, value: string) => {
    const newAnswers = new Map(answers);
    if (value === "") {
      newAnswers.delete(`pos-${position}`);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 1 && numValue <= 99) {
        newAnswers.set(`pos-${position}`, numValue);
      }
    }
    onAnswer(newAnswers);
  };

  const renderWagon = (index: number) => {
    const wagonNumber = index + 1; // Convert 0-based index to 1-based wagon number
    const hasSign = exercise.signPositions.includes(wagonNumber);
    const isMissing = exercise.missingPositions.includes(wagonNumber);
    const value = answers.get(`pos-${wagonNumber}`);

    // Determine wagon color based on pattern
    const isGreen = index % 2 === 0;
    const bgColor = isGreen ? "bg-green-400" : "bg-yellow-300";
    const borderColor = isGreen ? "border-green-600" : "border-yellow-500";

    return (
      <motion.div
        key={index}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.02, type: "spring", stiffness: 200 }}
        className="relative"
      >
        {/* Sign above wagon */}
        {hasSign && (
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-10">
            {isMissing ? (
              <div className="relative">
                {/* Orange sign board */}
                <div className="bg-orange-400 border-4 border-orange-600 rounded-xl px-4 py-2 min-w-[60px] shadow-lg">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={value ?? ""}
                    onChange={(e) => handleInputChange(wagonNumber, e.target.value)}
                    className="w-[50px] h-10 text-2xl font-bold text-center bg-white border-2 border-orange-600 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder=""
                    maxLength={2}
                  />
                </div>
                {/* Sign pole */}
                <div className="w-1 h-6 bg-orange-600 mx-auto"></div>
              </div>
            ) : (
              <div className="relative">
                {/* Orange sign board with number */}
                <div className="bg-orange-400 border-4 border-orange-600 rounded-xl px-4 py-3 min-w-[60px] shadow-lg">
                  <div className="text-2xl font-bold text-center text-white">
                    {wagonNumber}
                  </div>
                </div>
                {/* Sign pole */}
                <div className="w-1 h-6 bg-orange-600 mx-auto"></div>
              </div>
            )}
          </div>
        )}

        {/* Train wagon */}
        <div className={`relative ${index === 0 ? '' : '-ml-1'}`}>
          <div className={`
            w-16 h-20 ${bgColor} ${borderColor} border-4 rounded-lg
            flex flex-col items-center justify-end relative
          `}>
            {/* Connection to next wagon */}
            {index < exercise.trainLength - 1 && (
              <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-600 rounded-full z-20"></div>
            )}

            {/* Wheels */}
            <div className="flex gap-2 mb-1">
              <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
              <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-4">
      {/* Title */}
      <div className="text-xl sm:text-2xl font-bold text-gray-700 text-center uppercase">
        {exercise.title || "COMPLETA ELS CARTELLS"}
      </div>

      {/* Train container with scroll */}
      <div className="w-full max-w-6xl overflow-x-auto bg-gradient-to-b from-blue-50 to-blue-100 rounded-2xl p-8">
        <div className="relative min-w-max">
          {/* Track/Rail */}
          <div className="absolute bottom-6 left-0 right-0 h-2 bg-gray-600 rounded-full"></div>
          <div className="absolute bottom-5 left-0 right-0 h-0.5 bg-gray-400"></div>

          {/* Train wagons */}
          <div className="flex items-end pb-10 mt-10">
            {/* Locomotive */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="relative mr-1"
            >
              <div className="relative">
                {/* Chimney */}
                <div className="absolute -top-4 left-3 w-4 h-6 bg-red-600 rounded-t-md"></div>
                <div className="absolute -top-5 left-2.5 w-5 h-2 bg-gray-700 rounded-t-lg"></div>

                {/* Locomotive body */}
                <div className="w-24 h-28 bg-red-500 border-4 border-red-700 rounded-xl flex flex-col items-center justify-between">
                  {/* Window */}
                  <div className="w-14 h-10 bg-blue-300 border-2 border-blue-600 rounded mt-2"></div>

                  {/* Front light */}
                  <div className="w-6 h-6 bg-yellow-300 border-2 border-yellow-500 rounded-full mb-1"></div>

                  {/* Wheels */}
                  <div className="flex gap-3 mb-1">
                    <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
                    <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
                  </div>
                </div>

                {/* Connection to first wagon */}
                <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-600 rounded-full z-20"></div>
              </div>
            </motion.div>

            {/* Wagons */}
            {Array.from({ length: exercise.trainLength }).map((_, index) =>
              renderWagon(index)
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-gray-600 text-base sm:text-lg uppercase font-semibold">
        {exercise.instructions || "ESCRIU ELS NOMBRES QUE FALTEN ALS CARTELLS"}
      </div>
    </div>
  );
}
