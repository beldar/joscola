# SISTEMA D'EXERCICIS

## Visió General

El sistema d'exercicis és el cor de l'aplicació Joscola. Està dissenyat per ser extensible, tipus segur i fàcil de mantenir. Actualment hi ha **17 tipus d'exercicis** implementats.

## Arquitectura dels Exercicis

### Estructura de Dades

Cada exercici segueix aquesta jerarquia:

```
ExerciseSet (Conjunt d'exercicis)
  └── Exercise[] (Llista d'exercicis individuals)
```

#### ExerciseSet

```typescript
interface ExerciseSet {
  id: string;              // Identificador únic
  title: string;           // Títol en MAJÚSCULES
  icon: string;            // Emoji representatiu
  exercises: Exercise[];   // Llista d'exercicis
}
```

#### Exercise

Cada exercici té una estructura base i propietats específiques segons el seu tipus:

```typescript
interface BaseExercise {
  id: string;              // Identificador únic
  type: ExerciseType;      // Tipus d'exercici
  title: string;           // Títol en MAJÚSCULES
  instructions: string;    // Instruccions en MAJÚSCULES
}
```

### Tipus d'Exercicis (17 tipus)

## Exercicis de Matemàtiques

### 1. Number Sequence (Seqüències Numèriques)

**Tipus**: `number-sequence`

**Propietats**:
```typescript
{
  start: number;           // Número inicial
  length: number;          // Longitud de la seqüència
  step: number;            // Pas entre números (1, 2, 5, 10...)
  direction: "forward" | "backward";
  missingIndices: number[]; // Índexs dels números que cal omplir
}
```

**Component**: `NumberSequenceExercise.tsx`

**Validació**: Comprova que cada número perdut coincideixi amb el valor correcte de la seqüència.

### 2. Counting (Comptar Objectes)

**Tipus**: `counting`

**Propietats**:
```typescript
{
  count: number;           // Quantitat correcta d'objectes
  items: string;           // Emoji de l'objecte
  imageType: "grid" | "scattered" | "groups";
}
```

**Component**: `CountingExercise.tsx`

**Modes de Visualització**:
- **grid**: Graella ordenada
- **scattered**: Posició aleatòria
- **groups**: Agrupats en desenes

### 3. Addition Three (Suma de Tres Números)

**Tipus**: `addition-three`

**Propietats**:
```typescript
{
  numbers: [number, number, number]; // Tres números a sumar
  showVisual?: boolean;               // Mostrar representació visual
}
```

**Component**: `AdditionThreeExercise.tsx`

**Representació Visual**: Mostra cercles de colors agrupats per facilitar el recompte.

### 4. Subtraction Jumps (Resta Saltant pel 10)

**Tipus**: `subtraction-jumps`

**Propietats**:
```typescript
{
  start: number;      // Número inicial
  subtract: number;   // Quantitat a restar
  steps: number[];    // Passos intermedis (per validació)
}
```

**Component**: `SubtractionJumpsExercise.tsx`

**Visualització**: Línia numèrica amb tren i arcs de salt.

### 5. Addition Jumps (Suma Saltant pel 10)

**Tipus**: `addition-jumps`

**Propietats**:
```typescript
{
  start: number;    // Número inicial
  add: number;      // Quantitat a sumar
  steps: number[];  // Passos intermedis (per validació)
}
```

**Component**: `AdditionJumpsExercise.tsx`

**Validació**: Comprova tant el resultat final com el pas intermedi (10).

### 6. Grid 100 (Graella 1-100)

**Tipus**: `grid-100`

**Propietats**:
```typescript
{
  missingNumbers: number[]; // Números que cal omplir
  maxNumber?: number;       // Màxim de la graella (defecte: 100)
}
```

**Component**: `Grid100Exercise.tsx`

**Visualització**: Graella 10x10 amb colors per múltiples de 10, parells i senars.

### 7. Number Order (Ordenar Nombres)

**Tipus**: `number-order`

**Propietats**:
```typescript
{
  numbers: number[];
  question: "smallest" | "largest" | "order-asc" | "order-desc";
}
```

**Component**: `NumberOrderExercise.tsx`

**Modes**:
- `smallest`: Seleccionar el més petit
- `largest`: Seleccionar el més gran
- `order-asc`: Ordenar de petit a gran
- `order-desc`: Ordenar de gran a petit

### 8. Train Position (Posicions en un Tren)

**Tipus**: `train-position`

**Propietats**:
```typescript
{
  trainLength: number;
  signPositions: number[];
  missingPositions: number[];
  mode?: "fill-signs" | "place-signs" | "tunnel-fill";
  availableSigns?: number[];
  tunnels?: Array<{
    start: number;
    length: number;
    variant?: "stone" | "moss" | "wood";
  }>;
}
```

**Component**: `TrainPositionExercise.tsx`

**Modes**: Omplir signes, col·locar signes, o omplir túnels.

### 9. Number Pattern (Patrons Numèrics)

**Tipus**: `number-pattern`

