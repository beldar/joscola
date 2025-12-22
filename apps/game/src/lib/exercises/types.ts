export type ExerciseType =
  | "number-sequence"
  | "counting"
  | "addition-three"
  | "subtraction-jumps"
  | "addition-jumps"
  | "grid-100"
  | "number-search"
  | "number-order"
  | "train-position"
  | "number-pattern"
  | "magic-square"
  | "number-line"
  | "estimation"
  | "reading-speed"
  | "calligraphy"
  | "word-search"
  | "pictogram-crossword";

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  title: string;
  instructions: string;
}

export interface NumberSequenceExercise extends BaseExercise {
  type: "number-sequence";
  start: number;
  direction: "forward" | "backward";
  step: number;
  length: number;
  missingIndices: number[];
}

export interface CountingExercise extends BaseExercise {
  type: "counting";
  items: string; // emoji or description
  count: number;
  imageType: "grid" | "scattered" | "groups";
}

export interface AdditionThreeExercise extends BaseExercise {
  type: "addition-three";
  numbers: [number, number, number];
  showVisual?: boolean;
}

export interface SubtractionJumpsExercise extends BaseExercise {
  type: "subtraction-jumps";
  start: number;
  subtract: number;
  steps: number[];
}

export interface AdditionJumpsExercise extends BaseExercise {
  type: "addition-jumps";
  start: number;
  add: number;
  steps: number[];
}

export interface Grid100Exercise extends BaseExercise {
  type: "grid-100";
  missingNumbers: number[];
  maxNumber?: number;
}

export interface NumberSearchExercise extends BaseExercise {
  type: "number-search";
  patterns: Array<{
    given: number[];
    missing: number[];
  }>;
}

export interface MagicSquareExercise extends BaseExercise {
  type: "magic-square";
  size: 2 | 3;
  targetSum: number;
  given: Array<{ row: number; col: number; value: number }>;
  validateRow?: number; // Which row to validate (for 3x3 with center cloud)
  validateColumn?: number; // Which column to validate (for 3x3 with center cloud)
}

export interface NumberLineExercise extends BaseExercise {
  type: "number-line";
  min: number;
  max: number;
  numbersToPlace: number[];
}

export interface NumberOrderExercise extends BaseExercise {
  type: "number-order";
  numbers: number[];
  question: "smallest" | "largest" | "order-asc" | "order-desc";
}

export interface TrainPositionExercise extends BaseExercise {
  type: "train-position";
  trainLength: number;
  signPositions: number[]; // positions where signs should be placed
  missingPositions: number[]; // which signs are missing
  mode?: "fill-signs" | "place-signs" | "tunnel-fill";
  availableSigns?: number[]; // numbers available for placement (place mode)
  tunnels?: Array<{
    start: number; // 1-based start position covered by the tunnel
    length: number; // how many wagons/balls are hidden
    variant?: "stone" | "moss" | "wood";
  }>;
}

export interface NumberPatternExercise extends BaseExercise {
  type: "number-pattern";
  patterns: Array<{
    layout: "cross" | "line" | "square";
    given: Array<{ position: string; value: number }>;
    missing: string[]; // positions to fill
  }>;
}

export interface EstimationExercise extends BaseExercise {
  type: "estimation";
  money: number;
  items: Array<{ name: string; price: number; icon: string }>;
  question: string;
}

export interface ReadingSpeedExercise extends BaseExercise {
  type: "reading-speed";
  phase: number; // 1-9
  words: string[]; // 60 words to read
  timeLimit: number; // in seconds (120 for 2 minutes)
  columns: number; // number of columns to display words in
}

export interface CalligraphyExercise extends BaseExercise {
  type: "calligraphy";
  letter: string; // 'a', 'b', 'c', etc.
  letterDisplay: string; // Display version (uppercase for header)
  letterType: "lowercase" | "uppercase";
  style: "cursive" | "print";
  practiceBoxes: number; // Number of practice boxes (typically 12-18)
  showGuidelines: boolean; // Show dotted lines for writing guides
  showModel: boolean; // Show model letter in first box
}

export interface WordSearchExercise extends BaseExercise {
  type: "word-search";
  gridSize: number; // Size of the grid (e.g., 10 for 10x10)
  words: string[]; // Words to find (4-6 letter Spanish words)
  grid: string[][]; // Pre-generated grid with letters
  wordPositions: Array<{
    word: string;
    startRow: number;
    startCol: number;
    direction: "horizontal" | "vertical" | "diagonal-down" | "diagonal-up";
  }>;
}

export interface PictogramCrosswordExercise extends BaseExercise {
  type: "pictogram-crossword";
  gridSize: { rows: number; cols: number };
  words: Array<{
    word: string;
    emoji: string;
    startRow: number;
    startCol: number;
    direction: "horizontal" | "vertical";
    clueNumber: number;
  }>;
  grid: (string | null)[][]; // null for blocked cells, empty string for fillable cells
}

export type Exercise =
  | NumberSequenceExercise
  | CountingExercise
  | AdditionThreeExercise
  | SubtractionJumpsExercise
  | AdditionJumpsExercise
  | Grid100Exercise
  | NumberSearchExercise
  | NumberOrderExercise
  | TrainPositionExercise
  | NumberPatternExercise
  | MagicSquareExercise
  | NumberLineExercise
  | EstimationExercise
  | ReadingSpeedExercise
  | CalligraphyExercise
  | WordSearchExercise
  | PictogramCrosswordExercise;

export interface ExerciseSet {
  id: string;
  title: string;
  icon: string;
  exercises: Exercise[];
}

export interface ExerciseAnswer {
  exerciseId: string;
  answers: Map<string, string | number>;
}
