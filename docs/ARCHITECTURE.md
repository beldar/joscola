# ARQUITECTURA DEL PROJECTE JOSCOLA

## Visió General

Joscola és una aplicació web educativa dissenyada per a tablets que permet als nens de primer de primària practicar exercicis escolars. L'aplicació està construïda amb un monorepo utilitzant Turborepo i pnpm workspaces.

## Stack Tecnològic

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Llenguatge**: TypeScript
- **Gestió d'Estat**: Zustand amb persist middleware
- **Animacions**: Framer Motion
- **Estils**: Tailwind CSS
- **Monorepo**: Turborepo + pnpm workspaces

## Estructura del Monorepo

```
joscola/
├── apps/
│   └── game/              # Aplicació principal Next.js
│       ├── src/
│       │   ├── app/       # App Router de Next.js
│       │   ├── components/
│       │   │   ├── exercises/  # Components d'exercicis individuals
│       │   │   ├── ExerciseViewer.tsx
│       │   │   ├── ExerciseSetGrid.tsx
│       │   │   ├── SubjectSelector.tsx
│       │   │   └── Onboarding.tsx
│       │   └── lib/
│       │       ├── store.ts    # Zustand store
│       │       └── exercises/  # Definicions i dades d'exercicis
├── packages/
│   ├── ui/                # Components UI compartits
│   ├── typescript-config/ # Configuracions TS compartides
│   └── eslint-config/     # Configuracions ESLint compartides
└── docs/                  # Documentació
```

## Principis de Disseny

### 1. Tot en Català i Majúscules
- **Tots** els textos de la interfície són en català
- **Tots** els textos estan en MAJÚSCULES per facilitar la lectura als nens

### 2. Optimització per a Tablets
- Botons grans (mínim 44px) per facilitar l'interacció tàctil
- Textos grans (text-2xl a text-5xl)
- Viewport configurat per evitar zoom no desitjat
- Gestos tàctils intuïtius

### 3. Feedback Visual
- Animacions alegres amb Framer Motion
- Colors brillants i emojis
- Retroalimentació immediata a les accions
- Indicadors de progrés visuals

### 4. Persistència Local
- Tot s'emmagatzema en localStorage
- Cap backend, cap base de dades
- Els progressos es mantenen entre sessions
- Les respostes es guarden automàticament

## Components Principals

### Onboarding
- Recull el nom i l'edat del nen
- Primera pantalla de l'aplicació
- Guarda les dades al Zustand store

### SubjectSelector
- Mostra les assignatures disponibles
- Actualment: Matemàtiques (actiu), Català, Castellà, Anglès (pròximament)
- Cada assignatura té un emoji i títol

### ExerciseSetGrid
- Graella de conjunts d'exercicis
- Mostra icones i títols dels conjunts
- Indicadors verds per a exercicis completats
- Navegació cap a ExerciseViewer en fer clic

### ExerciseViewer
- Component principal per a la visualització i correcció d'exercicis
- Gestiona la navegació entre exercicis
- Implementa el sistema de correcció
- Persisteix respostes i correccions a localStorage
- Veure [EXERCISES.md](./EXERCISES.md) per a més detalls

## Flux de l'Aplicació

```
1. Onboarding (nom + edat)
   ↓
2. Selecció d'Assignatura
   ↓
3. Graella de Conjunts d'Exercicis
   ↓
4. Visualitzador d'Exercicis Individuals
   ↓ (completar tots)
5. Retorn a la Graella amb Progrés Actualitzat
```

## Gestió d'Estat

### Zustand Store (Global)

Emmagatzema:
- Informació de l'usuari (nom, edat)
- Assignatura actual
- Progrés dels exercicis completats

```typescript
interface GameStore {
  user: { name: string; age: number } | null;
  currentSubject: string | null;
  exerciseProgress: ExerciseProgress[];
  setUser: (user: { name: string; age: number }) => void;
  setSubject: (subject: string) => void;
  markExerciseComplete: (setId: string, exerciseId: string) => void;
  getExerciseProgress: (setId: string, exerciseId: string) => ExerciseProgress | undefined;
}
```

**Persistència**: Utilitza el middleware `persist` de Zustand per guardar automàticament a localStorage amb la clau `game-storage`.

### localStorage (Exercicis)

Emmagatzema per cada exercici:
- Respostes de l'usuari: `exercise-answers-{exerciseId}`
- Correccions (correcte/incorrecte): `exercise-corrections-{setId}`

Veure [STORAGE.md](./STORAGE.md) per a més detalls.

## Sistema d'Exercicis

### Tipus d'Exercicis Implementats

1. **number-sequence**: Seqüències numèriques
2. **addition-three**: Suma de tres números
3. **subtraction-jumps**: Resta saltant pel 10
4. **addition-jumps**: Suma saltant pel 10
5. **counting**: Comptar objectes
6. **grid-100**: Graella 1-100 amb números perduts

Cada tipus d'exercici té:
- Un component de renderització propi (`/components/exercises/`)
- Una interfície TypeScript per a les dades
- Lògica de validació específica

Veure [EXERCISES.md](./EXERCISES.md) per a documentació detallada.

## Configuració de Desenvolupament

### Instal·lació

```bash
pnpm install
```

### Desenvolupament

```bash
pnpm dev
```

Això inicia:
- Next.js dev server a http://localhost:3000
- TypeScript watch mode per al paquet UI

### Build

```bash
pnpm build
```

## Consideracions de Rendiment

1. **Code Splitting**: Next.js separa automàticament el codi per rutes
2. **Lazy Loading**: Els components d'exercicis es carreguen sota demanda
3. **localStorage**: Accés ràpid sense necessitat de xarxa
4. **Optimització d'Imatges**: Utilitzar Next.js Image per a imatges futures

## Accessibilitat

- Contrast de colors alt per facilitar la lectura
- Botons grans i fàcils de prémer
- Textos clars i simples
- Feedback visual i textual clar

## Pròximes Funcionalitats

- [ ] Més tipus d'exercicis (magic-square, number-search, number-line, estimation)
- [ ] Assignatures addicionals (Català, Castellà, Anglès)
- [ ] Sistema de recompenses i gamificació
- [ ] Estadístiques de progrés
- [ ] Mode multijugador local
- [ ] Exportació de progressos per a pares/professors
