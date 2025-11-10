"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@joscola/ui";
import { useGameStore } from "@/lib/store";
import { GameHeader } from "./GameHeader";

const AVATAR_OPTIONS = [
  "👤", "😀", "😊", "🙂", "😎", "🤓", "🥳", "🤩",
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼",
  "🦁", "🐯", "🐸", "🐵", "🐔", "🐧", "🦉", "🦄",
  "🚀", "⭐", "🌟", "✨", "🎨", "🎭", "🎪", "🎯"
];

interface ProfilePageProps {
  onBack: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const {
    user,
    updateUser,
    clearAllData,
    coins,
    medals,
    getTotalExercisesCompleted,
  } = useGameStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editAge, setEditAge] = useState(user?.age.toString() || "");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  if (!user) {
    return null;
  }

  const handleSaveProfile = () => {
    if (editName.trim() && editAge) {
      updateUser({
        name: editName.trim(),
        age: parseInt(editAge),
      });
      setIsEditing(false);
    }
  };

  const handleSelectAvatar = (avatar: string) => {
    updateUser({ avatar });
    setShowAvatarPicker(false);
  };

  const handleClearData = () => {
    clearAllData();
    // Reload the page to reset the app state
    window.location.reload();
  };

  const formatTime = (seconds: number = 0) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const totalExercises = getTotalExercisesCompleted();

  return (
    <>
      <GameHeader onBack={onBack} showBackButton={true} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-32 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-blue-600 uppercase mb-2">
                EL MEU PERFIL
              </h1>
              <p className="text-xl text-gray-600 uppercase">
                Informació i estadístiques
              </p>
            </div>

            {/* Avatar Section */}
            <div className="flex justify-center mb-8">
              <motion.button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center text-7xl shadow-lg">
                  {user.avatar || '👤'}
                </div>
                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-2xl">✏️</span>
                </div>
              </motion.button>
            </div>

            {/* Avatar Picker */}
            {showAvatarPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl"
              >
                <p className="text-xl font-bold text-gray-800 uppercase mb-4 text-center">
                  Tria el teu avatar
                </p>
                <div className="grid grid-cols-8 gap-3">
                  {AVATAR_OPTIONS.map((avatar) => (
                    <motion.button
                      key={avatar}
                      onClick={() => handleSelectAvatar(avatar)}
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-all ${
                        user.avatar === avatar
                          ? "bg-blue-500 shadow-lg scale-110"
                          : "bg-white hover:bg-blue-100 shadow"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {avatar}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Profile Info Section */}
            <div className="mb-8 p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 uppercase">
                  Informació Personal
                </h2>
                {!isEditing && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setIsEditing(true);
                      setEditName(user.name);
                      setEditAge(user.age.toString());
                    }}
                    className="uppercase"
                  >
                    ✏️ Editar
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-2 uppercase">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-3 text-xl font-bold uppercase border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-2 uppercase">
                      Edat
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="12"
                      value={editAge}
                      onChange={(e) => setEditAge(e.target.value)}
                      className="w-full px-4 py-3 text-xl font-bold border-4 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleSaveProfile}
                      className="flex-1 uppercase"
                    >
                      💾 Guardar
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 uppercase"
                    >
                      ❌ Cancel·lar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👤</span>
                    <div>
                      <p className="text-sm text-gray-600 uppercase">Nom</p>
                      <p className="text-2xl font-bold text-gray-800 uppercase">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎂</span>
                    <div>
                      <p className="text-sm text-gray-600 uppercase">Edat</p>
                      <p className="text-2xl font-bold text-gray-800">{user.age} anys</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Statistics Section */}
            <div className="mb-8 p-6 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-800 uppercase mb-4">
                📊 Estadístiques
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow">
                  <div className="text-4xl mb-2">⏱️</div>
                  <p className="text-sm text-gray-600 uppercase mb-1">Temps jugat</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatTime(user.totalTimeSpent)}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 text-center shadow">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-sm text-gray-600 uppercase mb-1">Exercicis fets</p>
                  <p className="text-3xl font-bold text-green-600">
                    {totalExercises}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 text-center shadow">
                  <div className="text-4xl mb-2">🪙</div>
                  <p className="text-sm text-gray-600 uppercase mb-1">Monedes</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {coins}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 text-center shadow">
                  <div className="text-4xl mb-2">🏅</div>
                  <p className="text-sm text-gray-600 uppercase mb-1">Medalles</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {medals.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-6 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl border-4 border-red-300">
              <h2 className="text-2xl font-bold text-red-700 uppercase mb-2">
                ⚠️ Zona de perill
              </h2>
              <p className="text-gray-700 mb-4 uppercase text-sm">
                Aquesta acció esborrarà totes les teves dades i no es pot desfer
              </p>

              {!showConfirmClear ? (
                <Button
                  variant="danger"
                  size="lg"
                  onClick={() => setShowConfirmClear(true)}
                  className="w-full uppercase"
                >
                  🗑️ Esborrar totes les dades
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-lg font-bold text-red-700 uppercase text-center">
                    Estàs segur/a?
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="danger"
                      size="lg"
                      onClick={handleClearData}
                      className="flex-1 uppercase"
                    >
                      Sí, esborrar tot
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => setShowConfirmClear(false)}
                      className="flex-1 uppercase"
                    >
                      No, cancel·lar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
