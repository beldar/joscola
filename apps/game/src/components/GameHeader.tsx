"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { useEffect, useState } from "react";

interface GameHeaderProps {
  onBack?: () => void;
  showBackButton?: boolean;
}

export function GameHeader({ onBack, showBackButton = true }: GameHeaderProps) {
  const { user, coins, medals, coinsToAnimate, setCoinsToAnimate } = useGameStore();
  const [animatingCoins, setAnimatingCoins] = useState<number[]>([]);

  useEffect(() => {
    if (coinsToAnimate > 0) {
      // Create an array of coin animations
      const newCoins = Array.from({ length: coinsToAnimate }, (_, i) => Date.now() + i);
      setAnimatingCoins(prev => [...prev, ...newCoins]);

      // Clear the coins to animate
      setCoinsToAnimate(0);

      // Remove coins after animation completes
      setTimeout(() => {
        setAnimatingCoins(prev => prev.filter(id => !newCoins.includes(id)));
      }, 2000);
    }
  }, [coinsToAnimate, setCoinsToAnimate]);

  if (!user) return null;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 shadow-2xl"
    >
      <div className="relative">
        {/* Decorative border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>

        <div className="px-4 py-2">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            {/* Left Section - Back Button */}
            <div className="flex-1">
              {showBackButton && onBack && (
                <motion.button
                  onClick={onBack}
                  className="group flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 hover:bg-white/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-white"
                    animate={{ x: [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                  <span className="text-white font-bold text-lg uppercase">TORNAR</span>
                </motion.button>
              )}
            </div>

            {/* Center Section - User Info */}
            <motion.div
              className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-full px-5 py-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center text-2xl shadow-lg">
                👤
              </div>
              <div className="text-white">
                <p className="font-bold text-lg uppercase tracking-wide">{user.name}</p>
                <p className="text-xs opacity-90 uppercase">Nivell 1</p>
              </div>
            </motion.div>

            {/* Right Section - Stats */}
            <div className="flex-1 flex justify-end gap-4">
              {/* Coins Display */}
              <motion.div
                className="relative flex items-center gap-2 bg-yellow-400/20 backdrop-blur-md rounded-xl px-4 py-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className="text-3xl"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  🪙
                </motion.div>
                <motion.span
                  key={coins}
                  className="text-white font-bold text-2xl"
                  initial={{ scale: 1.5, color: "#FBBF24" }}
                  animate={{ scale: 1, color: "#FFFFFF" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {coins}
                </motion.span>

                {/* Coin Animation Container */}
                <AnimatePresence>
                  {animatingCoins.map((coinId, index) => (
                    <motion.div
                      key={coinId}
                      className="absolute text-4xl"
                      initial={{
                        x: -200,
                        y: 100,
                        scale: 0.5,
                        rotate: 0
                      }}
                      animate={{
                        x: 0,
                        y: 0,
                        scale: [0.5, 1.2, 1],
                        rotate: 720
                      }}
                      exit={{
                        scale: 0,
                        opacity: 0
                      }}
                      transition={{
                        duration: 1.5,
                        delay: index * 0.1,
                        ease: "easeInOut"
                      }}
                    >
                      ✨🪙
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Medals Display */}
              <motion.div
                className="flex items-center gap-2 bg-orange-400/20 backdrop-blur-md rounded-xl px-4 py-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className="text-3xl"
                  animate={{
                    rotate: [0, -5, 5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 4
                  }}
                >
                  🏅
                </motion.div>
                <span className="text-white font-bold text-2xl">{medals.length}</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Animated bottom decoration */}
        <motion.div
          className="absolute -bottom-2 left-0 right-0 h-2 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
            animate={{
              x: ["-100%", "100%"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ width: "50%" }}
          />
        </motion.div>
      </div>
    </motion.header>
  );
}