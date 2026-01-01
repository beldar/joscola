# 🚀 Quick Start Guide

## Start Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test on Tablet

1. Start the dev server:
   ```bash
   pnpm dev
   ```

2. Find your computer's local IP:
   - **Mac**: `ipconfig getifaddr en0`
   - **Windows**: `ipconfig` (look for IPv4 Address)
   - **Linux**: `ip addr show`

3. On your tablet's browser, go to:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```

## Project Commands

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks
pnpm clean        # Clean build artifacts
```

## Application Structure

The app follows this flow:

```
1. Onboarding → Introduir nom, edat i avatar
2. SubjectSelector → Triar assignatura (Matemàtiques, Català, Castellà)
3. ExerciseSetGrid → Veure conjunts d'exercicis
4. ExerciseViewer → Fer exercicis individuals
```

## Key Files

### Exercise Data
- `apps/game/src/lib/exercises/matematiques.ts` - Exercicis de matemàtiques
- `apps/game/src/lib/exercises/catala.ts` - Exercicis de català
- `apps/game/src/lib/exercises/castellano.ts` - Exercicis de castellà
- `apps/game/src/lib/exercises/types.ts` - Definicions de tipus

### Components
- `apps/game/src/components/Onboarding.tsx` - Pantalla inicial
- `apps/game/src/components/SubjectSelector.tsx` - Selecció d'assignatura
- `apps/game/src/components/ExerciseSetGrid.tsx` - Graella de conjunts
- `apps/game/src/components/ExerciseViewer.tsx` - Visualitzador d'exercicis
- `apps/game/src/components/exercises/` - Components específics per cada tipus

### State & Storage
- `apps/game/src/lib/store.ts` - Zustand store amb persist
- `localStorage` - Respostes i correccions per exercici

## Adding a New Exercise Type

1. **Define interface** in `types.ts`:
   ```typescript
   export interface MyNewExercise extends BaseExercise {
     type: "my-new-type";
     // specific properties
   }
   ```

2. **Create component** in `components/exercises/MyNewExercise.tsx`:
   ```tsx
   "use client";

   import { motion } from "framer-motion";
   import type { MyNewExercise as MyNewType } from "@/lib/exercises/types";

   interface Props {
     exercise: MyNewType;
     onAnswer: (answers: Map<string, number | string>) => void;
     answers: Map<string, number | string>;
   }

   export function MyNewExercise({ exercise, answers, onAnswer }: Props) {
     // Implementation
   }
   ```

3. **Add validation** in `ExerciseViewer.tsx`:
   ```typescript
   case "my-new-type":
     // Validation logic
     return true/false;
   ```

4. **Add render case** in `ExerciseViewer.tsx`:
   ```typescript
   case "my-new-type":
     return <MyNewExercise exercise={...} answers={...} onAnswer={...} />;
   ```

5. **Create exercise data** in `matematiques.ts`, `catala.ts`, or `castellano.ts`.

See [EXERCISES.md](./EXERCISES.md) for detailed documentation.

## Styling with Tailwind

Common patterns:
```tsx
// Touch-friendly buttons
<button className="min-h-[44px] min-w-[44px] text-xl">

// Large readable text
<h1 className="text-3xl sm:text-4xl font-bold uppercase">

// Card containers
<div className="bg-white rounded-2xl p-6 border-4 border-gray-200">

// Animations
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>
```

## PWA / Offline

The app is a PWA with Service Worker support:
- `apps/game/public/sw.js` - Service Worker
- `apps/game/public/manifest.json` - Web App Manifest

## Sounds

Sounds use Web Audio API:
- `apps/game/src/lib/sounds.ts` - Sound functions
- `playSuccessSound()` - On correct answer
- `playErrorSound()` - On incorrect answer

## Next Steps

1. **Add more exercises** to existing sets
2. **Create new exercise types** for different learning goals
3. **Implement English** as new subject
4. **Add more gamification** features

## Documentation

- [README.md](./README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [EXERCISES.md](./EXERCISES.md) - Exercise system documentation
- [STORAGE.md](./STORAGE.md) - Data persistence details

Happy coding! 🎉
