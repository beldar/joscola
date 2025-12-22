"use client";

import { Onboarding } from "@/components/Onboarding";
import { SubjectSelector } from "@/components/SubjectSelector";
import { ExerciseSetGrid } from "@/components/ExerciseSetGrid";
import { InstallPrompt } from "@/components/InstallPrompt";
import { UpdateNotification } from "@/components/UpdateNotification";
import { SplashScreen } from "@/components/SplashScreen";
import { useGameStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { registerServiceWorker, requestPersistentStorage } from "@/lib/pwa-utils";

export default function Home() {
  const { user, currentSubject } = useGameStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Request persistent storage for better offline support
    requestPersistentStorage();
  }, []);

  // Track session time
  useEffect(() => {
    if (!user) return;

    // Start session timer when user is present
    useGameStore.getState().startSession();

    // End session on unmount or page unload
    const handleBeforeUnload = () => {
      useGameStore.getState().endSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      useGameStore.getState().endSession();
    };
  }, [user?.name]); // Only re-run if user changes (using name as stable reference)

  // Track session on page visibility change
  useEffect(() => {
    if (!user) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        useGameStore.getState().endSession();
      } else {
        useGameStore.getState().startSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.name]); // Only re-run if user changes

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <>
      {!user && <Onboarding />}
      {user && !currentSubject && <SubjectSelector />}
      {user && currentSubject === "matematiques" && <ExerciseSetGrid subject="matematiques" />}
      {user && currentSubject === "catala" && <ExerciseSetGrid subject="catala" />}
      {user && currentSubject === "castella" && <ExerciseSetGrid subject="castella" />}
      {user && currentSubject && currentSubject !== "matematiques" && currentSubject !== "catala" && currentSubject !== "castella" && (
        <div>Subject not implemented yet</div>
      )}
      <InstallPrompt />
      <UpdateNotification />
    </>
  );
}
