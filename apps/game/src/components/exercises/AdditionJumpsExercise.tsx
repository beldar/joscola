"use client";

import { motion } from "framer-motion";
import type { AdditionJumpsExercise as AdditionJumpsType } from "@/lib/exercises/types";

interface Props {
  exercise: AdditionJumpsType;
  onAnswer: (answers: Map<string, number>) => void;
  answers: Map<string, number>;
}

export function AdditionJumpsExercise({ exercise, onAnswer, answers }: Props) {
  const handleInputChange = (key: string, value: string) => {
    const newAnswers = new Map(answers);
    if (value === "") {
      newAnswers.delete(key);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        newAnswers.set(key, numValue);
      }
    }
    onAnswer(newAnswers);
  };

  // Calculate the jumps: e.g., 8 + 7 = 8 + 2 + 5 = 10 + 5 = 15
  const toTen = 10 - exercise.start;
  const afterTen = exercise.add - toTen;
  const result = exercise.start + exercise.add;

  // Generate balls for the train
  const totalBalls = result;
  const balls = Array.from({ length: totalBalls }, (_, i) => i + 1);

  // Calculate ball color - alternating every 5 balls
  const getBallColor = (ballNumber: number) => {
    // Balls 1-5: green, 6-10: yellow, 11-15: green, etc.
    const groupOf5 = Math.ceil(ballNumber / 5);
    return groupOf5 % 2 === 1 ? "#22C55E" : "#EAB308"; // green or yellow
  };

  // Calculate positions for arrows - they should span from one vertical line to another
  const trainStartX = 60; // Offset for train engine
  const ballWidth = 32; // Width of each ball + gap

  // First arrow: from position "start" to position "10"
  const firstArrowStartX = trainStartX + (exercise.start - 1) * ballWidth + 16;
  const firstArrowEndX = trainStartX + 9 * ballWidth + 16; // Position 10 is at index 9

  // Second arrow: from position "10" to position "result"
  const secondArrowStartX = trainStartX + 9 * ballWidth + 16;
  const secondArrowEndX = trainStartX + (result - 1) * ballWidth + 16;

  return (
    <div className="space-y-8">
      {/* Title number at top left in teal */}
      <div className="text-2xl font-bold text-cyan-600">
        1. OMPLE ELS BUITS PER SUMAR COM SUGGEREIX EN BILLY.
      </div>

      {/* Top section: Equation on left, House diagram and Billy on right */}
      <div className="flex items-center justify-between gap-8 px-8">
        {/* Left: Main equation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-20 h-20 flex items-center justify-center text-4xl font-bold bg-red-400 text-white rounded-xl">
            {exercise.start}
          </div>
          <div className="text-4xl font-bold text-gray-700">+</div>
          <div className="w-20 h-20 flex items-center justify-center text-4xl font-bold bg-red-400 text-white rounded-xl">
            {exercise.add}
          </div>
          <div className="text-4xl font-bold text-gray-700">=</div>
          <div className="w-32 h-16 border-b-4 border-dashed border-cyan-500 flex items-center justify-center text-4xl font-bold text-gray-400">

          </div>
        </motion.div>

        {/* Right: House diagram and Billy */}
        <div className="flex items-center gap-8">
          {/* House diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0"
          >
            {/* House structure */}
            <div className="relative border-4 border-red-400 rounded-2xl overflow-hidden bg-white shadow-lg">
              {/* Roof */}
              <div className="w-48 h-16 bg-cyan-400 flex items-center justify-center border-b-4 border-red-400">
                <div className="text-5xl font-bold text-cyan-900">10</div>
              </div>
              {/* Base with two rooms */}
              <div className="flex">
                {/* Left room */}
                <div className="w-24 h-24 flex items-center justify-center text-4xl font-bold border-r-4 border-red-400 bg-white">
                  {exercise.start}
                </div>
                {/* Right room - input */}
                <input
                  type="number"
                  value={answers.get("step-1") ?? ""}
                  onChange={(e) => handleInputChange("step-1", e.target.value)}
                  className="w-24 h-24 text-4xl font-bold text-center bg-white focus:outline-none focus:ring-4 focus:ring-cyan-300"
                  placeholder=""
                />
              </div>
            </div>
          </motion.div>

          {/* Billy character */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-shrink-0"
          >
            <div className="text-8xl">🦘</div>
          </motion.div>
        </div>
      </div>

      {/* Train section */}
      <div className="space-y-2">
        {/* Jump labels and arrows */}
        <div className="relative h-32 flex justify-center">
          <div style={{ width: `${totalBalls * ballWidth + 110}px`, position: 'relative' }}>
            {/* Jump labels */}
            <div className="absolute top-0 left-0 right-0">
              <div className="relative" style={{ height: '32px' }}>
                {/* First jump label */}
                <div
                  className="absolute text-3xl font-bold text-red-400"
                  style={{
                    left: `${(firstArrowStartX + firstArrowEndX) / 2 - 20}px`,
                    top: '0'
                  }}
                >
                  + {toTen}
                </div>
                {/* Second jump label */}
                <div
                  className="absolute text-3xl font-bold text-red-400"
                  style={{
                    left: `${(secondArrowStartX + secondArrowEndX) / 2 - 20}px`,
                    top: '0'
                  }}
                >
                  + {afterTen}
                </div>
              </div>
            </div>

            {/* Curved arrows */}
            <div className="absolute top-8 left-0 right-0">
              <svg
                width={totalBalls * ballWidth + 110}
                height="90"
                viewBox={`0 0 ${totalBalls * ballWidth + 110} 90`}
                className="overflow-visible"
              >
                {/* First arc - from start position to position 10 */}
                <path
                  d={`M ${firstArrowStartX} 80 Q ${(firstArrowStartX + firstArrowEndX) / 2} 10 ${firstArrowEndX} 80`}
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="4"
                />
                <polygon
                  points={`${firstArrowEndX},80 ${firstArrowEndX - 8},72 ${firstArrowEndX + 8},72`}
                  fill="#f87171"
                />

                {/* Second arc - from position 10 to final position */}
                <path
                  d={`M ${secondArrowStartX} 80 Q ${(secondArrowStartX + secondArrowEndX) / 2} 10 ${secondArrowEndX} 80`}
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="4"
                />
                <polygon
                  points={`${secondArrowEndX},80 ${secondArrowEndX - 8},72 ${secondArrowEndX + 8},72`}
                  fill="#f87171"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Train and balls with vertical lines */}
        <div className="relative">
          {/* Vertical separator lines (flagpoles) - aligned with ball centers and extending down to boxes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{ width: `${totalBalls * ballWidth + 110}px`, height: '160px' }}>
            <div className="relative h-full">
              {/* Line at starting position */}
              <div
                className="absolute w-0.5 h-40 bg-gray-400"
                style={{
                  left: `${trainStartX + (exercise.start - 1) * ballWidth + 16}px`,
                  top: '-6px'
                }}
              />
              {/* Line at position 10 */}
              <div
                className="absolute w-0.5 h-40 bg-gray-400"
                style={{
                  left: `${trainStartX + 9 * ballWidth + 16}px`,
                  top: '-6px'
                }}
              />
              {/* Line at end position */}
              <div
                className="absolute w-0.5 h-40 bg-gray-400"
                style={{
                  left: `${trainStartX + (result - 1) * ballWidth + 16}px`,
                  top: '-6px'
                }}
              />
            </div>
          </div>

          {/* Train and balls */}
          <div className="flex items-center justify-center gap-1 overflow-x-auto pb-4 pt-2">
            {/* Train engine */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0"
            >
              <svg width="60" height="50" viewBox="0 0 60 50">
                {/* Train body */}
                <rect x="10" y="15" width="40" height="25" fill="#5B7C99" rx="4" />
                <rect x="15" y="20" width="15" height="10" fill="#87CEEB" rx="2" />
                {/* Smokestack */}
                <rect x="35" y="8" width="8" height="8" fill="#8B4513" />
                {/* Wheels */}
                <circle cx="20" cy="42" r="5" fill="#333" />
                <circle cx="40" cy="42" r="5" fill="#333" />
                <circle cx="20" cy="42" r="3" fill="#666" />
                <circle cx="40" cy="42" r="3" fill="#666" />
              </svg>
            </motion.div>

            {/* Colored balls */}
            {balls.map((ball, index) => {
              const ballColor = getBallColor(ball);

              return (
                <motion.div
                  key={ball}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.03 }}
                  className="flex-shrink-0"
                >
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: ballColor }}
                  />
                </motion.div>
              );
            })}

            {/* Train wagon at the end */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex-shrink-0"
            >
              <svg width="50" height="50" viewBox="0 0 50 50">
                {/* Wagon body */}
                <rect x="5" y="15" width="35" height="25" fill="#6B8E23" rx="4" />
                <rect x="10" y="20" width="12" height="10" fill="#87CEEB" rx="2" />
                <rect x="23" y="20" width="12" height="10" fill="#87CEEB" rx="2" />
                {/* Wheels */}
                <circle cx="15" cy="42" r="5" fill="#333" />
                <circle cx="30" cy="42" r="5" fill="#333" />
                <circle cx="15" cy="42" r="3" fill="#666" />
                <circle cx="30" cy="42" r="3" fill="#666" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Number boxes below the train - aligned with flagpoles */}
        <div className="relative flex justify-center">
          <div style={{ width: `${totalBalls * ballWidth + 110}px`, height: '64px', position: 'relative' }}>
            {/* Start number box - aligned with starting position */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute w-20 h-20 flex items-center justify-center text-3xl font-bold bg-orange-300 border-4 border-orange-400 rounded-xl"
              style={{
                left: `${trainStartX + (exercise.start - 1) * ballWidth + 16 - 40}px`,
                top: '8px'
              }}
            >
              {exercise.start}
            </motion.div>

            {/* Middle number box (10) - aligned with position 10 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute w-20 h-20 flex items-center justify-center text-3xl font-bold bg-orange-300 border-4 border-orange-400 rounded-xl"
              style={{
                left: `${trainStartX + 9 * ballWidth + 16 - 40}px`,
                top: '8px'
              }}
            >
              10
            </motion.div>

            {/* End number box - input - aligned with end position */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute w-20 h-20 flex items-center justify-center border-4 border-dashed border-orange-400 rounded-xl"
              style={{
                left: `${trainStartX + (result - 1) * ballWidth + 16 - 40}px`,
                backgroundColor: 'white',
                top: '8px'
              }}
            >
              <input
                type="number"
                value={answers.get("result") ?? ""}
                onChange={(e) => handleInputChange("result", e.target.value)}
                className="w-full h-full text-3xl font-bold text-center bg-transparent focus:outline-none"
                placeholder=""
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
