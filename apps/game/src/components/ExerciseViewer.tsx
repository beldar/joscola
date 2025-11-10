"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@joscola/ui";
import { matematiquesExerciseSets } from "@/lib/exercises/matematiques";
import { useGameStore } from "@/lib/store";
import { GameHeader } from "./GameHeader";
import { MedalAnimation } from "./MedalAnimation";
import { playCoinSound, playMedalSound, playSuccessSound, playErrorSound, initAudioContext } from "@/lib/sounds";
import { NumberSequenceExercise } from "./exercises/NumberSequenceExercise";
import { AdditionThreeExercise } from "./exercises/AdditionThreeExercise";
import { SubtractionJumpsExercise } from "./exercises/SubtractionJumpsExercise";
import { AdditionJumpsExercise } from "./exercises/AdditionJumpsExercise";
import { CountingExercise } from "./exercises/CountingExercise";
import { Grid100Exercise } from "./exercises/Grid100Exercise";
import { NumberOrderExercise } from "./exercises/NumberOrderExercise";
import { TrainPositionExercise } from "./exercises/TrainPositionExercise";
import { NumberPatternExercise } from "./exercises/NumberPatternExercise";
import { MagicSquareExercise } from "./exercises/MagicSquareExercise";
import { NumberLineExercise } from "./exercises/NumberLineExercise";
import { EstimationExercise } from "./exercises/EstimationExercise";
import type { Exercise } from "@/lib/exercises/types";

interface Props {
  setId: string;
  onBack: () => void;
}

// Helper functions for localStorage
const STORAGE_KEY_PREFIX = "exercise-answers-";
const STORAGE_KEY_CORRECTIONS = "exercise-corrections-";

const saveAnswersToStorage = (exerciseId: string, answers: Map<string, number | string>) => {
  if (typeof window !== "undefined") {
    const obj = Object.fromEntries(answers);
    localStorage.setItem(STORAGE_KEY_PREFIX + exerciseId, JSON.stringify(obj));
  }
};

const loadAnswersFromStorage = (exerciseId: string): Map<string, number | string> => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX + exerciseId);
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        return new Map(Object.entries(obj));
      } catch (e) {
        return new Map();
      }
    }
  }
  return new Map();
};

const saveCorrectionsToStorage = (setId: string, corrections: Map<string, boolean>) => {
  if (typeof window !== "undefined") {
    const obj = Object.fromEntries(corrections);
    localStorage.setItem(STORAGE_KEY_CORRECTIONS + setId, JSON.stringify(obj));
  }
};

const loadCorrectionsFromStorage = (setId: string): Map<string, boolean> => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY_CORRECTIONS + setId);
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        return new Map(Object.entries(obj).map(([k, v]) => [k, v as boolean]));
      } catch (e) {
        return new Map();
      }
    }
  }
  return new Map();
};

const deleteAnswersFromStorage = (exerciseId: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY_PREFIX + exerciseId);
  }
};

