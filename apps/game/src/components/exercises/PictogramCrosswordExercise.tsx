"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { PictogramCrosswordExercise as PictogramCrosswordType } from "@/lib/exercises/types";

interface Props {
  exercise: PictogramCrosswordType;
  onAnswer: (answers: Map<string, string>) => void;
  answers: Map<string, string>;
}

interface CellInfo {
  row: number;
  col: number;
  letter: string | null;
  horizontalClueNumber?: number;
  verticalClueNumber?: number;
  isPartOfWord: boolean;
  wordIds: string[];
}

export function PictogramCrosswordExercise({ exercise, onAnswer, answers }: Props) {
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  const [currentDirection, setCurrentDirection] = useState<"horizontal" | "vertical">("horizontal");
  const [showSolution, setShowSolution] = useState(false);
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  // Build cell info map
  const cellInfoMap = new Map<string, CellInfo>();

  // Initialize all cells
  for (let row = 0; row < exercise.gridSize.rows; row++) {
    for (let col = 0; col < exercise.gridSize.cols; col++) {
      const key = `${row}-${col}`;
      cellInfoMap.set(key, {
        row,
        col,
        letter: exercise.grid[row]?.[col] ?? null,
        isPartOfWord: false,
        wordIds: []
      });
    }
  }

  // Mark cells that are part of words and add clue numbers
  exercise.words.forEach(word => {
    const wordId = `${word.startRow}-${word.startCol}-${word.direction}`;
    for (let i = 0; i < word.word.length; i++) {
      const row = word.direction === "horizontal" ? word.startRow : word.startRow + i;
      const col = word.direction === "horizontal" ? word.startCol + i : word.startCol;
      const key = `${row}-${col}`;
      const cellInfo = cellInfoMap.get(key);
      if (cellInfo) {
        cellInfo.isPartOfWord = true;
        cellInfo.wordIds.push(wordId);
        if (i === 0) {
          if (word.direction === "horizontal") {
            cellInfo.horizontalClueNumber = word.clueNumber;
          } else {
            cellInfo.verticalClueNumber = word.clueNumber;
          }
        }
      }
    }
  });

  // Get user input for a cell (or pre-filled value)
  const getCellValue = (row: number, col: number): string => {
    // Check if cell has a pre-filled letter
    const gridValue = exercise.grid[row]?.[col];
    if (typeof gridValue === "string" && gridValue.length > 0) {
      return gridValue;
    }
    const key = `cell-${row}-${col}`;
    return (answers.get(key) as string) || "";
  };

  // Handle cell input
  const handleCellInput = (row: number, col: number, value: string) => {
    const letter = value.toUpperCase().slice(-1);
    const key = `cell-${row}-${col}`;
    const newAnswers = new Map(answers);
    newAnswers.set(key, letter);
    onAnswer(newAnswers);

    // Auto-advance to next cell
    if (letter) {
      moveToNextCell(row, col);
    }
  };

  // Check if a cell is pre-filled
  const isCellPreFilled = (row: number, col: number): boolean => {
    const gridValue = exercise.grid[row]?.[col];
    return typeof gridValue === "string" && gridValue.length > 0;
  };

  // Move to next cell in current direction (skipping pre-filled cells)
  const moveToNextCell = (row: number, col: number) => {
    let nextRow = row;
    let nextCol = col;

    // Keep moving until we find an editable cell or reach the end
    while (true) {
      if (currentDirection === "horizontal") {
        nextCol++;
      } else {
        nextRow++;
      }

      // Check if next cell is valid and part of a word
      const nextKey = `${nextRow}-${nextCol}`;
      const nextCell = cellInfoMap.get(nextKey);

      if (!nextCell?.isPartOfWord) {
        // Reached end of word or grid
        break;
      }

      // Skip pre-filled cells
      if (isCellPreFilled(nextRow, nextCol)) {
        continue;
      }

      // Found an editable cell
      setFocusedCell({ row: nextRow, col: nextCol });
      const inputRef = inputRefs.current.get(nextKey);
      inputRef?.focus();
      break;
    }
  };

  // Handle backspace
  const handleKeyDown = (row: number, col: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !getCellValue(row, col)) {
      e.preventDefault();
      // Move to previous cell
      let prevRow = row;
      let prevCol = col;

      if (currentDirection === "horizontal") {
        prevCol--;
      } else {
        prevRow--;
      }

      const prevKey = `${prevRow}-${prevCol}`;
      const prevCell = cellInfoMap.get(prevKey);
      if (prevCell?.isPartOfWord) {
        setFocusedCell({ row: prevRow, col: prevCol });
        const inputRef = inputRefs.current.get(prevKey);
        inputRef?.focus();
        // Clear the previous cell
        const key = `cell-${prevRow}-${prevCol}`;
        const newAnswers = new Map(answers);
        newAnswers.set(key, "");
        onAnswer(newAnswers);
      }
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setCurrentDirection("horizontal");
      moveToNextCell(row, col);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setCurrentDirection("horizontal");
      const prevCol = col - 1;
      const prevKey = `${row}-${prevCol}`;
      const prevCell = cellInfoMap.get(prevKey);
      if (prevCell?.isPartOfWord) {
        setFocusedCell({ row, col: prevCol });
        inputRefs.current.get(prevKey)?.focus();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCurrentDirection("vertical");
      const nextRow = row + 1;
      const nextKey = `${nextRow}-${col}`;
      const nextCell = cellInfoMap.get(nextKey);
      if (nextCell?.isPartOfWord) {
        setFocusedCell({ row: nextRow, col });
        inputRefs.current.get(nextKey)?.focus();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCurrentDirection("vertical");
      const prevRow = row - 1;
      const prevKey = `${prevRow}-${col}`;
      const prevCell = cellInfoMap.get(prevKey);
      if (prevCell?.isPartOfWord) {
        setFocusedCell({ row: prevRow, col });
        inputRefs.current.get(prevKey)?.focus();
      }
    }
  };

  // Check if a word is correctly filled
  const isWordCorrect = (word: typeof exercise.words[0]): boolean => {
    for (let i = 0; i < word.word.length; i++) {
      const row = word.direction === "horizontal" ? word.startRow : word.startRow + i;
      const col = word.direction === "horizontal" ? word.startCol + i : word.startCol;
      const userValue = getCellValue(row, col);
      if (userValue.toUpperCase() !== word.word[i].toUpperCase()) {
        return false;
      }
    }
    return true;
  };

  // Count correct words
  const correctWordsCount = exercise.words.filter(isWordCorrect).length;
  const allWordsCorrect = correctWordsCount === exercise.words.length;

  // Group words by direction for clues display
  const horizontalWords = exercise.words.filter(w => w.direction === "horizontal").sort((a, b) => a.clueNumber - b.clueNumber);
  const verticalWords = exercise.words.filter(w => w.direction === "vertical").sort((a, b) => a.clueNumber - b.clueNumber);

  // Handle clicking on a clue
  const handleClueClick = (word: typeof exercise.words[0]) => {
    setFocusedCell({ row: word.startRow, col: word.startCol });
    setCurrentDirection(word.direction);
    const key = `${word.startRow}-${word.startCol}`;
    inputRefs.current.get(key)?.focus();
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-white rounded-2xl p-4 border-4 border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold uppercase">PROGRESO</span>
          <span className="text-xl">
            <span className="font-bold text-green-600">{correctWordsCount}</span>
            {" / "}
            <span className="font-bold">{exercise.words.length}</span>
            {" palabras"}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
          <motion.div
            className="bg-green-500 h-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(correctWordsCount / exercise.words.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Crossword Grid */}
        <div className="bg-white rounded-2xl p-4 border-4 border-gray-200 flex-shrink-0 overflow-x-auto">
          <div
            className="grid gap-0.5 mx-auto"
            style={{
              gridTemplateColumns: `repeat(${exercise.gridSize.cols}, minmax(28px, 40px))`,
              width: "fit-content"
            }}
          >
            {Array.from({ length: exercise.gridSize.rows }).map((_, rowIndex) =>
              Array.from({ length: exercise.gridSize.cols }).map((_, colIndex) => {
                const key = `${rowIndex}-${colIndex}`;
                const cellInfo = cellInfoMap.get(key);
                const isActive = cellInfo?.isPartOfWord;
                const isFocused = focusedCell?.row === rowIndex && focusedCell?.col === colIndex;
                const value = getCellValue(rowIndex, colIndex);

                // Check if cell has a pre-filled letter (not empty string and not null)
                const gridValue = exercise.grid[rowIndex]?.[colIndex];
                const isPreFilled = typeof gridValue === "string" && gridValue.length > 0;

                // Helper to render clue numbers
                const renderClueNumbers = (isWhiteText: boolean) => {
                  const hNum = cellInfo?.horizontalClueNumber;
                  const vNum = cellInfo?.verticalClueNumber;
                  const textColor = isWhiteText ? "text-white" : "text-gray-500";

                  if (hNum && vNum) {
                    // Both horizontal and vertical clues start here
                    return (
                      <>
                        <span className={`absolute -top-0.5 -left-0.5 text-[8px] font-bold ${textColor} bg-blue-500 text-white rounded-sm px-0.5 leading-none`}>
                          {hNum}
                        </span>
                        <span className={`absolute -top-0.5 -right-0.5 text-[8px] font-bold ${textColor} bg-purple-500 text-white rounded-sm px-0.5 leading-none`}>
                          {vNum}
                        </span>
                      </>
                    );
                  } else if (hNum) {
                    return (
                      <span className={`absolute top-0 left-0.5 text-[9px] font-bold ${textColor}`}>
                        {hNum}
                      </span>
                    );
                  } else if (vNum) {
                    return (
                      <span className={`absolute top-0 left-0.5 text-[9px] font-bold ${textColor}`}>
                        {vNum}
                      </span>
                    );
                  }
                  return null;
                };

                if (!isActive) {
                  return (
                    <div
                      key={key}
                      className="aspect-square bg-gray-800 rounded"
                    />
                  );
                }

                // Render pre-filled cells with colored background (read-only)
                if (isPreFilled) {
                  return (
                    <div
                      key={key}
                      className="relative aspect-square border-2 rounded border-pink-400 bg-pink-500"
                    >
                      {renderClueNumbers(true)}
                      <div className="w-full h-full flex items-center justify-center text-base md:text-xl font-bold uppercase text-white">
                        {gridValue}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={key}
                    className={`
                      relative aspect-square
                      border-2 rounded
                      ${isFocused ? "border-blue-500 bg-blue-50" : "border-gray-400 bg-white"}
                    `}
                  >
                    {renderClueNumbers(false)}
                    <input
                      ref={(el) => {
                        if (el) inputRefs.current.set(key, el);
                      }}
                      type="text"
                      value={value}
                      onChange={(e) => handleCellInput(rowIndex, colIndex, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(rowIndex, colIndex, e)}
                      onFocus={() => setFocusedCell({ row: rowIndex, col: colIndex })}
                      className={`
                        w-full h-full text-center text-base md:text-xl font-bold uppercase
                        bg-transparent outline-none
                        ${value ? "text-gray-800" : "text-gray-400"}
                      `}
                      maxLength={1}
                      autoComplete="off"
                      autoCapitalize="characters"
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Clues with Emojis */}
        <div className="space-y-4 flex-1 min-w-0">
          {/* Horizontal Clues */}
          {horizontalWords.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border-4 border-blue-200">
              <h3 className="text-lg font-bold uppercase mb-3 text-blue-800">
                → HORIZONTAL
              </h3>
              <div className="space-y-2">
                {horizontalWords.map((word) => {
                  const isCorrect = isWordCorrect(word);
                  return (
                    <motion.button
                      key={`h-${word.clueNumber}`}
                      onClick={() => handleClueClick(word)}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-xl text-left
                        transition-colors
                        ${isCorrect
                          ? "bg-green-100 border-2 border-green-400"
                          : "bg-gray-50 border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                        }
                      `}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-4xl">{word.emoji}</span>
                      <div className="flex-1">
                        <span className="font-bold text-gray-600">
                          {word.clueNumber}.
                        </span>
                        {showSolution ? (
                          <span className="ml-2 text-yellow-600 font-bold">
                            {word.word}
                          </span>
                        ) : (
                          <span className="ml-2 text-gray-500">
                            ({word.word.length} letras)
                          </span>
                        )}
                      </div>
                      {isCorrect && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-2xl"
                        >
                          ✅
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vertical Clues */}
          {verticalWords.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border-4 border-purple-200">
              <h3 className="text-lg font-bold uppercase mb-3 text-purple-800">
                ↓ VERTICAL
              </h3>
              <div className="space-y-2">
                {verticalWords.map((word) => {
                  const isCorrect = isWordCorrect(word);
                  return (
                    <motion.button
                      key={`v-${word.clueNumber}`}
                      onClick={() => handleClueClick(word)}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-xl text-left
                        transition-colors
                        ${isCorrect
                          ? "bg-green-100 border-2 border-green-400"
                          : "bg-gray-50 border-2 border-gray-200 hover:bg-purple-50 hover:border-purple-300"
                        }
                      `}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-4xl">{word.emoji}</span>
                      <div className="flex-1">
                        <span className="font-bold text-gray-600">
                          {word.clueNumber}.
                        </span>
                        {showSolution ? (
                          <span className="ml-2 text-yellow-600 font-bold">
                            {word.word}
                          </span>
                        ) : (
                          <span className="ml-2 text-gray-500">
                            ({word.word.length} letras)
                          </span>
                        )}
                      </div>
                      {isCorrect && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-2xl"
                        >
                          ✅
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Small hint button at bottom */}
          <button
            onClick={() => setShowSolution(!showSolution)}
            className={`
              text-xs py-1 px-3 rounded-lg
              transition-colors
              ${showSolution
                ? "text-yellow-600 hover:text-yellow-700"
                : "text-gray-400 hover:text-gray-500"
              }
            `}
          >
            {showSolution ? "ocultar nombres" : "no entiendo los dibujos..."}
          </button>
        </div>
      </div>

      {/* Success message */}
      {allWordsCorrect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-100 rounded-2xl p-6 border-4 border-green-400 text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-800 uppercase">
            ¡CRUCIGRAMA COMPLETADO!
          </h3>
          <p className="text-lg text-green-700">
            Has resuelto todas las palabras correctamente
          </p>
        </motion.div>
      )}
    </div>
  );
}
