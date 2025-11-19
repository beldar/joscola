"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import type { CalligraphyExercise as CalligraphyExerciseType } from "@/lib/exercises/types";

interface Props {
  exercise: CalligraphyExerciseType;
  onAnswer: (answers: Map<string, number>) => void;
  answers: Map<string, number>;
}

interface Point {
  x: number;
  y: number;
}

interface BoxCanvasProps {
  boxIndex: number;
  exerciseId: string;
  letter: string;
  showModel: boolean;
  showGuidelines: boolean;
  onDrawingComplete: (boxIndex: number, paths: Point[][]) => void;
  onDrawingCleared: (boxIndex: number) => void;
}

// Storage key for canvas drawings
const getDrawingStorageKey = (exerciseId: string, boxIndex: number) => {
  return `calligraphy-drawing-${exerciseId}-box-${boxIndex}`;
};

function BoxCanvas({ boxIndex, exerciseId, letter, showModel, showGuidelines, onDrawingComplete, onDrawingCleared }: BoxCanvasProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState<Point[][]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [hasContent, setHasContent] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathsRef = useRef<Point[][]>([]); // Keep a ref to always have latest paths

  // Load saved paths from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = getDrawingStorageKey(exerciseId, boxIndex);
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const savedPaths = JSON.parse(saved) as Point[][];
        if (savedPaths && savedPaths.length > 0) {
          setPaths(savedPaths);
          pathsRef.current = savedPaths;
          setHasContent(true);
        }
      } catch (e) {
        console.error("Failed to load saved drawing:", e);
      }
    }
    setIsLoaded(true);
  }, [exerciseId, boxIndex]);

  // Keep pathsRef in sync with paths
  useEffect(() => {
    pathsRef.current = paths;
  }, [paths]);

  // Redraw canvas function
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all saved paths using ref (more stable during re-renders)
    pathsRef.current.forEach((path) => {
      if (path.length > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "#059669"; // green-600
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
      }
    });

    // Draw current path
    if (currentPath.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = "#059669";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
    }
  }, [currentPath]);

  // Initialize canvas - only after paths are loaded
  useEffect(() => {
    if (!isLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const newWidth = Math.round(rect.width);
      const newHeight = Math.round(rect.height);

      // Only update if size actually changed (prevents scroll-triggered redraws)
      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
        redrawCanvas();
      }
    };

    updateSize();

    // Use ResizeObserver instead of window resize for better performance
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isLoaded, redrawCanvas]);

  // Redraw when paths change (but only after loaded)
  useEffect(() => {
    if (!isLoaded) return;
    redrawCanvas();
  }, [paths, currentPath, isLoaded, redrawCanvas]);

  const getPointerPosition = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDrawing(true);
    const point = getPointerPosition(e);
    setCurrentPath([point]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    e.stopPropagation();

    const point = getPointerPosition(e);
    setCurrentPath((prev) => [...prev, point]);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    e.stopPropagation();

    setIsDrawing(false);

    // Save the current path
    if (currentPath.length > 0) {
      const newPaths = [...paths, currentPath];
      setPaths(newPaths);

      // Save to localStorage
      if (typeof window !== "undefined") {
        const storageKey = getDrawingStorageKey(exerciseId, boxIndex);
        localStorage.setItem(storageKey, JSON.stringify(newPaths));
      }

      // Mark as having content
      if (!hasContent) {
        setHasContent(true);
        onDrawingComplete(boxIndex, newPaths);
      }

      setCurrentPath([]);
    }
  };

  const handleClear = () => {
    setPaths([]);
    setCurrentPath([]);
    setHasContent(false);

    // Clear from localStorage
    if (typeof window !== "undefined") {
      const storageKey = getDrawingStorageKey(exerciseId, boxIndex);
      localStorage.removeItem(storageKey);
    }

    onDrawingCleared(boxIndex);
  };

  return (
    <div className="relative bg-amber-50 border-2 border-gray-400 rounded-lg overflow-hidden group">
      {/* Guidelines - Letter should be drawn BETWEEN the two solid lines */}
      {showGuidelines && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Top solid line - letter starts here */}
          <div className="absolute top-[30%] left-0 right-0 h-[2px] bg-gray-400" />
          {/* Bottom solid line - letter ends here */}
          <div className="absolute top-[70%] left-0 right-0 h-[2px] bg-gray-400" />
          {/* Optional dashed baseline in the middle for reference */}
          <div className="absolute top-[50%] left-0 right-0 h-[1px] border-t border-dashed border-gray-300" />
        </div>
      )}

      {/* Model letter - show in first LINE (first 6 boxes) for tracing */}
      {showModel && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
          <div className="text-[80px] font-bold text-gray-600 font-massallera">
            {letter}
          </div>
        </div>
      )}

      {/* Starting dot - show in ALL boxes when empty */}
      {paths.length === 0 && (
        <div
          className="absolute w-3 h-3 bg-red-500 rounded-full animate-pulse pointer-events-none shadow-lg"
          style={{
            top: '50%',
            left: '15%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}

      {/* Completion checkmark */}
      {hasContent && (
        <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md">
          ✓
        </div>
      )}

      {/* Clear button (shows on hover) */}
      {hasContent && (
        <button
          onClick={handleClear}
          className="absolute bottom-1 right-1 bg-red-500/80 text-white rounded px-2 py-0.5 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      )}

      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-32 cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}

export function CalligraphyExercise({ exercise, onAnswer, answers }: Props) {
  const [completedBoxes, setCompletedBoxes] = useState<Set<number>>(new Set());

  // Initialize from saved answers AND check localStorage for actual drawings
  useEffect(() => {
    if (typeof window === "undefined") return;

    const completed = new Set<number>();

    // Check each box for saved drawings in localStorage
    for (let i = 0; i < exercise.practiceBoxes; i++) {
      const storageKey = getDrawingStorageKey(exercise.id, i);
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        try {
          const savedPaths = JSON.parse(saved) as Point[][];
          if (savedPaths && savedPaths.length > 0) {
            completed.add(i);
          }
        } catch (e) {
          console.error("Failed to check saved drawing:", e);
        }
      }
    }

    setCompletedBoxes(completed);

    // Sync answers map with actual drawings
    if (completed.size > 0) {
      const newAnswers = new Map();
      completed.forEach((boxIndex) => {
        newAnswers.set(`box-${boxIndex}`, 1);
      });

      onAnswer(newAnswers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id, exercise.practiceBoxes]);

  const handleDrawingComplete = useCallback((boxIndex: number, paths: Point[][]) => {
    if (!completedBoxes.has(boxIndex) && paths.length > 0) {
      const newCompleted = new Set(completedBoxes);
      newCompleted.add(boxIndex);
      setCompletedBoxes(newCompleted);

      // Update answers
      const newAnswers = new Map(answers);
      newAnswers.set(`box-${boxIndex}`, 1);
      onAnswer(newAnswers);
    }
  }, [completedBoxes, answers, onAnswer]);

  const handleDrawingCleared = useCallback((boxIndex: number) => {
    const newCompleted = new Set(completedBoxes);
    newCompleted.delete(boxIndex);
    setCompletedBoxes(newCompleted);

    // Update answers
    const newAnswers = new Map(answers);
    newAnswers.delete(`box-${boxIndex}`);
    onAnswer(newAnswers);
  }, [completedBoxes, answers, onAnswer]);

  const totalBoxes = exercise.practiceBoxes;
  const completionPercentage = Math.round((completedBoxes.size / totalBoxes) * 100);
  const isFullyCompleted = completedBoxes.size === totalBoxes;

  return (
    <div className="space-y-6">
      {/* Header with Letter - Like the paper worksheet */}
      <div className="bg-white rounded-2xl p-6 border-4 border-gray-300 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Pencil icon like in the image */}
            <div className="text-6xl">✏️</div>

            {/* Main header */}
            <div>
              <div className="text-4xl md:text-5xl font-black text-gray-800 uppercase tracking-wide">
                FITXA DE LA <span className="text-6xl text-green-600">{exercise.letterDisplay}</span>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="text-right">
            <div className="text-lg uppercase text-gray-600 font-bold">Progrés</div>
            <div className="text-3xl font-bold text-green-600">
              {completedBoxes.size} / {totalBoxes}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
          <motion.div
            className="bg-green-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Model letter - Large display at top */}
      {exercise.showModel && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-3 border-green-300">
          <div className="text-center">
            <div className="text-sm uppercase font-bold text-gray-600 mb-2">Model de lletra:</div>
            <div className="text-[120px] font-bold text-green-600 font-massallera" style={{ lineHeight: '1' }}>
              {exercise.letter}
            </div>
          </div>
        </div>
      )}

      {/* Practice boxes - Paper-like worksheet layout */}
      <div className="bg-white rounded-2xl p-8 border-4 border-gray-300 shadow-lg">
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: totalBoxes }).map((_, index) => (
            <BoxCanvas
              key={index}
              boxIndex={index}
              exerciseId={exercise.id}
              letter={exercise.letter}
              showModel={exercise.showModel && index < 6}
              showGuidelines={exercise.showGuidelines}
              onDrawingComplete={handleDrawingComplete}
              onDrawingCleared={handleDrawingCleared}
            />
          ))}
        </div>
      </div>

      {/* Completion Message */}
      {isFullyCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-8 border-4 border-green-600 text-center text-white shadow-2xl"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-4xl font-bold uppercase mb-2">Excel·lent!</h3>
          <p className="text-2xl">
            Has completat tots els quadres de la lletra <span className="font-bold text-5xl">{exercise.letter}</span>!
          </p>
          <div className="mt-6 text-xl bg-white/20 rounded-xl p-4 inline-block font-bold">
            MOTRICITAT FINA ✅
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      {completedBoxes.size === 0 && (
        <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
          <h3 className="text-xl font-bold uppercase mb-3">📝 Com fer-ho:</h3>
          <ul className="space-y-2 text-lg">
            <li>• <span className="font-bold">Primera línia:</span> Repassa la lletra <span className="font-bold text-2xl">{exercise.letter}</span> seguint l&apos;ombra marcada</li>
            <li>• <span className="font-bold">Altres línies:</span> Practica escrivint la lletra tu sol/a</li>
            <li>• Comença sempre des del punt vermell 🔴</li>
            <li>• Segueix les línies de guia (les dues línies sòlides)</li>
            <li>• Passa el ratolí per sobre d&apos;un quadre per veure el botó d&apos;esborrar</li>
            <li>• Els teus dibuixos es guarden automàticament!</li>
          </ul>
        </div>
      )}
    </div>
  );
}
