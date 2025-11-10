"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface MedalAnimationProps {
  show: boolean;
  setTitle: string;
  onComplete: () => void;
}

export function MedalAnimation({ show, setTitle, onComplete }: MedalAnimationProps) {
  useEffect(() => {
    if (show) {
      // Auto-hide after animation
      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none"
        >
          {/* Dark backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Medal container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: [0, 1.5, 1.2],
                rotate: [0, 360, 720]
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 1.5,
                ease: "easeOut"
              }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute -inset-20 bg-gradient-radial from-yellow-400/50 via-orange-400/30 to-transparent rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />

              {/* Medal */}
              <div className="relative">
                {/* Outer ring */}
                <motion.div
                  className="w-64 h-64 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 shadow-2xl flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(251, 191, 36, 0.5)",
                      "0 0 60px rgba(251, 191, 36, 0.8)",
                      "0 0 20px rgba(251, 191, 36, 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  {/* Inner circle */}
                  <div className="w-56 h-56 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center">
                    {/* Star */}
                    <motion.div
                      className="text-9xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity
                      }}
                    >
                      {"⭐"}
                    </motion.div>
                  </div>
                </motion.div>

                {/* Ribbon */}
                <motion.div
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="relative">
                    <div className="w-48 h-16 bg-red-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl uppercase">MEDALLA D&apos;OR</span>
                    </div>
                    {/* Ribbon tails */}
                    <div className="absolute top-full left-0 w-0 h-0 border-l-[24px] border-l-transparent border-t-[16px] border-t-red-700 border-r-[24px] border-r-red-700"></div>
                    <div className="absolute top-full right-0 w-0 h-0 border-r-[24px] border-r-transparent border-t-[16px] border-t-red-700 border-l-[24px] border-l-red-700"></div>
                  </div>
                </motion.div>
              </div>

              {/* Sparkles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  style={{
                    top: "50%",
                    left: "50%"
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 1
                  }}
                  animate={{
                    x: Math.cos((i * Math.PI) / 4) * 200,
                    y: Math.sin((i * Math.PI) / 4) * 200,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.3 + i * 0.1,
                    ease: "easeOut"
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </motion.div>

            {/* Congratulations text */}
            <motion.div
              className="absolute bottom-24 text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.h2
                className="text-6xl font-bold text-white mb-4 uppercase drop-shadow-2xl"
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              >
                ENHORABONA!
              </motion.h2>
              <p className="text-3xl text-white uppercase">
                HAS COMPLETAT: {setTitle}
              </p>
            </motion.div>

            {/* Confetti */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                className="absolute text-4xl"
                style={{
                  top: "-10%",
                  left: `${Math.random() * 100}%`
                }}
                initial={{
                  y: 0,
                  rotate: 0,
                  opacity: 1
                }}
                animate={{
                  y: window.innerHeight * 1.2,
                  rotate: Math.random() * 720 - 360,
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: "linear"
                }}
              >
                {["🎊", "🎉", "🎈", "⭐", "✨"][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}