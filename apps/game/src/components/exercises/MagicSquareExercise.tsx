"use client";

import { motion } from "framer-motion";
import type { MagicSquareExercise as MagicSquareType } from "@/lib/exercises/types";

interface Props {
  exercise: MagicSquareType;
  onAnswer: (answers: Map<string, number>) => void;
  answers: Map<string, number>;
}

export function MagicSquareExercise({ exercise, onAnswer, answers }: Props) {
  // Get which row and column to validate (for visual highlighting)
  const validateRow = (exercise as any).validateRow ?? 0;
  const validateColumn = (exercise as any).validateColumn ?? 0;
  const handleInputChange = (row: number, col: number, value: string) => {
    const newAnswers = new Map(answers);
    const key = `${row}-${col}`;

    if (value === "") {
      newAnswers.delete(key);
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 99) {
        newAnswers.set(key, numValue);
      }
    }
    onAnswer(newAnswers);
  };

  const getValue = (row: number, col: number): number | null => {
    const given = exercise.given.find(g => g.row === row && g.col === col);
    if (given) return given.value;
    return answers.get(`${row}-${col}`) ?? null;
  };

  const isGiven = (row: number, col: number): boolean => {
    return exercise.given.some(g => g.row === row && g.col === col);
  };

  // Check if this is the center cell (for 3x3 grid)
  const isCenterCell = (row: number, col: number): boolean => {
    if (exercise.size === 3) {
      return row === 1 && col === 1;
    }
    // For 2x2, we might put the cloud in a specific position
    return false;
  };

  const renderCell = (row: number, col: number) => {
    // Check if this cell is in the validated row or column
    const isInValidatedRow = row === validateRow;
    const isInValidatedColumn = col === validateColumn;
    const isHighlighted = isInValidatedRow || isInValidatedColumn;

    // Check if this is the center cell that should show the cloud
    if (isCenterCell(row, col)) {
      return (
        <div className={`w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center relative overflow-hidden ${isHighlighted ? 'ring-2 ring-yellow-400' : ''}`}>
          {/* Cloud shape with target sum */}
          <div className="relative">
            {/* Main cloud */}
            <div className="w-20 h-16 bg-white rounded-[40%] flex items-center justify-center shadow-md">
              <span className="text-3xl sm:text-4xl font-bold text-red-600">{exercise.targetSum}</span>
            </div>
            {/* Cloud puffs */}
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-white rounded-full"></div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full"></div>
          </div>
        </div>
      );
    }

    const value = getValue(row, col);
    const given = isGiven(row, col);
    const bgColor = isHighlighted ? 'bg-yellow-50' : 'bg-white';

    if (given) {
      return (
        <div className={`w-24 h-24 sm:w-28 sm:h-28 border-2 ${isHighlighted ? 'border-yellow-500' : 'border-gray-400'} rounded-lg ${bgColor} flex items-center justify-center`}>
          <span className="text-3xl sm:text-4xl font-bold text-red-600">{value}</span>
        </div>
      );
    }

    return (
      <div className={`w-24 h-24 sm:w-28 sm:h-28 border-2 ${isHighlighted ? 'border-yellow-500' : 'border-gray-400'} rounded-lg ${bgColor} flex items-center justify-center relative`}>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value ?? ""}
          onChange={(e) => handleInputChange(row, col, e.target.value)}
          className={`w-full h-full text-3xl sm:text-4xl font-bold text-center text-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg`}
          placeholder=""
          maxLength={2}
        />
        {/* Up/Down arrows visual indicator */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0 pointer-events-none">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Title instruction */}
      <div className="text-xl sm:text-2xl font-bold text-gray-700 text-center uppercase">
        COMPLETA PERQUÈ LA FILA I LA COLUMNA SUMIN {exercise.targetSum}
      </div>

      {/* Magic square grid - the cloud is INSIDE the grid */}
      <div className="bg-red-500 rounded-3xl p-6 shadow-lg">
        <div className={`grid gap-1 ${exercise.size === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          {Array.from({ length: exercise.size }).map((_, row) =>
            Array.from({ length: exercise.size }).map((_, col) => (
              <motion.div
                key={`${row}-${col}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (row * exercise.size + col) * 0.05 }}
              >
                {renderCell(row, col)}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Helper text */}
      <div className="text-center text-gray-600 text-base sm:text-lg uppercase font-semibold">
        CADA FILA I CADA COLUMNA HA DE SUMAR {exercise.targetSum}
      </div>
    </div>
  );
}
