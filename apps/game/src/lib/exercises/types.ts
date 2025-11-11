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
  | "estimation";

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
  | EstimationExercise;

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
