"use client";

import type { RubikInfoExercise as RubikInfoExerciseType } from "@/lib/exercises/types";
import { RubikCube } from "./RubikCube";

interface Props {
  exercise: RubikInfoExerciseType;
  answers: Map<string, string | number>;
  onAnswer: (answers: Map<string, string | number>) => void;
}

export function RubikInfoExercise({ exercise, answers, onAnswer }: Props) {
  return (
    <div className="flex flex-col items-center gap-8">
      {exercise.blocks.map((block, i) => (
        <div key={i} className="flex flex-col md:flex-row items-center gap-6 w-full max-w-2xl">
          {block.move && (
            <div className="flex flex-col items-center gap-2 shrink-0">
              <RubikCube move={block.move} showArrow size={200} />
              <span className="text-3xl font-bold text-gray-700 tracking-widest">{block.move}</span>
            </div>
          )}
          <p className="text-xl text-gray-700 leading-relaxed whitespace-pre-line text-left">
            {block.text}
          </p>
        </div>
      ))}
    </div>
  );
}
