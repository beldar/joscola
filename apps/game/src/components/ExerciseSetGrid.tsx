"use client";

import { motion } from "framer-motion";
import { Card } from "@joscola/ui";
import { matematiquesExerciseSets } from "@/lib/exercises/matematiques";
import { catalaExerciseSets } from "@/lib/exercises/catala";
import { castellanoExerciseSets } from "@/lib/exercises/castellano";
import { useGameStore } from "@/lib/store";
import { useState } from "react";
import { ExerciseViewer } from "./ExerciseViewer";
import { GameHeader } from "./GameHeader";
import { ProfilePage } from "./ProfilePage";

interface Props {
  subject?: string;
}

export function ExerciseSetGrid({ subject = "matematiques" }: Props) {
  const { user, progress } = useGameStore();
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  const exerciseSets = subject === "catala"
    ? catalaExerciseSets
    : subject === "castella"
      ? castellanoExerciseSets
      : matematiquesExerciseSets;

  const isSetComplete = (setId: string) => {
    const set = exerciseSets.find((s) => s.id === setId);
    if (!set) return false;

    return set.exercises.every((ex) =>
      progress.some((p) => p.exerciseSetId === setId && p.exerciseId === ex.id && p.completed)
    );
  };

  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} />;
  }

  if (selectedSet) {
    return (
      <ExerciseViewer
        setId={selectedSet}
        subject={subject}
        onBack={() => setSelectedSet(null)}
        onProfileClick={() => setShowProfile(true)}
      />
    );
  }

  return (
    <>
      <GameHeader
        showBackButton={true}
        onBack={() => useGameStore.getState().setSubject(null)}
        onProfileClick={() => setShowProfile(true)}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-32 pb-8 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-gray-800 mb-4 uppercase">
              {subject === "catala" ? "CATALÀ" : subject === "castella" ? "CASTELLANO" : "MATEMÀTIQUES"}
            </h1>
            <p className="text-2xl text-gray-600 uppercase">
              ESCULL UN GRUP D&apos;EXERCICIS
            </p>
          </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {exerciseSets.map((set, index) => {
            const isComplete = isSetComplete(set.id);
            return (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  interactive
                  className="relative cursor-pointer h-full"
                  onClick={() => setSelectedSet(set.id)}
                >
                  {isComplete && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl">
                        ✓
                      </div>
                    </div>
                  )}

                  <div className="p-6 text-center">
                    <div className="text-6xl mb-4">{set.icon}</div>
                    <h2 className="text-xl font-bold text-gray-800 uppercase mb-2">
                      {set.title}
                    </h2>
                    <p className="text-sm text-gray-600 uppercase">
                      {set.exercises.length} EXERCICIS
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
        </div>
      </div>
    </>
  );
}
