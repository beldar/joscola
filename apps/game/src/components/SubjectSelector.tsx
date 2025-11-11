"use client";

import { motion } from "framer-motion";
import { Card } from "@joscola/ui";
import { useGameStore } from "@/lib/store";

const subjects = [
  {
    id: "matematiques",
    name: "MATEMÀTIQUES",
    icon: "🔢",
    color: "from-blue-400 to-blue-600",
  },
  {
    id: "catala",
    name: "CATALÀ",
    icon: "📚",
    color: "from-green-400 to-green-600",
  },
  {
    id: "castella",
    name: "CASTELLÀ",
    icon: "📖",
    color: "from-yellow-400 to-yellow-600",
    disabled: true,
  },
  {
    id: "angles",
    name: "ANGLÈS",
    icon: "🌍",
    color: "from-purple-400 to-purple-600",
    disabled: true,
  },
];

export function SubjectSelector() {
  const { user, setSubject } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            HOLA, {user?.name?.toUpperCase()}! 👋
          </h1>
          <p className="text-2xl text-gray-600 uppercase">
            Què vols practicar avui?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                interactive={!subject.disabled}
                className={`relative overflow-hidden ${
                  subject.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={() => !subject.disabled && setSubject(subject.id)}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-10`}
                />
                <div className="relative p-8 text-center">
                  <div className="text-8xl mb-4">{subject.icon}</div>
                  <h2 className="text-3xl font-bold text-gray-800 uppercase">
                    {subject.name}
                  </h2>
                  {subject.disabled && (
                    <p className="text-lg text-gray-500 mt-4 uppercase">
                      Pròximament
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
