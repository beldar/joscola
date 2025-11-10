"use client";

import { Onboarding } from "@/components/Onboarding";
import { SubjectSelector } from "@/components/SubjectSelector";
import { ExerciseSetGrid } from "@/components/ExerciseSetGrid";
import { InstallPrompt } from "@/components/InstallPrompt";
import { UpdateNotification } from "@/components/UpdateNotification";
import { useGameStore } from "@/lib/store";
import { useEffect } from "react";
import { registerServiceWorker, requestPersistentStorage } from "@/lib/pwa-utils";

export default function Home() {
  const { user, currentSubject } = useGameStore();

  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Request persistent storage for better offline support
    requestPersistentStorage();
  }, []);

  return (
    <>
      {!user && <Onboarding />}
      {user && !currentSubject && <SubjectSelector />}
      {user && currentSubject === "matematiques" && <ExerciseSetGrid />}
      {user && currentSubject && currentSubject !== "matematiques" && (
        <div>Subject not implemented yet</div>
      )}
      <InstallPrompt />
      <UpdateNotification />
    </>
  );
}
