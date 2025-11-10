"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button, Card } from "@joscola/ui";
import { useGameStore } from "@/lib/store";

export function Onboarding() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const setUser = useGameStore((state) => state.setUser);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && age) {
      setUser({ name: name.trim(), age: parseInt(age) });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1
              }}
              className="mb-4"
            >
              <Image
                src="/joscola-icon.png"
                alt="Joscola Logo"
                width={120}
                height={120}
                className="mx-auto rounded-3xl shadow-lg"
                priority
              />
            </motion.div>
            <h1 className="text-6xl font-bold text-blue-600 mb-4">
              JOSCOLA
            </h1>
            <p className="text-2xl text-gray-700">
              APRENEM JUGANT!
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-xl font-bold text-gray-800 mb-2 uppercase"
              >
                COM ET DIUS?
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 text-2xl font-bold uppercase border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500"
                placeholder="EL TEU NOM"
                required
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="age"
                className="block text-xl font-bold text-gray-800 mb-2 uppercase"
              >
                QUANTS ANYS TENS?
              </label>
              <input
                id="age"
                type="number"
                min="3"
                max="12"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-6 py-4 text-2xl font-bold border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500"
                placeholder="7"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-2xl py-6 uppercase"
              disabled={!name.trim() || !age}
            >
              COMENÇAR! 🚀
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
