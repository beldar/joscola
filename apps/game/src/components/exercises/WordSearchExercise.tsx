"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { WordSearchExercise as WordSearchType } from "@/lib/exercises/types";

interface Props {
  exercise: WordSearchType;
  onAnswer: (answers: Map<string, string>) => void;
  answers: Map<string, string>;
}

interface CellPosition {
  row: number;
  col: number;
}

export function WordSearchExercise({ exercise, onAnswer, answers }: Props) {
  const [selectedCells, setSelectedCells] = useState<CellPosition[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const prevExerciseIdRef = useRef<string | null>(null);
  const prevAnswersRef = useRef<string | undefined>(undefined);

  // Sync foundWords state from answers prop
  // This runs when exercise changes or when answers are cleared (retry)
  useEffect(() => {
    const savedFoundWords = answers.get("foundWords");
    const exerciseChanged = prevExerciseIdRef.current !== exercise.id;
    const answersChanged = prevAnswersRef.current !== savedFoundWords;

    // Update refs
    prevExerciseIdRef.current = exercise.id;
    prevAnswersRef.current = savedFoundWords;

    // Only process if exercise changed or answers changed
    if (!exerciseChanged && !answersChanged) {
      return;
    }

    if (savedFoundWords) {
      const words = savedFoundWords.split(",").filter(w => w.length > 0);
      // Only include words that are actually part of this exercise
      const validWords = words.filter(word =>
        exercise.words.some(w => w.toUpperCase() === word.toUpperCase())
      );
      setFoundWords(new Set(validWords));

      // Reconstruct found cells from word positions
      const cells = new Set<string>();
      validWords.forEach(word => {
        const wordPos = exercise.wordPositions.find(wp => wp.word.toUpperCase() === word.toUpperCase());
        if (wordPos) {
          const wordCells = getWordCells(wordPos);
          wordCells.forEach(cell => cells.add(`${cell.row}-${cell.col}`));
        }
      });
      setFoundCells(cells);

      // Auto-fix corrupted localStorage if invalid words were filtered out
      if (validWords.length !== words.length) {
        const newAnswers = new Map(answers);
        newAnswers.set("foundWords", validWords.join(","));
        onAnswer(newAnswers);
      }
    } else {
      // Reset state when no saved words (new exercise or cleared)
      setFoundWords(new Set());
      setFoundCells(new Set());
    }
  }, [exercise.id, exercise.words, exercise.wordPositions, answers]);

  const getWordCells = (wordPos: typeof exercise.wordPositions[0]): CellPosition[] => {
    const cells: CellPosition[] = [];
    const { word, startRow, startCol, direction } = wordPos;

    for (let i = 0; i < word.length; i++) {
      let row = startRow;
      let col = startCol;

      switch (direction) {
        case "horizontal":
          col += i;
          break;
        case "vertical":
          row += i;
          break;
        case "diagonal-down":
          row += i;
          col += i;
          break;
        case "diagonal-up":
          row -= i;
          col += i;
          break;
      }

      cells.push({ row, col });
    }

    return cells;
  };

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isCellFound = (row: number, col: number) => {
    return foundCells.has(getCellKey(row, col));
  };

  const getSelectedWord = useCallback(() => {
    if (selectedCells.length === 0) return "";
    return selectedCells.map(cell => exercise.grid[cell.row][cell.col]).join("");
  }, [selectedCells, exercise.grid]);

  const isValidSelection = (cells: CellPosition[]): boolean => {
    if (cells.length < 2) return true;

    // Check if all cells are in a line (horizontal, vertical, or diagonal)
    const first = cells[0];
    const second = cells[1];
    const rowDiff = second.row - first.row;
    const colDiff = second.col - first.col;

    for (let i = 2; i < cells.length; i++) {
      const expectedRow = first.row + rowDiff * i;
      const expectedCol = first.col + colDiff * i;
      if (cells[i].row !== expectedRow || cells[i].col !== expectedCol) {
        return false;
      }
    }

    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    if (!isSelecting) {
      // Start new selection
      setIsSelecting(true);
      setSelectedCells([{ row, col }]);
    } else {
      // Continue selection
      const newCells = [...selectedCells, { row, col }];

      if (isValidSelection(newCells)) {
        setSelectedCells(newCells);
      }
    }
  };

  const handleCellEnter = (row: number, col: number) => {
    if (!isSelecting || selectedCells.length === 0) return;

    // Check if cell is already selected
    if (isCellSelected(row, col)) return;

    const newCells = [...selectedCells, { row, col }];
    if (isValidSelection(newCells)) {
      setSelectedCells(newCells);
    }
  };

  // Handle touch move for mobile/tablet drag selection
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSelecting || selectedCells.length === 0) return;

    e.preventDefault(); // Prevent scrolling while selecting

    const touch = e.touches[0];
    if (!touch) return;

    // Find which cell the touch is over
    const touchX = touch.clientX;
    const touchY = touch.clientY;

    // Check each cell to see if touch is over it
    cellRefs.current.forEach((cellElement, key) => {
      const rect = cellElement.getBoundingClientRect();
      if (
        touchX >= rect.left &&
        touchX <= rect.right &&
        touchY >= rect.top &&
        touchY <= rect.bottom
      ) {
        const [row, col] = key.split('-').map(Number);
        if (!isCellSelected(row, col)) {
          const newCells = [...selectedCells, { row, col }];
          if (isValidSelection(newCells)) {
            setSelectedCells(newCells);
          }
        }
      }
    });
  }, [isSelecting, selectedCells, isCellSelected, isValidSelection]);

  const checkWord = useCallback(() => {
    const selectedWord = getSelectedWord().toUpperCase();

    // Check if the word matches any of the target words
    const matchedWordPos = exercise.wordPositions.find(wp => {
      const wordCells = getWordCells(wp);
      if (wordCells.length !== selectedCells.length) return false;

      // Check if selected cells match word position (in order or reverse)
      const forwardMatch = wordCells.every((cell, i) =>
        cell.row === selectedCells[i].row && cell.col === selectedCells[i].col
      );

      const reverseCells = [...selectedCells].reverse();
      const reverseMatch = wordCells.every((cell, i) =>
        cell.row === reverseCells[i].row && cell.col === reverseCells[i].col
      );

      return forwardMatch || reverseMatch;
    });

    if (matchedWordPos && !foundWords.has(matchedWordPos.word.toUpperCase())) {
      const newFoundWords = new Set(foundWords);
      newFoundWords.add(matchedWordPos.word.toUpperCase());
      setFoundWords(newFoundWords);

      // Add cells to found cells
      const newFoundCells = new Set(foundCells);
      selectedCells.forEach(cell => newFoundCells.add(getCellKey(cell.row, cell.col)));
      setFoundCells(newFoundCells);

      // Update answers
      const newAnswers = new Map(answers);
      newAnswers.set("foundWords", Array.from(newFoundWords).join(","));
      onAnswer(newAnswers);
    }

    // Reset selection
    setSelectedCells([]);
    setIsSelecting(false);
  }, [getSelectedWord, exercise.wordPositions, selectedCells, foundWords, foundCells, answers, onAnswer]);

  const handleMouseUp = () => {
    if (isSelecting && selectedCells.length >= 2) {
      checkWord();
    } else {
      setSelectedCells([]);
      setIsSelecting(false);
    }
  };

  // Handle touch events for mobile
  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const allWordsFound = foundWords.size === exercise.words.length;

  return (
    <div className="space-y-6">
      {/* Words to find */}
      <div className="bg-white rounded-2xl p-6 border-4 border-gray-200">
        <h3 className="text-xl font-bold uppercase mb-4 text-center">
          PALABRAS A ENCONTRAR
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {exercise.words.map((word) => {
            const isFound = foundWords.has(word.toUpperCase());
            return (
              <motion.div
                key={word}
                initial={{ scale: 1 }}
                animate={isFound ? { scale: [1, 1.2, 1] } : {}}
                className={`
                  px-4 py-2 rounded-xl text-xl font-bold uppercase
                  ${isFound
                    ? "bg-green-100 text-green-800 line-through"
                    : "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                  }
                `}
              >
                {word}
                {isFound && " ✓"}
              </motion.div>
            );
          })}
        </div>
        <div className="mt-4 text-center text-lg">
          <span className="font-bold">{foundWords.size}</span> de{" "}
          <span className="font-bold">{exercise.words.length}</span> encontradas
        </div>
      </div>

      {/* Letter Grid */}
      <div
        ref={gridRef}
        className="bg-white rounded-2xl p-4 border-4 border-gray-200 overflow-x-auto"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="grid gap-1 mx-auto select-none"
          style={{
            gridTemplateColumns: `repeat(${exercise.gridSize}, minmax(0, 1fr))`,
            maxWidth: `${exercise.gridSize * 48}px`,
            touchAction: "none" // Prevent browser scroll during touch selection
          }}
        >
          {exercise.grid.map((row, rowIndex) => (
            row.map((letter, colIndex) => {
              const isSelected = isCellSelected(rowIndex, colIndex);
              const isFound = isCellFound(rowIndex, colIndex);

              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  ref={(el) => {
                    if (el) {
                      cellRefs.current.set(`${rowIndex}-${colIndex}`, el);
                    }
                  }}
                  onMouseDown={() => handleCellClick(rowIndex, colIndex)}
                  onMouseEnter={() => handleCellEnter(rowIndex, colIndex)}
                  onTouchStart={() => handleCellClick(rowIndex, colIndex)}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    backgroundColor: isFound
                      ? "#86efac"
                      : isSelected
                        ? "#fde047"
                        : "#f3f4f6"
                  }}
                  transition={{ delay: (rowIndex * exercise.gridSize + colIndex) * 0.005 }}
                  className={`
                    w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
                    text-xl md:text-2xl font-bold uppercase rounded-lg
                    cursor-pointer select-none
                    border-2 transition-colors
                    ${isFound
                      ? "border-green-400 text-green-800"
                      : isSelected
                        ? "border-yellow-400 text-yellow-800"
                        : "border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                    }
                  `}
                >
                  {letter}
                </motion.div>
              );
            })
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-200 text-center">
        <p className="text-lg">
          {allWordsFound
            ? "🎉 ¡Has encontrado todas las palabras!"
            : "Arrastra el dedo o ratón sobre las letras para marcar una palabra"
          }
        </p>
      </div>

      {/* Success Animation */}
      {allWordsFound && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-100 rounded-2xl p-6 border-4 border-green-400 text-center"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-2xl font-bold text-green-800 uppercase">
            ¡EXCELENTE!
          </h3>
          <p className="text-lg text-green-700">
            Has encontrado todas las palabras
          </p>
        </motion.div>
      )}
    </div>
  );
}