**Propietats**:
```typescript
{
  patterns: Array<{
    layout: "cross" | "line" | "square";
    given: Array<{ position: string; value: number }>;
    missing: string[];
  }>;
}
```

**Component**: `NumberPatternExercise.tsx`

**Layouts**: Creus (+10/-10, +1/-1), línies seqüencials, quadrats.

### 10. Magic Square (Quadrats Màgics)

**Tipus**: `magic-square`

**Propietats**:
```typescript
{
  size: 2 | 3;
  targetSum: number;
  given: Array<{ row: number; col: number; value: number }>;
  validateRow?: number;
  validateColumn?: number;
}
```

**Component**: `MagicSquareExercise.tsx`

**Visualització**: Per a 3x3, el centre mostra un núvol amb la suma objectiu.

### 11. Number Line (Recta Numèrica)

**Tipus**: `number-line`

**Propietats**:
```typescript
{
  min: number;
  max: number;
  numbersToPlace: number[];
}
```

**Component**: `NumberLineExercise.tsx`

**Visualització**: Recta interactiva on cal col·locar números.

### 12. Estimation (Estimació amb Diners)

**Tipus**: `estimation`

**Propietats**:
```typescript
{
  money: number;
  items: Array<{ name: string; price: number; icon: string }>;
  question: string;
}
```

**Component**: `EstimationExercise.tsx`

**Validació**: Comprova que la selecció d'articles maximitza la despesa sense superar el pressupost.

## Exercicis de Llengua (Català/Castellà)

### 13. Reading Speed (Velocitat Lectora)

**Tipus**: `reading-speed`

**Propietats**:
```typescript
{
  phase: number;        // 1-9
  words: string[];      // 60 paraules a llegir
  timeLimit: number;    // En segons (120 per 2 minuts)
  columns: number;      // Nombre de columnes
}
```

**Component**: `ReadingSpeedExercise.tsx`

**Funcionalitat**: L'usuari ha de llegir 60 paraules en 2 minuts. Es resalta la paraula actual i es pot parar/reiniciar.

### 14. Calligraphy (Cal·ligrafia)

**Tipus**: `calligraphy`

**Propietats**:
```typescript
{
  letter: string;           // 'a', 'b', 'c', etc.
  letterDisplay: string;    // Versió per mostrar
  letterType: "lowercase" | "uppercase";
  style: "cursive" | "print";
  practiceBoxes: number;    // Nombre de caixes (12-18)
  showGuidelines: boolean;
  showModel: boolean;
}
```

**Component**: `CalligraphyExercise.tsx`

**Funcionalitat**: Canvas per dibuixar lletres amb guies i model. Suport per touch i mouse.

### 15. Word Search (Sopa de Lletres)

**Tipus**: `word-search`

**Propietats**:
```typescript
{
  gridSize: number;         // Mida de la graella (ex: 10x10)
  words: string[];          // Paraules a trobar
  grid: string[][];         // Graella pre-generada
  wordPositions: Array<{
    word: string;
    startRow: number;
    startCol: number;
    direction: "horizontal" | "vertical" | "diagonal-down" | "diagonal-up";
  }>;
}
```

**Component**: `WordSearchExercise.tsx`

**Funcionalitat**: Selecció de paraules arrossegant el dit/ratolí. Suport complet per touch amb `onTouchMove`.

### 16. Pictogram Crossword (Crucigrama amb Pictogrames)

**Tipus**: `pictogram-crossword`

**Propietats**:
```typescript
{
  gridSize: { rows: number; cols: number };
  words: Array<{
    word: string;
    emoji: string;          // Pista visual
    startRow: number;
    startCol: number;
    direction: "horizontal" | "vertical";
    clueNumber: number;
  }>;
  grid: (string | null)[][]; // null per cel·les bloquejades
}
```

**Component**: `PictogramCrosswordExercise.tsx`

**Funcionalitats**:
- Pistes amb emojis (pictogrames)
- Navegació amb teclat entre cel·les
- Botó "no entiendo los dibujos..." per mostrar les paraules
- Suport per cel·les pre-omplides
- Números de pista per horizontal i vertical

### 17. Number Search (No implementat visualment)

**Tipus**: `number-search`

**Nota**: Aquest tipus està definit a types.ts però no té component visual implementat.

## ExerciseViewer Component

### Responsabilitats

1. **Renderització**: Mostra l'exercici actual utilitzant el component adequat
2. **Navegació**: Gestiona el canvi entre exercicis amb botons anterior/següent
3. **Validació**: Comprova les respostes de l'usuari
4. **Feedback**: Mostra animacions de correcte/incorrecte amb sons
5. **Persistència**: Guarda respostes i correccions a localStorage
6. **Progrés**: Actualitza indicadors de progrés
7. **Gamificació**: Atorga estrelles i medalles

### Flux de Correcció