export function ExerciseViewer({ setId, onBack }: Props) {
  const exerciseSet = matematiquesExerciseSets.find((s) => s.id === setId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number | string>>(new Map());
  const [corrections, setCorrections] = useState<Map<string, boolean>>(new Map());
  const [showCorrection, setShowCorrection] = useState(false);
  const [showMedal, setShowMedal] = useState(false);
  const [justEarnedCoin, setJustEarnedCoin] = useState(false);
  const {
    markExerciseComplete,
    addCoins,
    awardMedal,
    isExerciseSetComplete,
    getMedalsForSet,
    getExerciseProgress
  } = useGameStore();

  // Load corrections from localStorage on mount and init audio
  useEffect(() => {
    const loadedCorrections = loadCorrectionsFromStorage(setId);
    setCorrections(loadedCorrections);

    // Find the first incomplete exercise and start there
    if (exerciseSet) {
      const firstIncompleteIndex = exerciseSet.exercises.findIndex(
        (exercise) => !loadedCorrections.get(exercise.id)
      );
      // If all exercises are complete, start at the beginning; otherwise start at first incomplete
      setCurrentIndex(firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex);
    }

    // Initialize audio context on mount
    initAudioContext();
  }, [setId, exerciseSet]);

  // Load answers for current exercise when it changes
  useEffect(() => {
    if (!exerciseSet) return;
    const currentExercise = exerciseSet.exercises[currentIndex];
    const loadedAnswers = loadAnswersFromStorage(currentExercise.id);
    setAnswers(loadedAnswers);
    setShowCorrection(false);
  }, [exerciseSet, currentIndex]);

  if (!exerciseSet) {
    return <div>Exercise set not found</div>;
  }

  const currentExercise = exerciseSet.exercises[currentIndex];

  // Load saved answers when currentIndex changes
  const loadExerciseData = (index: number) => {
    const exercise = exerciseSet.exercises[index];
    const saved = loadAnswersFromStorage(exercise.id);
    setAnswers(saved);
    setShowCorrection(false);
  };

  const validateAnswer = (exercise: Exercise, answers: Map<string, number | string>): boolean => {
    switch (exercise.type) {
      case "number-sequence": {
        const sequence: number[] = [];
        let current = exercise.start;

        for (let i = 0; i < exercise.length; i++) {
          sequence.push(current);
          if (exercise.direction === "forward") {
            current += exercise.step;
          } else {
            current -= exercise.step;
          }
        }

        return exercise.missingIndices.every((idx) => {
          const answer = answers.get(`pos-${idx}`);
          return answer === sequence[idx];
        });
      }

      case "addition-three": {
        const [num1, num2, num3] = exercise.numbers;
        const correctAnswer = num1 + num2 + num3;
        return answers.get("result") === correctAnswer;
      }

      case "subtraction-jumps": {
        const correctAnswer = exercise.start - exercise.subtract;
        return answers.get("result") === correctAnswer;
      }

      case "addition-jumps": {
        const correctResult = exercise.start + exercise.add;
        const toTen = 10 - exercise.start;
        // Validate both: the house diagram (toTen) and the final result
        return answers.get("step-1") === toTen && answers.get("result") === correctResult;
      }

      case "counting": {
        return answers.get("count") === exercise.count;
      }

      case "grid-100": {
        return exercise.missingNumbers.every((num) => {
          return answers.get(`num-${num}`) === num;
        });
      }

      case "number-order": {
        if (exercise.question === "smallest") {
          const min = Math.min(...exercise.numbers);
          return answers.get("answer") === min;
        } else if (exercise.question === "largest") {
          const max = Math.max(...exercise.numbers);
          return answers.get("answer") === max;
        } else if (exercise.question === "order-asc") {
          const sorted = [...exercise.numbers].sort((a, b) => a - b);
          return sorted.every((num, idx) => answers.get(`pos-${idx}`) === num);
        } else if (exercise.question === "order-desc") {
          const sorted = [...exercise.numbers].sort((a, b) => b - a);
          return sorted.every((num, idx) => answers.get(`pos-${idx}`) === num);
        }
        return false;
      }

      case "train-position": {
        return exercise.missingPositions.every((pos) => {
          return answers.get(`pos-${pos}`) === pos;
        });
      }

      case "number-pattern": {
        return exercise.patterns.every((pattern, patternIndex) => {
          return pattern.missing.every((pos) => {
            const key = `pattern-${patternIndex}-${pos}`;
            const answer = answers.get(key);

            // Find the reference number (center or adjacent)
            const centerValue = pattern.given.find(g => g.position === "center")?.value;

            if (centerValue !== undefined) {
              // For cross patterns, adjacent cells differ by 10
              if (pos === "top") return answer === centerValue - 10;
              if (pos === "bottom") return answer === centerValue + 10;
              if (pos === "left") return answer === centerValue - 1;
              if (pos === "right") return answer === centerValue + 1;
            }

            // For line patterns, check sequential numbers
            const givenValues = pattern.given.map(g => ({ pos: parseInt(g.position), val: g.value }));
            if (givenValues.length > 0) {
              const sortedGiven = givenValues.sort((a, b) => a.pos - b.pos);
              const firstPos = sortedGiven[0].pos;
              const firstVal = sortedGiven[0].val;
              const posNum = parseInt(pos);
              const expectedValue = firstVal + (posNum - firstPos);
              return answer === expectedValue;
            }

            return false;
          });
        });
      }

      case "magic-square": {
        const size = exercise.size;

        // For 3x3 grids, the center cell (1,1) is the cloud, not a number
        const isCenterCloud = size === 3;
        const expectedAnswers = isCenterCloud ?
          (size * size - exercise.given.length - 1) : // -1 for the center cloud
          (size * size - exercise.given.length);

        // Check if all non-cloud cells have answers
        if (answers.size !== expectedAnswers) return false;

        // Build complete grid (using -1 for the cloud cell)
        const grid: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));

        // Fill given values
        exercise.given.forEach(({ row, col, value }) => {
          grid[row][col] = value;
        });

        // Mark center as cloud for 3x3
        if (isCenterCloud) {
          grid[1][1] = -1; // Special marker for cloud
        }

        // Fill answered values
        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            // Skip center cell for 3x3
            if (isCenterCloud && row === 1 && col === 1) continue;

            if (grid[row][col] === 0) {
              const value = answers.get(`${row}-${col}`);
              if (value === undefined) return false;
              grid[row][col] = value as number;
            }
          }
        }

        // For 3x3 grids with center cloud, validate based on exercise configuration
        if (isCenterCloud) {
          // Check if exercise specifies which row/column to validate
          // Default to row 0 and column 0 if not specified
          const rowToCheck = (exercise as any).validateRow ?? 0;
          const colToCheck = (exercise as any).validateColumn ?? 0;

          // Validate the specified row (sum all non-cloud cells)
          let rowSum = 0;
          for (let col = 0; col < size; col++) {
            if (grid[rowToCheck][col] !== -1) {
              rowSum += grid[rowToCheck][col];
            }
          }
          if (rowSum !== exercise.targetSum) return false;

          // Validate the specified column (sum all non-cloud cells)
          let colSum = 0;
          for (let row = 0; row < size; row++) {
            if (grid[row][colToCheck] !== -1) {
              colSum += grid[row][colToCheck];
            }
          }
          if (colSum !== exercise.targetSum) return false;
        } else {
          // For 2x2 or other grids, validate all rows and columns
          for (let row = 0; row < size; row++) {
            let rowSum = 0;
            for (let col = 0; col < size; col++) {
              if (grid[row][col] !== -1) {
                rowSum += grid[row][col];
              }
            }
            if (rowSum !== exercise.targetSum) return false;
          }

          for (let col = 0; col < size; col++) {
            let colSum = 0;
            for (let row = 0; row < size; row++) {
              if (grid[row][col] !== -1) {
                colSum += grid[row][col];
              }
            }
            if (colSum !== exercise.targetSum) return false;
          }
        }

        return true;
      }

      case "number-line": {
        // Check all numbers are placed
        if (answers.size !== exercise.numbersToPlace.length) return false;

        // Validate each number is placed at approximately correct position
        return exercise.numbersToPlace.every((num) => {
          const posKey = Array.from(answers.entries()).find(([_, val]) => val === num)?.[0];
          if (!posKey) return false;

          const placedPosition = parseInt(posKey.split("-")[1]);
          // Allow tolerance of ±2 from the correct position
          return Math.abs(placedPosition - num) <= 2;
        });
      }

      case "estimation": {
        const itemsStr = answers.get("items") as string | undefined;
        if (!itemsStr) return false;

        const selectedItems = itemsStr.split(",").filter((s) => s.length > 0);
        if (selectedItems.length === 0) return false;

        // Calculate total cost
        const totalCost = selectedItems.reduce((sum, itemName) => {
          const item = exercise.items.find((i) => i.name === itemName);
          return sum + (item?.price || 0);
        }, 0);

        // Must be within budget
        return totalCost <= exercise.money;
      }

      default:
        return false;
    }
  };

  const handleCorrection = () => {
    const isCorrect = validateAnswer(currentExercise, answers);
    const newCorrections = new Map(corrections);
    newCorrections.set(currentExercise.id, isCorrect);
    setCorrections(newCorrections);

    // Save to localStorage
    saveAnswersToStorage(currentExercise.id, answers);
    saveCorrectionsToStorage(setId, newCorrections);

    setShowCorrection(true);

    if (isCorrect) {
      // Play success sound
      playSuccessSound();

      // Check if this is the first time completing this exercise
      const progress = getExerciseProgress(setId, currentExercise.id);
      const isFirstTimeCorrect = !progress || !progress.completed;

      markExerciseComplete(setId, currentExercise.id);

      // Award coin only for first-time completion
      if (isFirstTimeCorrect) {
        setJustEarnedCoin(true);
        // Delay coin animation slightly to sync with success feedback
        setTimeout(() => {
          addCoins(1);
          playCoinSound();
        }, 500);
      }

      // Check if this completes the entire set
      const isLastExercise = currentIndex === exerciseSet.exercises.length - 1;
      if (isLastExercise) {
        // Check if all exercises are completed
        setTimeout(() => {
          if (isExerciseSetComplete(setId)) {
            const medals = getMedalsForSet(setId);
            if (medals.length === 0) {
              // Award medal for first-time set completion
              awardMedal(setId, exerciseSet.title);
              setShowMedal(true);
              playMedalSound();
            }
          }
        }, 5000);
      }

      // Auto-advance to next exercise after 2.5 seconds
      setTimeout(() => {
        setShowCorrection(false);
        setJustEarnedCoin(false);
        setTimeout(() => {
          handleNext();
        }, 300);
      }, 2500);
    } else {
      // Play error sound
      playErrorSound();
      // Auto-dismiss feedback for incorrect answers after 2 seconds
      setTimeout(() => {
        setShowCorrection(false);
      }, 2000);
    }
  };

  const handleNext = () => {
    if (currentIndex < exerciseSet.exercises.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      loadExerciseData(nextIndex);
    } else {
      // All exercises completed
      onBack();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      loadExerciseData(prevIndex);
    }
  };

  const handleRetry = () => {
    setAnswers(new Map());
    setShowCorrection(false);
  };

  const handleClearAnswers = () => {
    setAnswers(new Map());

    // Delete from localStorage
    deleteAnswersFromStorage(currentExercise.id);

    const newCorrections = new Map(corrections);
    newCorrections.delete(currentExercise.id);
    setCorrections(newCorrections);
    saveCorrectionsToStorage(setId, newCorrections);

    setShowCorrection(false);
  };

  const isCorrect = corrections.get(currentExercise.id) === true;
  const canCorrect = answers.size > 0;

  const renderExercise = () => {
    switch (currentExercise.type) {
      case "number-sequence":
        return (
          <NumberSequenceExercise
            exercise={currentExercise}
            answers={answers as Map<string, number>}
            onAnswer={setAnswers}
          />
        );

      case "addition-three":
        return (
          <AdditionThreeExercise
            exercise={currentExercise}
            answers={answers as Map<string, number>}
            onAnswer={setAnswers}
          />
        );

      case "subtraction-jumps":
        return (
          <SubtractionJumpsExercise
            exercise={currentExercise}
            answers={answers as Map<string, number>}
            onAnswer={setAnswers}
          />
        );

      case "addition-jumps":
        return (
          <AdditionJumpsExercise
            exercise={currentExercise}
            answers={answers as Map<string, number>}
            onAnswer={setAnswers}
          />
        );

      case "counting":
        return (
          <CountingExercise
            exercise={currentExercise}
            answers={answers as Map<string, number>}
            onAnswer={setAnswers}
          />
        );

      case "grid-100":
        return (
          <Grid100Exercise
            exercise={currentExercise}
            answers={answers as Map<string, number>}
            onAnswer={setAnswers}
          />
        );

      case "number-order":
        return (
          <NumberOrderExercise
            exercise={currentExercise}
            answers={answers as Map<string, number>}
            onAnswer={setAnswers}
          />
        );

      case "train-position":
        return (
          <TrainPositionExercise
            exercise={currentExercise}
            answers={answers as Map<string, number>}
            onAnswer={setAnswers}
          />
        );

      case "number-pattern":
        return (
          <NumberPatternExercise
            exercise={currentExercise}
            answers={answers as Map<string, number>}
            onAnswer={setAnswers}
          />
        );

      case "magic-square":
        return (
          <MagicSquareExercise
            exercise={currentExercise}
            answers={answers as Map<string, number>}
            onAnswer={setAnswers}
          />
        );

      case "number-line":
        return (
          <NumberLineExercise
            exercise={currentExercise}
            answers={answers as Map<string, number>}
            onAnswer={setAnswers}
          />
        );

      case "estimation":
        return (
          <EstimationExercise
            exercise={currentExercise}
            answers={answers as Map<string, string>}
            onAnswer={setAnswers}
          />
        );

      default:
        return <div>Exercise type not implemented yet</div>;
    }
  };

  return (
    <>
      {/* Game Header */}
      <GameHeader onBack={onBack} showBackButton={true} />

      {/* Medal Animation */}
      <MedalAnimation
        show={showMedal}
        setTitle={exerciseSet.title}
        onComplete={() => setShowMedal(false)}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-32 pb-8 px-8">
        <div className="max-w-5xl mx-auto">
          {/* Exercise Info */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 uppercase mb-2">
                  {exerciseSet.icon} {exerciseSet.title}
                </h1>
                <p className="text-xl text-gray-600 uppercase">
                  Exercici {currentIndex + 1} de {exerciseSet.exercises.length}
                </p>
              </div>

              {/* Progress indicator */}
              <div className="flex gap-2">
                {exerciseSet.exercises.map((_, idx) => (
                  <motion.div
                    key={idx}
                    className={`w-4 h-4 rounded-full ${
                      idx === currentIndex
                        ? "bg-blue-500"
                        : corrections.get(exerciseSet.exercises[idx].id)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Exercise Card */}
          <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="bg-white rounded-3xl shadow-2xl p-12 mb-8 overflow-visible"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800 uppercase mb-4">
                {currentExercise.title}
              </h2>
              <p className="text-xl text-gray-600 uppercase">
                {currentExercise.instructions}
              </p>
            </div>

            {renderExercise()}
          </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-4">
          {/* Previous button */}
          <Button
            variant="secondary"
            size="lg"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="text-xl px-8 py-4 uppercase"
          >
            ← ANTERIOR
          </Button>

          {/* Main action buttons */}
          <div className="flex gap-4">
            {isCorrect ? (
              <>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleClearAnswers}
                  className="text-xl px-8 py-4 uppercase"
                >
                  ESBORRAR 🗑️
                </Button>
                <Button
                  variant="success"
                  size="lg"
                  onClick={handleNext}
                  className="text-2xl px-12 py-6 uppercase"
                >
                  {currentIndex < exerciseSet.exercises.length - 1
                    ? "SEGÜENT →"
                    : "ACABAR 🎉"}
                </Button>
              </>
            ) : showCorrection && !isCorrect ? (
              <Button
                variant="danger"
                size="lg"
                onClick={handleRetry}
                className="text-2xl px-12 py-6 uppercase"
              >
                TORNAR A INTENTAR 🔄
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleCorrection}
                disabled={!canCorrect}
                className="text-2xl px-12 py-6 uppercase"
              >
                CORREGIR ✓
              </Button>
            )}
          </div>

          {/* Spacer to balance layout */}
          <div className="w-32"></div>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {showCorrection && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-40 grid h-screen place-items-center"
              >

              {/* Feedback card */}
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{
                  scale: [0, 1.2, 1],
                  opacity: 1,
                  rotate: 0,
                }}
                exit={{ scale: 0, opacity: 0, rotate: 180 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  scale: {
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }
                }}
                className={`p-16 rounded-3xl text-center z-50 shadow-2xl ${
                  isCorrect
                    ? "bg-green-100 border-8 border-green-500"
                    : "bg-red-100 border-8 border-red-500"
                }`}
              >
                <motion.div
                  className="text-9xl mb-4"
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                >
                  {isCorrect ? "🎉" : "❌"}
                </motion.div>
                <p className="text-5xl font-bold uppercase mb-4">
                  {isCorrect ? "BEN FET!" : "TORNA-HO A INTENTAR!"}
                </p>
                {isCorrect && justEarnedCoin && (
                  <motion.div
                    className="flex items-center justify-center gap-3"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <motion.span
                      className="text-6xl"
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 0.5
                      }}
                    >
                      🪙
                    </motion.span>
                    <span className="text-3xl text-yellow-600 font-bold uppercase">+1 MONEDA!</span>
                  </motion.div>
                )}
              </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  );
}
