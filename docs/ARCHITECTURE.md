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
- **PWA**: Service Worker per funcionalitat offline

## Estructura del Monorepo

```
joscola/
├── apps/
│   └── game/              # Aplicació principal Next.js
│       ├── src/
│       │   ├── app/       # App Router de Next.js
│       │   ├── components/
│       │   │   ├── exercises/  # Components d'exercicis (16 tipus)
│       │   │   ├── ExerciseViewer.tsx
│       │   │   ├── ExerciseSetGrid.tsx
│       │   │   ├── SubjectSelector.tsx
│       │   │   ├── Onboarding.tsx
│       │   │   ├── GameHeader.tsx
│       │   │   ├── ProfilePage.tsx
│       │   │   └── MedalAnimation.tsx
│       │   └── lib/
│       │       ├── store.ts    # Zustand store
│       │       ├── sounds.ts   # Web Audio API sons
│       │       └── exercises/  # Definicions i dades d'exercicis
│       │           ├── types.ts
│       │           ├── matematiques.ts
│       │           ├── catala.ts
│       │           └── castellano.ts
│       └── public/
│           └── service-worker.js  # PWA cache
├── packages/
│   ├── ui/                # Components UI compartits
│   ├── typescript-config/ # Configuracions TS compartides
│   └── eslint-config/     # Configuracions ESLint compartides
├── scripts/               # Scripts d'automatització
└── docs/                  # Documentació
```

## Principis de Disseny

### 1. Tot en Català i Majúscules
- **Tots** els textos de la interfície són en català
- **Tots** els textos estan en MAJÚSCULES per facilitar la lectura als nens
- Exercicis de Castellà mostren textos en castellà (MAYÚSCULAS)

### 2. Optimització per a Tablets
- Botons grans (mínim 44px) per facilitar l'interacció tàctil
- Textos grans (text-2xl a text-5xl)
- Viewport configurat per evitar zoom no desitjat
- Gestos tàctils intuïtius (drag, touch events)
- `touch-action: none` en elements interactius per evitar scroll

### 3. Feedback Visual i Auditiu
- Animacions alegres amb Framer Motion
- Colors brillants i emojis
- Retroalimentació immediata a les accions
- Indicadors de progrés visuals
- Sons amb Web Audio API (estrelles, medalles, èxit, error)

### 4. Persistència Local
- Tot s'emmagatzema en localStorage
- Cap backend, cap base de dades
- Els progressos es mantenen entre sessions
- Les respostes es guarden automàticament

### 5. Gamificació
- Sistema d'estrelles per exercicis completats
- Medalles per completar conjunts d'exercicis
- Perfil d'usuari amb avatar personalitzable
- Estadístiques de temps i progrés

## Components Principals

### Onboarding
- Recull el nom, edat i avatar del nen
- Primera pantalla de l'aplicació
- Selecció d'avatar entre 32 emojis
- Guarda les dades al Zustand store

### SubjectSelector
- Mostra les assignatures disponibles
- **Actives**: Matemàtiques, Català, Castellà
- **Pròximament**: Anglès
- Cada assignatura té un emoji i títol

### GameHeader
- Capçalera estil videojoc
- Mostra estrelles acumulades
- Accés al perfil d'usuari
- Botó per tornar enrere

### ProfilePage
- Mostra i permet editar el perfil
- Selecció d'avatar
- Estadístiques (temps, exercicis, estrelles, medalles)
- Opció per esborrar totes les dades

### ExerciseSetGrid
- Graella de conjunts d'exercicis
- Mostra icones i títols dels conjunts
- Indicadors de medalles i progrés
- Navegació cap a ExerciseViewer en fer clic

### ExerciseViewer
- Component principal per a la visualització i correcció d'exercicis
- Gestiona la navegació entre exercicis
- Implementa el sistema de correcció i validació
- Persisteix respostes i correccions a localStorage
- Mostra animacions de feedback (correcte/incorrecte)
- Atorga estrelles i medalles
- Veure [EXERCISES.md](./EXERCISES.md) per a més detalls

### MedalAnimation
- Animació de celebració en guanyar medalles
- Mostra el títol del conjunt completat

## Flux de l'Aplicació

```
1. Onboarding (nom + edat + avatar)
   ↓
2. Selecció d'Assignatura (Matemàtiques, Català, Castellà)
   ↓
3. Graella de Conjunts d'Exercicis
   ↓
4. Visualitzador d'Exercicis Individuals
   ↓ (completar tots)
5. Animació de Medalla 🏅
   ↓
6. Retorn a la Graella amb Progrés Actualitzat
```

## Gestió d'Estat

### Zustand Store (Global)

