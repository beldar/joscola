# SISTEMA D'EXERCICIS

## Visió General

El sistema d'exercicis és el cor de l'aplicació Joscola. Està dissenyat per ser extensible, tipus segur i fàcil de mantenir.

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
interface Exercise {
  id: string;              // Identificador únic
  type: ExerciseType;      // Tipus d'exercici
  title: string;           // Títol en MAJÚSCULES
  instructions: string;    // Instruccions en MAJÚSCULES
  // ... propietats específiques del tipus
}
```

### Tipus d'Exercicis

#### 1. Number Sequence (Seqüències Numèriques)

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

**Exemple**:
```typescript
{
  id: "21-1",
  type: "number-sequence",
  title: "COMPTA ENDAVANT",
  instructions: "OMPLE ELS BUITS",
  start: 10,
  length: 6,
  step: 1,
  direction: "forward",
  missingIndices: [2, 4]
}
// Renderitza: 10 → 11 → [?] → 13 → [?] → 15
```

#### 2. Addition Three (Suma de Tres Números)

**Tipus**: `addition-three`

**Propietats**:
```typescript
{
  numbers: [number, number, number]; // Tres números a sumar
  showVisual?: boolean;               // Mostrar representació visual
}
```

**Component**: `AdditionThreeExercise.tsx`

**Validació**: Comprova que el resultat sigui la suma dels tres números.

**Representació Visual**: Mostra cercles de colors agrupats per facilitar el recompte.

**Exemple**:
```typescript
{
  id: "23-1",
  type: "addition-three",
  title: "SUMA TRES NÚMEROS",
  instructions: "QUANT FA LA SUMA?",
  numbers: [3, 4, 5],
  showVisual: true
}
// Renderitza: 3 + 4 + 5 = [?]
```

#### 3. Subtraction Jumps (Resta Saltant pel 10)

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

**Validació**: Comprova el resultat final de la resta.

**Visualització**:
- Línia numèrica amb tren
- Arcs de salt mostrant els passos
- Desglossament pas a pas: start → -X → 10 → -Y → result

**Exemple**:
```typescript
{
  id: "24-1",
  type: "subtraction-jumps",
  title: "RESTA SALTANT PEL 10",
  instructions: "COMPLETA ELS SALTS PER RESTAR",
  start: 16,
  subtract: 4,
  steps: [16, 12]
}
// 16 - 4 = 16 - 6 - 2 = 10 - 2 = 12
```

#### 4. Addition Jumps (Suma Saltant pel 10)

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

**Visualització**:
- Línia numèrica del start al resultat
- Dos arcs de salt: start → 10 → result
- Desglossament: start → +X → [10] → +Y → result

**Camps editables**:
- Input pel resultat final
- Input pel pas intermedi (sempre ha de ser 10)

**Exemple**:
```typescript
{
  id: "25-1",
  type: "addition-jumps",
  title: "SUMA SALTANT PEL 10",
  instructions: "OMPLE ELS BUITS PER SUMAR COM SUGGEREIX EN BILLY",
  start: 8,
  add: 7,
  steps: [8, 10, 15]
}
// 8 + 7 = 8 + 2 + 5 = 10 + 5 = 15
// L'usuari ha d'omplir el "10" i el "15"
```

#### 5. Counting (Comptar Objectes)

**Tipus**: `counting`

**Propietats**:
```typescript
{
  count: number;           // Quantitat correcta d'objectes
  item: string;            // Emoji de l'objecte
  displayMode: "grid" | "scattered" | "groups";
}
```

**Component**: `CountingExercise.tsx`

**Validació**: Comprova que el comptatge sigui correcte.

**Modes de Visualització**:
- **grid**: Graella ordenada
- **scattered**: Posició aleatòria
- **groups**: Agrupats en desenes

**Exemple**:
```typescript
{
  id: "21-1",
  type: "counting",
  title: "COMPTA",
  instructions: "QUANTS N'HI HA?",
  count: 24,
  item: "🐶",
  displayMode: "groups"
}
```

#### 6. Grid 100 (Graella 1-100)

**Tipus**: `grid-100`

**Propietats**:
```typescript
{
  missingNumbers: number[]; // Números que cal omplir
}
```

**Component**: `Grid100Exercise.tsx`

**Validació**: Comprova que cada número perdut sigui correcte.

**Visualització**:
- Graella 10x10 (1-100)
- Colors diferents per múltiples de 10 (blau), parells (taronja), senars (blanc)
- Inputs per als números perduts

**Exemple**:
```typescript
{
  id: "30-1",
  type: "grid-100",
  title: "GRAELLA 1-100",
  instructions: "OMPLE ELS NÚMEROS QUE FALTEN",
  missingNumbers: [23, 45, 67, 89]
}
```

## ExerciseViewer Component

### Responsabilitats

1. **Renderització**: Mostra l'exercici actual utilitzant el component adequat
2. **Navegació**: Gestiona el canvi entre exercicis amb botons anterior/següent
3. **Validació**: Comprova les respostes de l'usuari
4. **Feedback**: Mostra animacions de correcte/incorrecte
5. **Persistència**: Guarda respostes i correccions a localStorage
6. **Progrés**: Actualitza indicadors de progrés

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
   - Mostrar "BEN FET!" (2.5s amb animació)
   - Auto-avançar al següent exercici
   - Marcar exercici com a completat al Zustand store

   Si INCORRECTE:
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

    case "addition-three":
      // Validar suma total

    case "addition-jumps":
      // Validar resultat final i pas pel 10

    // ... altres tipus
  }
};
```

