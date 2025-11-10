# 🎓 Joscola - Jocs Educatius

Aplicació web educativa per a tablets dissenyada per ajudar nens de primer de primària a practicar exercicis escolars.

## 📚 Documentació Completa

Consulta la [documentació completa](./docs/README.md) per a informació detallada sobre:

- **[Arquitectura](./docs/ARCHITECTURE.md)**: Estructura del projecte, stack tecnològic i components principals
- **[Exercicis](./docs/EXERCISES.md)**: Sistema d'exercicis, tots els tipus implementats i com afegir-ne de nous
- **[Persistència](./docs/STORAGE.md)**: Sistema de localStorage, gestió de dades i debugging

## 🚀 Tech Stack

- **Framework**: Next.js 15 + React 19 + TypeScript
- **Monorepo**: Turborepo + pnpm workspaces
- **Estils**: Tailwind CSS
- **Animacions**: Framer Motion
- **Gestió d'Estat**: Zustand amb persist middleware
- **Components UI**: Biblioteca de components personalitzada

## 📁 Estructura del Projecte

```
joscola/
├── apps/
│   └── game/              # Aplicació Next.js principal
│       ├── src/
│       │   ├── app/       # Next.js app router
│       │   ├── components/
│       │   │   ├── exercises/   # Components d'exercicis
│       │   │   ├── ExerciseViewer.tsx
│       │   │   ├── ExerciseSetGrid.tsx
│       │   │   ├── SubjectSelector.tsx
│       │   │   └── Onboarding.tsx
│       │   └── lib/
│       │       ├── store.ts     # Zustand store
│       │       └── exercises/   # Dades i definicions
│       └── public/        # Assets estàtics
├── packages/
│   ├── ui/                # Biblioteca UI compartida
│   ├── typescript-config/ # Configs TypeScript compartides
│   └── eslint-config/     # Configs ESLint compartides
└── docs/                  # Documentació
```

## 🎮 Funcionalitats

### Característiques Principals

- ✅ **Interfície en Català**: Tots els textos en català i MAJÚSCULES
- ✅ **Optimitzat per Tablets**: Botons grans (44px mínim), gestos tàctils
- ✅ **6 Tipus d'Exercicis**: Matemàtiques amb diferents mecàniques
- ✅ **Persistència Local**: Tot es guarda a localStorage (sense backend)
- ✅ **Animacions Alegres**: Feedback visual amb Framer Motion
- ✅ **Sistema de Progrés**: Indicadors visuals per seguir l'avenç
- ✅ **Navegació Fluida**: Entre exercicis amb animacions
- ✅ **Type-Safe**: TypeScript complet en tot el monorepo

### Exercicis Implementats

1. **Seqüències Numèriques** (number-sequence)
   - Comptar endavant/enrere
   - Diferents passos (1, 2, 5, 10...)
   - Omplir números perduts

2. **Suma de Tres Números** (addition-three)
   - Suma de 3 nombres
   - Representació visual amb cercles de colors
   - Validació automàtica

3. **Resta Saltant** (subtraction-jumps)
   - Restar creuant el 10
   - Línia numèrica interactiva
   - Desglossament de passos

4. **Suma Saltant** (addition-jumps)
   - Sumar creuant el 10
   - Arcs de salt visuals
   - Pas intermedi pel 10

5. **Comptar Objectes** (counting)
   - Tres modes: grid, scattered, groups
   - Emojis com a objectes
   - Agrupació en desenes

6. **Graella 1-100** (grid-100)
   - Graella 10x10
   - Omplir números perduts
   - Colors per múltiples de 10, parells i senars

### Conjunts d'Exercicis Disponibles

- 🔢 **COMPTEM** (21) - 3 exercicis de comptar objectes
- 📊 **ORDENA NOMBRES** (22) - 3 exercicis de seqüències
- ➕ **SUMEM 3 NOMBRES** (23) - 3 exercicis de suma
- ➖ **RESTEM SALTANT** (24) - 3 exercicis de resta amb salts
- 🦘 **SUMEM SALTANT** (25) - 3 exercicis de suma amb salts pel 10
- ⬇️ **RESTEM SALTANT PEL 10** (26) - 3 exercicis de resta amb salts pel 10
- 📐 **GRAELLA 1-100** (30) - 3 exercicis de graella numèrica

## 🛠️ Començar a Desenvolupar

### Prerequisits

- Node.js 18 o superior
- pnpm (instal·la amb `npm install -g pnpm`)

### Instal·lació

```bash
# Instal·lar dependències
pnpm install

# Iniciar servidor de desenvolupament
pnpm dev

# Build de tots els apps
pnpm build

# Lint de tots els packages
pnpm lint

# Type check
pnpm type-check
```

L'aplicació estarà disponible a [http://localhost:3000](http://localhost:3000)

## 🎯 Flux de l'Usuari