Emmagatzema:
- Informació de l'usuari (nom, edat, avatar, temps, dates)
- Assignatura actual
- Progrés dels exercicis completats
- Estrelles acumulades
- Medalles guanyades

```typescript
interface GameStore {
  user: {
    name: string;
    age: number;
    avatar: string;
    totalTimeSpent: number;
    createdAt: Date;
    lastActiveAt: Date;
  } | null;
  currentSubject: string | null;
  stars: number;
  medals: Medal[];
  progress: ExerciseProgress[];
  // ... mètodes
}
```

**Persistència**: Utilitza el middleware `persist` de Zustand per guardar automàticament a localStorage amb la clau `joscola-storage`.

### localStorage (Exercicis)

Emmagatzema per cada exercici:
- Respostes de l'usuari: `exercise-answers-{exerciseId}`
- Correccions (correcte/incorrecte): `exercise-corrections-{setId}`

Veure [STORAGE.md](./STORAGE.md) per a més detalls.

## Sistema d'Exercicis

### Tipus d'Exercicis Implementats (17 tipus)

#### Matemàtiques
1. **number-sequence**: Seqüències numèriques (endavant/enrere)
2. **counting**: Comptar objectes (grid/scattered/groups)
3. **addition-three**: Suma de tres números
4. **subtraction-jumps**: Resta saltant pel 10
5. **addition-jumps**: Suma saltant pel 10
6. **grid-100**: Graella 1-100 amb números perduts
7. **number-order**: Ordenar nombres (petit→gran, gran→petit)
8. **train-position**: Posicions en un tren/seqüència
9. **number-pattern**: Patrons numèrics (creus, línies)
10. **magic-square**: Quadrats màgics
11. **number-line**: Recta numèrica
12. **estimation**: Estimació amb diners

#### Català i Castellà
13. **reading-speed**: Velocitat lectora (60 paraules en 2 min)
14. **calligraphy**: Cal·ligrafia (dibuixar lletres)
15. **word-search**: Sopa de lletres
16. **pictogram-crossword**: Crucigrames amb pictogrames

Cada tipus d'exercici té:
- Un component de renderització propi (`/components/exercises/`)
- Una interfície TypeScript per a les dades (`/lib/exercises/types.ts`)
- Lògica de validació específica a `ExerciseViewer.tsx`

Veure [EXERCISES.md](./EXERCISES.md) per a documentació detallada.

## Assignatures i Exercicis

### Matemàtiques
- Múltiples conjunts d'exercicis numèrics
- Seqüències, sumes, restes, graelles, patrons
- Quadrats màgics, rectes numèriques, estimació

### Català
- Velocitat lectora amb paraules catalanes
- Cal·ligrafia de lletres minúscules
- (Més tipus en desenvolupament)

### Castellà
- Velocitat lectora amb paraules castellanes
- Cal·ligrafia de lletres minúscules
- Sopes de lletres amb vocabulari castellà
- Crucigrames amb pictogrames (emojis com a pistes)

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

### Test en Tablet

1. Troba la teva IP local: `ipconfig getifaddr en0` (Mac)
2. Al tablet, obre: `http://TU_IP:3000`

## PWA i Cache

L'aplicació és una Progressive Web App (PWA) amb:
- Service Worker per funcionalitat offline
- Cache automàtic d'assets
- Versió de cache auto-incrementada en cada commit

Veure [CACHE-AUTOMATION.md](./CACHE-AUTOMATION.md) per a detalls.

## Consideracions de Rendiment

1. **Code Splitting**: Next.js separa automàticament el codi per rutes
2. **Lazy Loading**: Els components d'exercicis es carreguen sota demanda
3. **localStorage**: Accés ràpid sense necessitat de xarxa
4. **Optimització d'Imatges**: Utilitzar Next.js Image per a imatges futures
5. **Web Audio API**: Sons generats sense fitxers d'àudio

## Accessibilitat

- Contrast de colors alt per facilitar la lectura
- Botons grans i fàcils de prémer
- Textos clars i simples
- Feedback visual i textual clar
- Touch targets grans per a tablets

## Funcionalitats Implementades ✅

- [x] 17 tipus d'exercicis diferents
- [x] 3 assignatures (Matemàtiques, Català, Castellà)
- [x] Sistema de gamificació (estrelles + medalles)
- [x] Perfil d'usuari amb avatar
- [x] Estadístiques de temps i progrés
- [x] PWA amb funcionalitat offline
- [x] Sons amb Web Audio API
- [x] Touch/drag suport per tablets

## Pròximes Funcionalitats

- [ ] Assignatura d'Anglès
- [ ] Mode multijugador local
- [ ] Exportació de progressos per a pares/professors
- [ ] Més nivells de dificultat
- [ ] Més exercicis per a cada assignatura
