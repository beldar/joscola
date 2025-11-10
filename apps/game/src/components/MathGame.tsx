"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@joscola/ui";
import { randomInRange, shuffleArray } from "@/lib/utils";

interface Question {
  num1: number;
  num2: number;
  correctAnswer: number;
  options: number[];
}

export function MathGame() {
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const generateQuestion = () => {
    const num1 = randomInRange(1, 10);
    const num2 = randomInRange(1, 10);
    const correctAnswer = num1 + num2;

    // Generate wrong answers
    const wrongAnswers = new Set<number>();
    while (wrongAnswers.size < 3) {
      const wrong = randomInRange(correctAnswer - 5, correctAnswer + 5);
      if (wrong !== correctAnswer && wrong > 0) {
        wrongAnswers.add(wrong);
      }
    }

    const options = shuffleArray([correctAnswer, ...Array.from(wrongAnswers)]);

    setQuestion({ num1, num2, correctAnswer, options });
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleAnswer = (answer: number) => {
    if (!question) return;

    const isCorrect = answer === question.correctAnswer;
    setFeedback(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setScore(score + 1);
    }

    setQuestionsAnswered(questionsAnswered + 1);

    setTimeout(() => {
      generateQuestion();
    }, 1500);
  };

  if (!question) return null;

  return (
    <div className="game-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-blue-600">
            🎯 Score: {score}
          </div>
          <div className="text-lg text-gray-600">
            Question {questionsAnswered + 1}
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={`${question.num1}-${question.num2}`}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl font-bold text-gray-800 mb-4">
            {question.num1} + {question.num2} = ?
          </div>
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {question.options.map((option, index) => (
            <Button
              key={`${option}-${index}`}
              variant="primary"
              size="lg"
              onClick={() => handleAnswer(option)}
              disabled={feedback !== null}
              className="text-3xl py-8"
            >
              {option}
            </Button>
          ))}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className={`text-center py-4 rounded-xl text-2xl font-bold ${
                feedback === "correct"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {feedback === "correct" ? "🎉 Correct!" : "❌ Try again!"}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
