"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@joscola/ui";
import { onAppUpdateAvailable } from "@/lib/pwa-utils";

export function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    // Listen for app updates
    const cleanup = onAppUpdateAvailable(() => {
      setShowUpdate(true);
    });

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setShowUpdate(true);
        }
      });
    }

    // Set up global callback for service worker updates
    (window as any).onServiceWorkerUpdate = () => {
      setShowUpdate(true);
    };

    return cleanup;
  }, []);

  const handleUpdate = () => {
    // Skip waiting and reload
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    // Show again in 1 hour
    setTimeout(() => setShowUpdate(true), 1000 * 60 * 60);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🔄</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 uppercase">
                Nova versió disponible!
              </h3>
              <p className="text-sm mb-4 opacity-90 uppercase">
                Hi ha una nova versió de Joscola disponible amb millores i nous exercicis.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleUpdate}
                  className="bg-white text-blue-600 hover:bg-gray-100 uppercase"
                >
                  Actualitzar ara
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDismiss}
                  className="bg-white/20 text-white hover:bg-white/30 uppercase"
                >
                  Més tard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}