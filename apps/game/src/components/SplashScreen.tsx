"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (onComplete) {
        setTimeout(onComplete, 500); // Wait for fade out animation
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{ pointerEvents: isLoading ? 'auto' : 'none' }}
    >
      <div className="text-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1
          }}
          className="mb-8"
        >
          <Image
            src="/joscola-icon.png"
            alt="Joscola"
            width={180}
            height={180}
            className="mx-auto rounded-3xl shadow-2xl"
            priority
          />
        </motion.div>

        {/* App Name */}
        <motion.h1
          className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          JOSCOLA
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-3xl text-gray-600 mb-8 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Aprenem Jugant!
        </motion.p>

        {/* Loading Indicator */}
        <motion.div
          className="flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-4 h-4 bg-blue-500 rounded-full"
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.1,
              }}
            />
          ))}
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className="mt-4 text-xl text-gray-500 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          Carregant...
        </motion.p>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-10 left-10 text-6xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        ⭐
      </motion.div>

      <motion.div
        className="absolute top-20 right-20 text-5xl"
        animate={{
          rotate: [0, -360],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        🎓
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-20 text-5xl"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🚀
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-10 text-6xl"
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🏆
      </motion.div>
    </motion.div>
  );
}