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

## Current Game

**Math Addition Game** - Located at [apps/game/src/components/MathGame.tsx](apps/game/src/components/MathGame.tsx)

Features:
- Addition problems (1-10)
- Multiple choice answers
- Score tracking
- Animated feedback
- Kid-friendly interface

## Adding a New Game

1. **Create a new component** in `apps/game/src/components/`:
   ```tsx
   "use client";

   import { useState } from "react";
   import { Button, Card } from "@joscola/ui";

   export function MyNewGame() {
     const [score, setScore] = useState(0);

     return (
       <Card className="game-container">
         <h2>My New Game</h2>
         <Button
           variant="primary"
           size="lg"
           onClick={() => setScore(score + 1)}
         >
           Click Me!
         </Button>
         <p>Score: {score}</p>
       </Card>
     );
   }
   ```

2. **Add it to a page** in `apps/game/src/app/`:
   ```tsx
   import { MyNewGame } from "@/components/MyNewGame";

   export default function Page() {
     return <MyNewGame />;
   }
   ```

3. **Use shared components** from `@joscola/ui`:
   - `Button` - Animated button with variants
   - `Card` - Container with entrance animation
   - More coming soon!

## Available UI Components

### Button
```tsx
<Button
  variant="primary" | "secondary" | "success" | "danger"
  size="sm" | "md" | "lg"
  onClick={handleClick}
>
  Click Me
</Button>
```

### Card
```tsx
<Card interactive={true}>
  Content here
</Card>
```

## Utility Functions

Located in `apps/game/src/lib/utils.ts`:

```tsx
import { shuffleArray, randomInRange, cn } from "@/lib/utils";

// Shuffle an array
const shuffled = shuffleArray([1, 2, 3, 4, 5]);

// Random number in range
const random = randomInRange(1, 10);

// Merge Tailwind classes
const classes = cn("text-blue-500", "font-bold");
```

## Styling with Tailwind

The project uses Tailwind CSS. Common patterns:

```tsx
// Container
<div className="game-container">

// Card style
<div className="card">

// Touch-friendly target
<button className="touch-target">

// Gradient background
<div className="bg-gradient-to-br from-blue-50 to-purple-50">
```

Custom colors available:
- `primary-*` (red shades)
- `secondary-*` (blue shades)

## Animation with Framer Motion

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileTap={{ scale: 0.95 }}
>
  Content
</motion.div>
```

## Next Steps

1. **Customize the Math Game** - Adjust difficulty, add subtraction, etc.
2. **Create New Games** - Spelling, shapes, colors, memory games
3. **Add Sound Effects** - Install `use-sound` package
4. **Progress Tracking** - Use Zustand for state management
5. **More Subjects** - Implement different educational topics

## Need Help?

- Read the [main README](README.md) for full documentation
- Check Next.js docs: https://nextjs.org/docs
- Framer Motion docs: https://www.framer.com/motion/
- Tailwind CSS docs: https://tailwindcss.com/docs

Happy coding! 🎉
