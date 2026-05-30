"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type {
  RubikSolverNode,
  RubikSolverOption,
  RubikSolverPathExercise as RubikSolverPathExerciseType,
} from "@/lib/exercises/types";

interface Props {
  exercise: RubikSolverPathExerciseType;
  answers: Map<string, string | number>;
  onAnswer: (answers: Map<string, string | number>) => void;
}

const readHistory = (answers: Map<string, string | number>, startNodeId: string) => {
  const raw = answers.get("path");
  if (typeof raw !== "string" || raw.length === 0) return [startNodeId];
  return raw.split(">").filter(Boolean);
};

export function RubikSolverPathExercise({ exercise, answers, onAnswer }: Props) {
  const nodesById = new Map(exercise.nodes.map((node) => [node.id, node]));
  const currentNodeId = (answers.get("node") as string | undefined) ?? exercise.startNodeId;
  const currentNode = nodesById.get(currentNodeId) ?? nodesById.get(exercise.startNodeId);
  const history = readHistory(answers, exercise.startNodeId);

  if (!currentNode) return null;

  const writeNode = (node: RubikSolverNode, nextHistory: string[], option?: RubikSolverOption) => {
    const nextAnswers = new Map(answers);
    nextAnswers.set("node", node.id);
    nextAnswers.set("path", nextHistory.join(">"));

    if (node.complete || option?.complete) {
      nextAnswers.set("solved", 1);
    } else {
      nextAnswers.delete("solved");
    }

    onAnswer(nextAnswers);
  };

  const chooseOption = (option: RubikSolverOption) => {
    const nextNode = nodesById.get(option.nextNodeId);
    if (!nextNode) return;
    writeNode(nextNode, [...history, nextNode.id], option);
  };

  const goBack = () => {
    if (history.length <= 1) return;
    const nextHistory = history.slice(0, -1);
    const previousNode = nodesById.get(nextHistory[nextHistory.length - 1]);
    if (!previousNode) return;
    writeNode(previousNode, nextHistory);
  };

  const restart = () => {
    const startNode = nodesById.get(exercise.startNodeId);
    if (!startNode) return;
    const nextAnswers = new Map<string, string | number>();
    nextAnswers.set("node", startNode.id);
    nextAnswers.set("path", startNode.id);
    onAnswer(nextAnswers);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border-4 border-slate-900 bg-slate-950 p-4 text-white shadow-xl md:flex-row md:items-center">
        {currentNode.image && (
          <div className="relative flex min-h-48 items-center justify-center rounded-xl bg-white p-3 md:w-1/3">
            <Image
              src={currentNode.image}
              alt={currentNode.imageAlt ?? currentNode.title}
              fill
              sizes="(min-width: 768px) 33vw, 90vw"
              className="object-contain p-3"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-3">
          <span className="w-fit rounded-md bg-yellow-300 px-3 py-1 text-sm font-black uppercase tracking-wide text-slate-950">
            {currentNode.phase}
          </span>
          <h3 className="text-3xl font-black uppercase leading-tight text-white md:text-4xl">
            {currentNode.title}
          </h3>
          {currentNode.text && (
            <p className="max-w-2xl text-xl font-bold leading-snug text-slate-100 md:text-2xl">
              {currentNode.text}
            </p>
          )}
        </div>
      </div>

      {currentNode.options && currentNode.options.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {currentNode.options.map((option, index) => (
            <motion.button
              key={`${currentNode.id}-${option.label}`}
              type="button"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => chooseOption(option)}
              className="flex min-h-56 flex-col justify-between overflow-hidden rounded-2xl border-4 border-slate-200 bg-white text-left shadow-lg transition hover:-translate-y-1 hover:border-yellow-400 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300"
            >
              {option.image ? (
                <div className="relative flex h-44 w-full items-center justify-center bg-slate-50 p-3">
                  <Image
                    src={option.image}
                    alt={option.imageAlt ?? option.label}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 45vw, 90vw"
                    className="object-contain p-3"
                  />
                </div>
              ) : (
                <div className="flex h-44 w-full items-center justify-center bg-yellow-100 text-6xl font-black text-slate-900">
                  ✓
                </div>
              )}

              <div className="flex min-h-28 flex-col justify-center gap-1 p-4">
                <span className="text-2xl font-black uppercase leading-tight text-slate-900">
                  {option.label}
                </span>
                {option.hint && (
                  <span className="text-lg font-bold leading-tight text-slate-600">
                    {option.hint}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-green-100 p-6 text-center text-3xl font-black uppercase text-green-800">
          Ja pots acabar.
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={history.length <= 1}
          className="rounded-xl bg-slate-100 px-5 py-3 text-lg font-black uppercase text-slate-700 transition hover:bg-slate-200 disabled:opacity-30"
        >
          ← Enrere
        </button>
        <button
          type="button"
          onClick={restart}
          className="rounded-xl bg-slate-100 px-5 py-3 text-lg font-black uppercase text-slate-700 transition hover:bg-slate-200"
        >
          Començar de nou
        </button>
      </div>
    </div>
  );
}
