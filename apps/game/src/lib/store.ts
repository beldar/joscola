import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const EXERCISE_ANSWER_PREFIX = "exercise-answers-";
export const EXERCISE_CORRECTIONS_PREFIX = "exercise-corrections-";
export const STORE_PERSIST_KEY = "joscola-storage";

export interface User {
  name: string;
  age: number;
  avatar?: string; // emoji avatar
  totalTimeSpent?: number; // in seconds
  createdAt?: Date;
  lastActiveAt?: Date;
}

export interface ExerciseProgress {
  exerciseSetId: string;
  exerciseId: string;
  completed: boolean;
  attempts: number;
  lastAttempt: Date;
}

export interface Medal {
  setId: string;
  setTitle: string;
  awardedAt: Date;
  type: 'gold' | 'silver' | 'bronze';
}

interface GameStore {
  user: User | null;
  currentSubject: string | null;
  progress: ExerciseProgress[];
  stars: number;
  medals: Medal[];
  starsToAnimate: number;
  sessionStartTime: number | null;

  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setSubject: (subject: string | null) => void;
  markExerciseComplete: (exerciseSetId: string, exerciseId: string) => void;
  getExerciseProgress: (exerciseSetId: string, exerciseId: string) => ExerciseProgress | undefined;
  isExerciseSetComplete: (exerciseSetId: string) => boolean;
  addStars: (amount: number) => void;
  awardMedal: (setId: string, setTitle: string) => void;
  getMedalsForSet: (setId: string) => Medal[];
  setStarsToAnimate: (amount: number) => void;
  startSession: () => void;
  endSession: () => void;
  clearAllData: () => void;
  getTotalExercisesCompleted: () => number;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      user: null,
      currentSubject: null,
      progress: [],
      stars: 0,
      medals: [],
      starsToAnimate: 0,
      sessionStartTime: null,

      setUser: (user) => set({
        user: {
          ...user,
          avatar: user.avatar || '👤',
          totalTimeSpent: user.totalTimeSpent || 0,
          createdAt: user.createdAt || new Date(),
          lastActiveAt: new Date(),
        }
      }),

      updateUser: (updates) => {
        const { user } = get();
        if (!user) return;
        set({
          user: {
            ...user,
            ...updates,
            lastActiveAt: new Date(),
          }
        });
      },

      setSubject: (subject) => set({ currentSubject: subject }),

      markExerciseComplete: (exerciseSetId, exerciseId) => {
        const { progress } = get();
        const existing = progress.find(
          (p) => p.exerciseSetId === exerciseSetId && p.exerciseId === exerciseId
        );

        if (existing) {
          set({
            progress: progress.map((p) =>
              p.exerciseSetId === exerciseSetId && p.exerciseId === exerciseId
                ? {
                    ...p,
                    completed: true,
                    attempts: p.attempts + 1,
                    lastAttempt: new Date(),
                  }
                : p
            ),
          });
        } else {
          set({
            progress: [
              ...progress,
              {
                exerciseSetId,
                exerciseId,
                completed: true,
                attempts: 1,
                lastAttempt: new Date(),
              },
            ],
          });
        }
      },

      getExerciseProgress: (exerciseSetId, exerciseId) => {
        return get().progress.find(
          (p) => p.exerciseSetId === exerciseSetId && p.exerciseId === exerciseId
        );
      },

      isExerciseSetComplete: (exerciseSetId) => {
        const { progress } = get();
        // Import the actual exercise set data
        const { matematiquesExerciseSets } = require('./exercises/matematiques');
        const exerciseSet = matematiquesExerciseSets.find((set: any) => set.id === exerciseSetId);

        if (!exerciseSet) return false;

        // Check if all exercises in the set are completed
        return exerciseSet.exercises.every((exercise: any) => {
          return progress.some(p =>
            p.exerciseSetId === exerciseSetId &&
            p.exerciseId === exercise.id &&
            p.completed
          );
        });
      },

      addStars: (amount) => {
        set((state) => ({
          stars: state.stars + amount,
          starsToAnimate: amount
        }));
      },

      setStarsToAnimate: (amount) => {
        set({ starsToAnimate: amount });
      },

      awardMedal: (setId, setTitle) => {
        const { medals } = get();
        // Check if medal already exists for this set
        if (medals.some(m => m.setId === setId)) return;

        set({
          medals: [...medals, {
            setId,
            setTitle,
            awardedAt: new Date(),
            type: 'gold'
          }]
        });
      },

      getMedalsForSet: (setId) => {
        return get().medals.filter(m => m.setId === setId);
      },

      startSession: () => {
        set({ sessionStartTime: Date.now() });
      },

      endSession: () => {
        const { sessionStartTime, user } = get();
        if (sessionStartTime && user) {
          const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
          set({
            user: {
              ...user,
              totalTimeSpent: (user.totalTimeSpent || 0) + sessionDuration,
              lastActiveAt: new Date(),
            },
            sessionStartTime: null,
          });
        }
      },

      clearAllData: () => {
        set({
          user: null,
          currentSubject: null,
          progress: [],
          stars: 0,
          medals: [],
          starsToAnimate: 0,
          sessionStartTime: null,
        });

        if (typeof window !== 'undefined' && window.localStorage) {
          const keysToRemove: string[] = [];
          for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (!key) continue;
            if (
              key.startsWith(EXERCISE_ANSWER_PREFIX) ||
              key.startsWith(EXERCISE_CORRECTIONS_PREFIX)
            ) {
              keysToRemove.push(key);
            }
          }

          keysToRemove.forEach((key) => window.localStorage.removeItem(key));
          window.localStorage.removeItem(STORE_PERSIST_KEY);
        }
      },

      getTotalExercisesCompleted: () => {
        return get().progress.filter(p => p.completed).length;
      },
    }),
    {
      name: STORE_PERSIST_KEY,
    }
  )
);