```
1. Usuari omple els camps
   ↓
2. Prem "CORREGIR"
   ↓
3. validateAnswer() comprova la resposta
   ↓
4. Si CORRECTE:
   - Guardar resposta i correcció a localStorage
   - Reproduir so d'èxit
   - Mostrar "BEN FET!" (2.5s amb animació)
   - Atorgar 1 estrella (si és primera vegada)
   - Auto-avançar al següent exercici
   - Si és l'últim: comprovar medalla

   Si INCORRECTE:
   - Reproduir so d'error
   - Mostrar "TORNA-HO A INTENTAR!" (2s amb animació)
   - Mantenir respostes
   - Mostrar botó "TORNAR A INTENTAR"
```

### Sistema de Validació

Cada tipus d'exercici té la seva lògica de validació en el mètode `validateAnswer()`:

```typescript
const validateAnswer = (exercise: Exercise, answers: Map<string, number | string>): boolean => {
  switch (exercise.type) {
    case "number-sequence":
      // Validar cada posició perduda

    case "magic-square":
      // Validar files i columnes especificades

    case "word-search":
      // Validar que s'han trobat totes les paraules

    case "pictogram-crossword":
      // Validar cada lletra de cada paraula

    // ... altres tipus
  }
};
```

## Navegació entre Exercicis

### Botons Disponibles

1. **← ANTERIOR**: Navega a l'exercici anterior (deshabilitat si és el primer)
2. **CORREGIR ✓**: Valida les respostes (deshabilitat si no hi ha respostes)
3. **TORNAR A INTENTAR 🔄**: Neteja respostes per tornar a provar (només si incorrecte)
4. **ESBORRAR 🗑️**: Elimina respostes i correcció guardades (només si correcte)
5. **SEGÜENT →**: Va al següent exercici (només si correcte)
6. **ACABAR 🎉**: Torna a la graella (últim exercici i correcte)

## Afegir un Nou Tipus d'Exercici

### 1. Definir la Interfície

A `/lib/exercises/types.ts`:

```typescript
export interface MyNewExercise extends BaseExercise {
  type: "my-new-type";
  // propietats específiques
}

// Afegir al tipus Exercise
export type Exercise =
  | NumberSequenceExercise
  // ...
  | MyNewExercise;

// Afegir al ExerciseType
export type ExerciseType =
  // ...
  | "my-new-type";
```

### 2. Crear el Component

A `/components/exercises/MyNewExercise.tsx`:

```typescript
"use client";

import { motion } from "framer-motion";
import type { MyNewExercise as MyNewType } from "@/lib/exercises/types";

interface Props {
  exercise: MyNewType;
  onAnswer: (answers: Map<string, number>) => void;
  answers: Map<string, number>;
}

export function MyNewExercise({ exercise, answers, onAnswer }: Props) {
  const handleInputChange = (key: string, value: string) => {
    const newAnswers = new Map(answers);
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      newAnswers.set(key, numValue);
    } else {
      newAnswers.delete(key);
    }
    onAnswer(newAnswers);
  };

  return (
    <div className="space-y-6">
      {/* JSX de l'exercici */}
    </div>
  );
}
```

### 3. Afegir Validació

A `ExerciseViewer.tsx`:

```typescript
case "my-new-type":
  // Lògica de validació
  return /* resultat booleà */;
```

### 4. Afegir Renderització

A `ExerciseViewer.tsx`:

```typescript
case "my-new-type":
  return (
    <MyNewExercise
      exercise={currentExercise}
      answers={answers as Map<string, number>}
      onAnswer={setAnswers}
    />
  );
```

### 5. Crear Dades d'Exercicis

A `/lib/exercises/matematiques.ts` (o `catala.ts`, `castellano.ts`):

```typescript
{
  id: "set-XX",
  title: "TÍTOL DEL CONJUNT",
  icon: "🎯",
  exercises: [
    {
      id: "XX-1",
      type: "my-new-type",
      title: "TÍTOL DE L'EXERCICI",
      instructions: "INSTRUCCIONS",
      // propietats específiques
    }
  ]
}
```

## Millors Pràctiques

### 1. Claus d'Answers

Utilitzar claus descriptives i consistents:
- `"result"` per al resultat final
- `"pos-{index}"` per a posicions en seqüències
- `"step-{index}"` per a passos intermedis
- `"num-{number}"` per a números específics
- `"cell-{row}-{col}"` per a cel·les de graelles

### 2. Validació

- Sempre retornar un booleà
- Gestionar casos edge (camps buits, valors incorrectes)
- Validar tots els camps requerits

### 3. Touch Support

Per a exercicis interactius (word-search, calligraphy):
- Utilitzar `onTouchStart`, `onTouchMove`, `onTouchEnd`
- Afegir `touch-action: none` per evitar scroll
- Usar refs per detectar elements sota el dit

### 4. Animacions

- Utilitzar Framer Motion per transicions
- Delays escalonats per a múltiples elements
- Animacions alegres però no molestes
- Duració raonable (0.3-0.6s)

### 5. Responsive

- Tot ha de funcionar en tablets
- Min/max widths apropiats
- Overflow scroll on necessari
- Touch-friendly (no hover states crítics)
