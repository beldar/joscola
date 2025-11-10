"use client";

import { motion } from "framer-motion";
import type { EstimationExercise as EstimationType } from "@/lib/exercises/types";
import { useState } from "react";

interface Props {
  exercise: EstimationType;
  onAnswer: (answers: Map<string, string>) => void;
  answers: Map<string, string>;
}

export function EstimationExercise({ exercise, onAnswer, answers }: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>(
    answers.get("items")?.split(",") || []
  );

  const handleItemToggle = (itemName: string) => {
    const newSelected = selectedItems.includes(itemName)
      ? selectedItems.filter((i) => i !== itemName)
      : [...selectedItems, itemName];

    setSelectedItems(newSelected);

    const newAnswers = new Map(answers);
    newAnswers.set("items", newSelected.join(","));
    onAnswer(newAnswers);
  };

  const getTotalCost = () => {
    return selectedItems.reduce((sum, itemName) => {
      const item = exercise.items.find((i) => i.name === itemName);
      return sum + (item?.price || 0);
    }, 0);
  };

  const isItemSelected = (itemName: string) => {
    return selectedItems.includes(itemName);
  };

  const totalCost = getTotalCost();
  const remaining = exercise.money - totalCost;

  return (
    <div className="space-y-8">
      {/* Question */}
      <div className="text-2xl font-bold text-center text-gray-700 uppercase">
        {exercise.question}
      </div>

      {/* Money display */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex justify-center"
      >
        <div className="bg-gradient-to-br from-green-200 to-green-300 border-4 border-green-500 rounded-3xl p-8 shadow-lg">
          <div className="text-center">
            <div className="text-xl font-bold text-green-800 uppercase mb-2">
              TENS
            </div>
            <div className="text-6xl font-bold text-green-900">
              {exercise.money}€
            </div>
          </div>
        </div>
      </motion.div>

      {/* Items grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {exercise.items.map((item, idx) => (
          <motion.div
            key={item.name}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <button
              onClick={() => handleItemToggle(item.name)}
              className={`w-full p-6 rounded-2xl border-4 transition-all transform hover:scale-105 ${
                isItemSelected(item.name)
                  ? "bg-blue-200 border-blue-600 shadow-lg scale-105"
                  : "bg-white border-gray-300 hover:border-blue-400"
              }`}
            >
              <div className="text-6xl mb-4">{item.icon}</div>
              <div className="text-xl font-bold text-gray-800 uppercase mb-2">
                {item.name}
              </div>
              <div className="text-3xl font-bold text-orange-600">
                {item.price}€
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Shopping cart summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 border-4 border-purple-200 shadow-lg"
      >
        <div className="text-2xl font-bold text-center text-purple-700 uppercase mb-6">
          🛒 EL TEU CISTELL
        </div>

        {selectedItems.length === 0 ? (
          <div className="text-xl text-center text-gray-500 uppercase py-8">
            CLICA ELS PRODUCTES PER AFEGIR-LOS
          </div>
        ) : (
          <div className="space-y-4">
            {selectedItems.map((itemName) => {
              const item = exercise.items.find((i) => i.name === itemName);
              if (!item) return null;

              return (
                <div
                  key={itemName}
                  className="flex items-center justify-between bg-purple-50 p-4 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{item.icon}</div>
                    <div className="text-xl font-bold text-gray-700 uppercase">
                      {item.name}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {item.price}€
                  </div>
                </div>
              );
            })}

            {/* Total */}
            <div className="border-t-4 border-purple-300 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-800 uppercase">
                  TOTAL:
                </div>
                <div className="text-4xl font-bold text-purple-700">
                  {totalCost}€
                </div>
              </div>

              {/* Remaining money */}
              <div
                className={`mt-4 p-4 rounded-xl text-center ${
                  remaining >= 0
                    ? "bg-green-100 border-2 border-green-400"
                    : "bg-red-100 border-2 border-red-400"
                }`}
              >
                <div className="text-xl font-bold uppercase">
                  {remaining >= 0 ? "ET SOBREN:" : "ET FALTEN:"}
                </div>
                <div
                  className={`text-3xl font-bold ${
                    remaining >= 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {Math.abs(remaining)}€
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
