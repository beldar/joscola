"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@joscola/ui";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if it's iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show prompt after a delay or based on user engagement
      setTimeout(() => {
        // Only show if user has interacted with at least one exercise
        const hasInteracted = localStorage.getItem("exercise-answers-") !== null;
        if (!hasInteracted) {
          // Show after 30 seconds for new users
          setTimeout(() => setShowPrompt(true), 30000);
        } else {
          // Show immediately for returning users
          setShowPrompt(true);
        }
      }, 2000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // iOS specific prompt
    if (isIOS && !isInstalled) {
      setTimeout(() => {
        const hasSeenIOSPrompt = localStorage.getItem("ios-install-prompt-seen");
        if (!hasSeenIOSPrompt) {
          setShowPrompt(true);
        }
      }, 5000);
    }

    // Listen for app installed event
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowPrompt(false);
      console.log("PWA was installed");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // iOS instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert(
          "Per instal·lar aquesta aplicació:\n" +
          "1. Toca el botó de compartir (□↑)\n" +
          "2. Desplaça't i selecciona 'Afegir a la pantalla d'inici'\n" +
          "3. Toca 'Afegir'"
        );
        localStorage.setItem("ios-install-prompt-seen", "true");
        setShowPrompt(false);
      }
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem("install-prompt-dismissed", Date.now().toString());
  };

  // Check if we should suppress the prompt
  useEffect(() => {
    const dismissed = localStorage.getItem("install-prompt-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (isInstalled || !showPrompt) {
    return null;
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-blue-500 p-6">
            <div className="flex items-start gap-4">
              <div className="text-5xl">📱</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2 uppercase">
                  Instal·la Joscola!
                </h3>
                <p className="text-sm text-gray-600 mb-4 uppercase">
                  {isIOS
                    ? "Afegeix l'aplicació a la teva pantalla d'inici per jugar sense connexió"
                    : "Instal·la l'aplicació per jugar sense connexió i accedir més ràpid"}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleInstallClick}
                    className="uppercase"
                  >
                    {isIOS ? "Com instal·lar" : "Instal·lar"}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleDismiss}
                    className="uppercase"
                  >
                    Més tard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}