### Rendering Pattern

Cada tipus d'exercici té el seu component:

```typescript
const renderExercise = () => {
  switch (currentExercise.type) {
    case "number-sequence":
      return <NumberSequenceExercise
        exercise={currentExercise}
        answers={answers}
        onAnswer={setAnswers}
      />;

    // ... altres tipus
  }
};
```

### Props del Component d'Exercici

Tots els components d'exercici segueixen aquesta interfície:

```typescript
interface Props {
  exercise: SpecificExerciseType;  // Tipus específic d'exercici
  answers: Map<string, number>;    // Respostes actuals
  onAnswer: (answers: Map<string, number>) => void;  // Callback per actualitzar
}
```

## Navegació entre Exercicis

### Botons Disponibles

1. **← ANTERIOR**: Navega a l'exercici anterior (deshabilitat si és el primer)
2. **CORREGIR ✓**: Valida les respostes (deshabilitat si no hi ha respostes)
3. **TORNAR A INTENTAR 🔄**: Neteja respostes per tornar a provar (només si incorrecte)
4. **ESBORRAR 🗑️**: Elimina respostes i correcció guardades (només si correcte)
5. **SEGÜENT →**: Va al següent exercici (només si correcte)
6. **ACABAR 🎉**: Torna a la graella (últim exercici i correcte)

### Càrrega de Dades

Quan es navega a un exercici:

```typescript
useEffect(() => {
  // Carregar respostes guardades de localStorage
  const loadedAnswers = loadAnswersFromStorage(currentExercise.id);
  setAnswers(loadedAnswers);
  setShowCorrection(false);
}, [currentExercise.id]);
```

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
  | AdditionThreeExercise
  // ...
  | MyNewExercise;
```

### 2. Crear el Component

A `/components/exercises/MyNewExercise.tsx`:

```typescript
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
    // JSX de l'exercici
  );
}
```

### 3. Afegir Validació

A `ExerciseViewer.tsx`:

```typescript
const validateAnswer = (exercise: Exercise, answers: Map<string, number | string>): boolean => {
  switch (exercise.type) {
    // ... casos existents

    case "my-new-type":
      // Lògica de validació
      return /* resultat booleà */;
  }
};
```

### 4. Afegir Renderització

A `ExerciseViewer.tsx`:

```typescript
const renderExercise = () => {
  switch (currentExercise.type) {
    // ... casos existents

    case "my-new-type":
      return <MyNewExercise
        exercise={currentExercise}
        answers={answers as Map<string, number>}
        onAnswer={setAnswers}
      />;
  }
};
```

### 5. Crear Dades d'Exercicis

A `/lib/exercises/matematiques.ts` (o nova assignatura):

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

### 2. Validació

- Sempre retornar un booleà
- Gestionar casos edge (camps buits, valors incorrectes)
- Validar tots els camps requerits

### 3. Accessibilitat

- Inputs grans (mínim text-4xl)
- Placeholders clars ("?")
- Focus rings visibles
- Colors amb bon contrast

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
