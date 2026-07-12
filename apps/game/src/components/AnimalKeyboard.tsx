"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAnimalForLetter, type AnimalEntry } from "@/lib/animals";
import { useGameStore } from "@/lib/store";
import { GameHeader } from "./GameHeader";
import { ProfilePage } from "./ProfilePage";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

function formatWithArticle(animal: AnimalEntry) {
  return animal.article === "L'" ? `${animal.article}${animal.name}` : `${animal.article} ${animal.name}`;
}

function getCatalanVoice(synth: SpeechSynthesis) {
  return synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("ca"));
}

function speak(synth: SpeechSynthesis, text: string, opts: { rate: number; pitch: number }, onEnd?: () => void) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ca-ES";
  utterance.rate = opts.rate;
  utterance.pitch = opts.pitch;

  const catalanVoice = getCatalanVoice(synth);
  if (catalanVoice) utterance.voice = catalanVoice;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  synth.speak(utterance);
}

// Un identificador incremental per descartar utterances "fantasma": alguns
// motors de veu no cancel·len l'anterior a l'instant (speechSynthesis.cancel()
// no és fiable en tots els navegadors), així que si l'usuari ja ha premut
// una altra lletra quan l'anterior acaba de parlar, no reproduïm el so vell.
let latestRequestId = 0;

// Diu primer el nom de l'animal (sense article, per evitar que el TTS
// pronunciï malament l'elisió "L'") i, quan acaba, diu l'onomatopeia del so.
function playAnimalIntro(animal: AnimalEntry) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const synth = window.speechSynthesis;
  const requestId = ++latestRequestId;

  synth.cancel();

  speak(synth, animal.name, { rate: 0.9, pitch: 1.15 }, () => {
    if (requestId !== latestRequestId) return;
    speak(synth, animal.sound, { rate: 0.8, pitch: 1.3 });
  });
}

export function AnimalKeyboard() {
  const [currentAnimal, setCurrentAnimal] = useState<AnimalEntry | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  const handleLetterPress = useCallback((letter: string) => {
    const animal = getAnimalForLetter(letter);
    if (!animal) return;
    setCurrentAnimal(animal);
    playAnimalIntro(animal);
  }, []);

  useEffect(() => {
    // Warm up the speech synthesis voice list (loads async in some browsers)
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (/^[a-zA-Z]$/.test(event.key)) {
        handleLetterPress(event.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleLetterPress]);

  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} />;
  }

  return (
    <>
      <GameHeader
        showBackButton
        onBack={() => useGameStore.getState().setSubject(null)}
        onProfileClick={() => setShowProfile(true)}
      />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-blue-50 pt-32 pb-8 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 uppercase">
              🐾 TECLAT DELS ANIMALS
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 uppercase">
              PREM UNA LLETRA I DESCOBREIX UN ANIMAL!
            </p>
          </motion.div>

          {/* Animal display area */}
          <div className="flex justify-center mb-10 min-h-[280px] items-center">
            <AnimatePresence mode="wait">
              {currentAnimal ? (
                <motion.div
                  key={currentAnimal.letter + Date.now()}
                  initial={{ opacity: 0, scale: 0.4, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ type: "spring", stiffness: 220, damping: 15 }}
                  className="bg-white rounded-3xl shadow-2xl border-4 border-emerald-300 p-8 text-center"
                >
                  <motion.div
                    className="text-9xl mb-4"
                    animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1 }}
                  >
                    {currentAnimal.emoji}
                  </motion.div>
                  <h2 className="text-4xl font-bold text-gray-800 uppercase">
                    {formatWithArticle(currentAnimal)}
                  </h2>
                  <p className="text-2xl text-emerald-600 font-semibold mt-2">
                    &ldquo;{currentAnimal.sound}&rdquo;
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => playAnimalIntro(currentAnimal)}
                    className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xl uppercase rounded-xl px-6 py-3 shadow-lg"
                  >
                    🔊 Torna a escoltar
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-400 text-2xl uppercase"
                >
                  <div className="text-8xl mb-4">🔤</div>
                  Prem una lletra del teclat!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Virtual keyboard */}
          <div className="space-y-3">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-2 md:gap-3">
                {row.map((letter) => {
                  const isActive = currentAnimal?.letter === letter;
                  return (
                    <motion.button
                      key={letter}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLetterPress(letter)}
                      className={`w-9 h-12 md:w-14 md:h-16 rounded-xl shadow-md border-2 font-bold text-lg md:text-2xl uppercase transition-colors ${
                        isActive
                          ? "bg-emerald-500 border-emerald-600 text-white"
                          : "bg-white border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50"
                      }`}
                    >
                      {letter}
                    </motion.button>
                  );
                })}
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 mt-8 uppercase text-sm">
            També pots escriure amb el teclat de l&apos;ordinador o la tauleta
          </p>
        </div>
      </div>
    </>
  );
}
