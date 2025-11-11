"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import type { ReadingSpeedExercise as ReadingSpeedType } from "@/lib/exercises/types";

interface Props {
  exercise: ReadingSpeedType;
  onAnswer: (answers: Map<string, number>) => void;
  answers: Map<string, number>;
}

export function ReadingSpeedExercise({ exercise, onAnswer, answers }: Props) {
  const [timeRemaining, setTimeRemaining] = useState(exercise.timeLimit);
  const [isRunning, setIsRunning] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordsRead, setWordsRead] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasSubmittedRef = useRef(false);
  const finalWordsCountRef = useRef(0);

  // Track when exercise is completed and update answers
  useEffect(() => {
    if (hasCompleted && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      // Create a completely new Map to ensure proper state update
      const newAnswers = new Map();
      newAnswers.set("wordsRead", finalWordsCountRef.current);
      newAnswers.set("timeUsed", exercise.timeLimit - timeRemaining);

      // Only auto-complete if all words were read (success case)
      if (finalWordsCountRef.current >= exercise.words.length) {
        newAnswers.set("autoComplete", 1); // Signal that this should auto-complete
      }

      console.log('Reading Speed Complete:', {
        wordsRead: finalWordsCountRef.current,
        totalWords: exercise.words.length,
        timeUsed: exercise.timeLimit - timeRemaining,
        isSuccess: finalWordsCountRef.current >= exercise.words.length,
        mapEntries: Array.from(newAnswers.entries())
      });
      onAnswer(newAnswers);
    }
  }, [hasCompleted, timeRemaining, exercise.timeLimit, exercise.words.length, onAnswer]);

  // Format words in columns
  const getWordColumns = () => {
    const columns: string[][] = [];
    const wordsPerColumn = Math.ceil(exercise.words.length / exercise.columns);

    for (let i = 0; i < exercise.columns; i++) {
      const start = i * wordsPerColumn;
      const end = Math.min(start + wordsPerColumn, exercise.words.length);
      columns.push(exercise.words.slice(start, end));
    }

    return columns;
  };

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Use setTimeout to avoid state update during render
            setTimeout(() => {
              handleComplete(wordsRead);
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeRemaining, wordsRead]);

  const handleStart = () => {
    setIsRunning(true);
    setHasStarted(true);
    setTimeRemaining(exercise.timeLimit);
  };

  const handleComplete = (wordCount?: number) => {
    // Store the final word count
    finalWordsCountRef.current = wordCount || wordsRead;
    setIsRunning(false);
    setHasCompleted(true);
    // Answers will be submitted via useEffect to avoid render-time state updates
  };

  const handleWordClick = (columnIndex: number, wordIndex: number) => {
    if (!isRunning) return;

    // Calculate the actual word index in the linear array
    const wordsPerColumn = Math.ceil(exercise.words.length / exercise.columns);
    const actualIndex = columnIndex * wordsPerColumn + wordIndex;

    // Only count if this is the next word in sequence
    if (actualIndex === currentWordIndex) {
      setCurrentWordIndex(actualIndex + 1);
      const newCount = wordsRead + 1;
      setWordsRead(newCount);

      // Check if all words have been read
      if (newCount >= exercise.words.length) {
        // Use setTimeout to avoid state update during render
        setTimeout(() => {
          handleComplete(newCount);
        }, 0);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const columns = getWordColumns();

  return (
    <div className="space-y-6">
      {/* Timer and Progress */}
      <div className="bg-white rounded-2xl p-6 border-4 border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold uppercase">
            Fase {exercise.phase}
          </div>
          <div className={`text-3xl font-bold ${timeRemaining <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
            ⏱️ {formatTime(timeRemaining)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-lg">
            <span className="uppercase">Paraules llegides:</span>
            <span className="font-bold">{wordsRead} / {exercise.words.length}</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-4">
            <motion.div
              className="bg-green-500 h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(wordsRead / exercise.words.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Start/Complete Button */}
      {!hasStarted && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleStart}
          className="w-full py-6 text-3xl font-bold bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors uppercase"
        >
          Començar
        </motion.button>
      )}

      {/* Words Grid */}
      {hasStarted && (
        <div className="bg-white rounded-2xl p-8 border-4 border-gray-200">
          <div className="grid grid-cols-4 gap-8">
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-2">
                {column.map((word, wordIndex) => {
                  const wordsPerColumn = Math.ceil(exercise.words.length / exercise.columns);
                  const actualIndex = columnIndex * wordsPerColumn + wordIndex;
                  const isRead = actualIndex < currentWordIndex;
                  const isCurrent = actualIndex === currentWordIndex;

                  return (
                    <motion.div
                      key={`${columnIndex}-${wordIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: wordIndex * 0.01 }}
                      onClick={() => handleWordClick(columnIndex, wordIndex)}
                      className={`
                        text-xl py-2 px-3 rounded-lg text-center cursor-pointer transition-all uppercase font-bold
                        ${isRead ? 'bg-green-100 text-green-800 line-through' : ''}
                        ${isCurrent ? 'bg-yellow-100 border-2 border-yellow-400 font-bold scale-110' : ''}
                        ${!isRead && !isCurrent ? 'hover:bg-gray-100' : ''}
                      `}
                    >
                      {word.toUpperCase()}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completion Message */}
      {hasCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`bg-white rounded-2xl p-6 border-4 ${
            wordsRead >= exercise.words.length ? 'border-green-400' : 'border-orange-400'
          } text-center`}
        >
          <div className="text-4xl mb-4">
            {wordsRead >= exercise.words.length ? '🎉' : '⏰'}
          </div>
          <h3 className="text-2xl font-bold uppercase mb-2">
            {wordsRead >= exercise.words.length ? 'Excel·lent!' : 'Temps esgotat!'}
          </h3>
          <p className="text-xl mb-4">
            Has llegit <span className="font-bold text-green-600">{wordsRead}</span> de {exercise.words.length} paraules
          </p>
          {wordsRead >= exercise.words.length ? (
            <p className="text-lg text-gray-600">
              en {formatTime(exercise.timeLimit - timeRemaining)}
            </p>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => {
                // Reset the exercise
                setTimeRemaining(exercise.timeLimit);
                setIsRunning(false);
                setCurrentWordIndex(0);
                setWordsRead(0);
                setHasStarted(false);
                setHasCompleted(false);
                hasSubmittedRef.current = false;
                finalWordsCountRef.current = 0;
                // Clear the answers
                onAnswer(new Map());
              }}
              className="mt-4 px-8 py-3 text-xl font-bold bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-colors uppercase"
            >
              Tornar a intentar 🔄
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Instructions */}
      {!hasStarted && (
        <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
          <h3 className="text-xl font-bold uppercase mb-2">Instruccions:</h3>
          <ul className="space-y-2 text-lg">
            <li>• Llegeix les paraules per columnes, de dalt a baix</li>
            <li>• No et saltis cap paraula</li>
            <li>• Si una paraula et resulta difícil, intenta-ho fins aconseguir-la</li>
            <li>• L'objectiu és llegir les 60 paraules en 2 minuts</li>
            <li>• Fes clic a cada paraula quan la llegeixis</li>
          </ul>
        </div>
      )}
    </div>
  );
}