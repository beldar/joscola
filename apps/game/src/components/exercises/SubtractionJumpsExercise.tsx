"use client";

import { motion } from "framer-motion";
import type { SubtractionJumpsExercise as SubtractionJumpsType } from "@/lib/exercises/types";

interface Props {
  exercise: SubtractionJumpsType;
  onAnswer: (answers: Map<string, number>) => void;
  answers: Map<string, number>;
}

export function SubtractionJumpsExercise({ exercise, onAnswer, answers }: Props) {
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

  // Use the steps array from exercise data to determine positioning
  // Example: steps [14, 10, 8] means boxes at positions 14, 10, and 8
  // with jumps -4 and -2
  const steps = exercise.steps;

  // Calculate jump amounts between consecutive steps
  const jumps: number[] = [];
  for (let i = 0; i < steps.length - 1; i++) {
    jumps.push(steps[i] - steps[i + 1]);
  }

  // Generate enough balls to show the subtraction
  const totalBalls = Math.max(20, exercise.start + 5);

  // Ball color alternates every 5 balls (1-5 green, 6-10 yellow, 11-15 green, etc.)
  const getBallColor = (ballNumber: number) => {
    const groupOf5 = Math.ceil(ballNumber / 5);
    return groupOf5 % 2 === 1 ? "#22C55E" : "#EAB308"; // green or yellow
  };

  // Calculate arrow positions for subtraction (going backwards)
  const trainStartX = 60;
  const ballWidth = 32;

  // Create arrow positions for each jump
  const arrowPositions = jumps.map((_, index) => {
    const startPos = steps[index];
    const endPos = steps[index + 1];
    return {
      startX: trainStartX + (startPos - 1) * ballWidth + 16,
      endX: trainStartX + (endPos - 1) * ballWidth + 16,
      label: jumps[index],
    };
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <h3 className="text-2xl font-bold text-teal-600 text-left uppercase">
        1. OMPLE ELS BUITS PER RESTAR COM SUGGEREIX EN BILLY.
      </h3>

      {/* Top section: Equation on LEFT, House diagram + Billy on RIGHT */}
      <div className="flex items-center justify-between gap-8 px-8">
        {/* Left: Main equation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4"
        >
          <div className="w-20 h-20 flex items-center justify-center text-4xl font-bold bg-red-400 text-white border-4 border-red-500 rounded-2xl">
            {exercise.start}
          </div>
          <div className="text-4xl font-bold text-gray-700">-</div>
          <div className="w-20 h-20 flex items-center justify-center text-4xl font-bold bg-red-400 text-white border-4 border-red-500 rounded-2xl">
            {exercise.subtract}
          </div>
          <div className="text-4xl font-bold text-gray-700">=</div>
          <input
            type="number"
            value={answers.get("result") ?? ""}
            onChange={(e) => handleInputChange("result", e.target.value)}
            className="w-28 h-20 text-4xl font-bold text-center border-4 border-cyan-400 border-dashed rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-300 bg-white"
            placeholder=""
          />
        </motion.div>

        {/* Right: House diagram and Billy */}
        <div className="flex items-center gap-8">
          {/* House diagram showing the breakdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="w-48 h-40 border-8 border-amber-600 rounded-3xl bg-white flex flex-col overflow-hidden">
              <div className="flex-1 flex items-center justify-center text-5xl font-bold text-white bg-cyan-400 border-b-4 border-amber-600">
                10
              </div>
              <div className="flex flex-1">
                <div className="flex-1 flex items-center justify-center text-4xl font-bold text-gray-800 border-r-4 border-amber-600 bg-white">
                  {exercise.start}
                </div>
                <div className="flex-1 relative bg-white">
                  <input
                    type="number"
                    value={answers.get("house") ?? ""}
                    onChange={(e) => handleInputChange("house", e.target.value)}
                    className="w-full h-full text-4xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-transparent"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Billy character */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-6xl"
          >
            🦘
          </motion.div>
        </div>
      </div>

      {/* Train with balls and arrows */}
      <div className="relative space-y-2">
        {/* Jump labels and arrows */}
        <div className="relative h-32 flex justify-center">
          <div style={{ width: `${totalBalls * ballWidth + 110}px`, position: 'relative' }}>
            {/* Jump labels */}
            <div className="absolute top-0 left-0 right-0">
              <div className="relative" style={{ height: '32px' }}>
                {arrowPositions.map((arrow, index) => (
                  <div
                    key={index}
                    className="absolute text-3xl font-bold text-red-400"
                    style={{
                      left: `${(arrow.startX + arrow.endX) / 2 - 20}px`,
                      top: '0'
                    }}
                  >
                    - {arrow.label}
                  </div>
                ))}
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
                {arrowPositions.map((arrow, index) => {
                  // Alternate curve heights: first curve lower, second curve higher, etc.
                  const curveHeight = index % 2 === 0 ? 45 : 10;
                  return (
                    <g key={index}>
                      <path
                        d={`M ${arrow.startX} 80 Q ${(arrow.startX + arrow.endX) / 2} ${curveHeight} ${arrow.endX} 80`}
                        fill="none"
                        stroke="#f87171"
                        strokeWidth="4"
                      />
                      <polygon
                        points={`${arrow.endX - 8},72 ${arrow.endX},80 ${arrow.endX - 8},88`}
                        fill="#f87171"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Train of colored balls with flagpoles */}
        <div className="relative flex justify-center">
          <div className="relative inline-flex items-center">
            {/* Train engine at the start */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl mr-2"
            >
              🚂
            </motion.div>

            {/* Colored balls */}
            <div className="flex gap-0">
              {Array.from({ length: totalBalls }).map((_, i) => {
                const ballNumber = i + 1;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="w-8 h-8 rounded-full"
                    style={{
                      backgroundColor: getBallColor(ballNumber),
                      border: '2px solid rgba(0,0,0,0.2)',
                    }}
                  />
                );
              })}
            </div>

            {/* Train caboose at the end */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: totalBalls * 0.02 }}
              className="text-3xl ml-2"
            >
              🚃
            </motion.div>
          </div>

          {/* Vertical lines (flagpoles) at key positions */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={{ width: `${totalBalls * ballWidth + 110}px`, height: '140px' }}
          >
            <div className="relative h-full">
              {/* Flagpoles at each step position */}
              {steps.map((stepValue, index) => (
                <div
                  key={index}
                  className="absolute w-1 h-32 bg-gray-400"
                  style={{
                    left: `${trainStartX + (stepValue - 1) * ballWidth + 16}px`,
                    top: '-4px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Number boxes below the train, aligned with flagpoles */}
        <div className="relative flex justify-center">
          <div
            style={{
              width: `${totalBalls * ballWidth + 110}px`,
              height: '64px',
              position: 'relative',
            }}
          >
            {/* Boxes at each step position */}
            {steps.map((stepValue, index) => {
              const isLastStep = index === steps.length - 1;
              const delay = 0.5 + index * 0.1;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay }}
                  className="absolute"
                  style={{
                    left: `${trainStartX + (stepValue - 1) * ballWidth + 16 - 40}px`,
                    top: '8px',
                  }}
                >
                  {isLastStep ? (
                    // Last step: input field for the result
                    <input
                      type="number"
                      value={answers.get("result-box") ?? ""}
                      onChange={(e) => handleInputChange("result-box", e.target.value)}
                      className="w-20 h-20 text-3xl font-bold text-center border-4 border-orange-400 border-dashed rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-300 bg-white"
                      placeholder="?"
                    />
                  ) : (
                    // Other steps: show the value
                    <div className="w-20 h-20 flex items-center justify-center text-3xl font-bold bg-orange-300 border-4 border-orange-400 rounded-2xl">
                      {stepValue}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