```
1. ONBOARDING
   Introduir nom i edat
   ↓
2. SELECCIÓ D'ASSIGNATURA
   Triar Matemàtiques (altres assignatures pròximament)
   ↓
3. GRAELLA D'EXERCICIS
   Veure tots els conjunts disponibles
   Indicadors de progrés amb ✓ verd
   ↓
4. EXERCICIS INDIVIDUALS
   - Completar camps
   - Prémer CORREGIR
   - Feedback animat (BEN FET! / TORNA-HO A INTENTAR!)
   - Navegació: ← ANTERIOR | SEGÜENT →
   - Opció d'ESBORRAR respostes guardades
   ↓
5. SEGÜENT EXERCICI
   Repetir fins completar tots del conjunt
   ↓
6. TORNAR A LA GRAELLA
   Veure progrés actualitzat amb ✓ verd
```

## 🎨 Optimització per Tablets

L'app inclou diverses optimitzacions específiques per tablets:

- **Touch Targets**: Mínim 44x44px per a tots els botons
- **Suport de Gestos**: Interaccions tàctils natives amb Framer Motion
- **Viewport Lock**: Evita zoom no desitjat
- **Tap Highlight**: Desactivat per UX més neta
- **Rendiment**: Animacions accelerades per GPU
- **Fonts Grans**: text-2xl a text-5xl per facilitar lectura

## 💾 Persistència de Dades

Tot s'emmagatzema localment amb **localStorage**:

### Zustand Store (Global)
- Clau: `game-storage`
- Contingut: usuari (nom, edat), assignatura actual, progrés general

### Per Exercici
- Clau: `exercise-answers-{exerciseId}`
- Contingut: respostes de l'usuari

### Per Conjunt
- Clau: `exercise-corrections-{setId}`
- Contingut: correccions (correcte/incorrecte) per cada exercici

**Avantatges**:
- ✅ Privacitat: cap dada surt del dispositiu
- ✅ Rendiment: accés instantani
- ✅ Offline: funciona sense internet
- ✅ Zero cost d'infraestructura

Veure [STORAGE.md](./docs/STORAGE.md) per detalls complets.

## 🧩 Afegir Nous Exercicis

Per afegir un nou tipus d'exercici:

1. **Definir interfície** a `src/lib/exercises/types.ts`
2. **Crear component** a `src/components/exercises/`
3. **Afegir validació** a `ExerciseViewer.tsx`
4. **Afegir render case** a `ExerciseViewer.tsx`
5. **Crear dades** a `src/lib/exercises/matematiques.ts`

Veure la [guia detallada a EXERCISES.md](./docs/EXERCISES.md#afegir-un-nou-tipus-dexercici).

## 📦 Packages del Monorepo

### `@joscola/ui`
Biblioteca de components compartits:
- `Button`: Botó animat amb variants (primary, success, danger, secondary)
- `Card`: Container amb animacions d'entrada
- Tots els components són accessibles i tablet-optimized

### `@joscola/typescript-config`
Configuracions TypeScript compartides:
- `base.json`: Config base per tots els packages
- `nextjs.json`: Config específica per Next.js
- `react-library.json`: Config per biblioteques React

### `@joscola/eslint-config`
Configuracions ESLint per mantenir qualitat de codi

## 🔧 Tips de Desenvolupament

- Usa `pnpm dev` per iniciar tots els apps en mode watch
- Turbo cacheja builds per a execucions més ràpides
- Afegeix nous packages amb `pnpm init` a la carpeta apropiada
- Tots els packages comparteixen la mateixa versió de dependències

## 📱 Provar en Tablet

1. Inicia el servidor de dev: `pnpm dev`
2. Troba la teva IP local:
   - Mac: `ipconfig getifaddr en0`
   - Windows: `ipconfig`
3. Accedeix des de la tablet: `http://LA_TEVA_IP:3000`

## 🐛 Debugging

### Inspeccionar localStorage

**Chrome DevTools**:
1. F12 → Application tab
2. Storage → Local Storage → http://localhost:3000

**Consola**:
```javascript
// Veure totes les claus
Object.keys(localStorage)

// Veure dades específiques
localStorage.getItem('game-storage')
localStorage.getItem('exercise-answers-25-1')

// Netejar tot
localStorage.clear()
```

Veure [STORAGE.md](./docs/STORAGE.md#debugging) per més detalls.

## 🔮 Pròximes Funcionalitats

### Curt Termini
- [ ] Més tipus d'exercicis (magic-square, number-search, number-line, estimation)
- [ ] Més exercicis per als conjunts existents
- [ ] Millores d'animacions i transicions

### Mig Termini
- [ ] Assignatura de Català
- [ ] Assignatura de Castellà
- [ ] Assignatura d'Anglès
- [ ] Sistema de recompenses i gamificació
- [ ] Estadístiques i gràfics de progrés

### Llarg Termini
- [ ] Mode multijugador local
- [ ] Exportació/importació de progressos
- [ ] Més nivells educatius (2n, 3r primària)
- [ ] Modes de dificultat ajustables
- [ ] Sincronització cloud opcional

## 📄 Llicència

MIT

---

**Creat amb**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Zustand
**Versió**: 1.0.0
**Data**: Novembre 2025
