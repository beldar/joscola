# DOCUMENTACIÓ DE JOSCOLA

Benvingut a la documentació del projecte Joscola, una aplicació web educativa per a tablets dissenyada per ajudar nens de primer de primària a practicar exercicis escolars.

## 📚 Índex de Documentació

### [ARCHITECTURE.md](./ARCHITECTURE.md)
Visió general del projecte, estructura del monorepo, stack tecnològic, components principals i flux de l'aplicació.

**Contingut**:
- Stack tecnològic i eines
- Estructura del monorepo
- Principis de disseny (català, majúscules, tablet-optimized)
- Components principals (Onboarding, SubjectSelector, ExerciseSetGrid, ExerciseViewer)
- Flux complet de l'aplicació
- Gestió d'estat amb Zustand
- Configuració de desenvolupament

### [EXERCISES.md](./EXERCISES.md)
Documentació completa del sistema d'exercicis, incloent tots els tipus implementats, arquitectura, validació i com afegir nous tipus.

**Contingut**:
- Estructura de dades (ExerciseSet, Exercise)
- 6 tipus d'exercicis implementats amb exemples
- Component ExerciseViewer i les seves responsabilitats
- Flux de correcció i validació
- Sistema de navegació entre exercicis
- Guia pas a pas per afegir nous tipus d'exercicis
- Millors pràctiques i patrons

### [STORAGE.md](./STORAGE.md)
Sistema de persistència utilitzant localStorage, incloent estratègies d'emmagatzematge, funcions helpers i debugging.

**Contingut**:
- Dos sistemes: Zustand Store + localStorage per exercicis
- Funcions de save/load/delete
- Flux de dades complet
- Gestió de memòria i límits
- Avantatges i desavantatges de localStorage
- Debugging i inspeccionar dades
- Consideracions futures (exportació, sincronització)

## 🚀 Inici Ràpid

### Instal·lació

```bash
git clone <repository-url>
cd joscola
pnpm install
```

### Desenvolupament

```bash
pnpm dev
```

Obre http://localhost:3000 al navegador.

### Build per a Producció

```bash
pnpm build
```

## 📋 Resum del Projecte

### Objectius

- Aplicació educativa per a nens de 6-7 anys (1r de primària)
- Interfície en **català** amb **tots els textos en MAJÚSCULES**
- Optimitzada per a **tablets** amb interacció tàctil
- Exercicis de **matemàtiques** (amb més assignatures planejades)
- **Persistència local** sense necessitat de backend

### Funcionalitats Actuals

✅ Onboarding amb nom i edat
✅ Selecció d'assignatura (Matemàtiques actiu)
✅ 7 conjunts d'exercicis de matemàtiques
✅ 6 tipus d'exercicis diferents
✅ Sistema de correcció amb feedback visual
✅ Navegació entre exercicis
✅ Persistència de respostes a localStorage
✅ Indicadors de progrés
✅ Animacions amb Framer Motion

### Tipus d'Exercicis Implementats

1. **number-sequence**: Seqüències numèriques (endavant/enrere, diferents passos)
2. **addition-three**: Suma de tres números amb representació visual
3. **subtraction-jumps**: Resta saltant pel 10 amb línia numèrica
4. **addition-jumps**: Suma saltant pel 10 amb línia numèrica
5. **counting**: Comptar objectes (grid/scattered/groups)
6. **grid-100**: Graella 1-100 amb números perduts

### Conjunts d'Exercicis Disponibles

- 🔢 **COMPTEM** (21) - Comptar objectes
- 📊 **ORDENA NOMBRES** (22) - Seqüències numèriques
- ➕ **SUMEM 3 NOMBRES** (23) - Suma de tres números
- ➖ **RESTEM SALTANT** (24) - Resta amb salts
- 🦘 **SUMEM SALTANT** (25) - Suma amb salts pel 10
- ⬇️ **RESTEM SALTANT PEL 10** (26) - Resta amb salts pel 10
- 📐 **GRAELLA 1-100** (30) - Graella numèrica

## 🎨 Principis de Disseny

### 1. Llengua: Català
Tot el contingut està en català, des de la interfície fins als exercicis.

### 2. Tipografia: MAJÚSCULES
Tots els textos estan en majúscules per facilitar la lectura als primers lectors.

### 3. Optimització Tablet
- Botons grans (mínim 44px)
- Textos grans (2xl-5xl)
- Touch-friendly
- No zoom no desitjat

### 4. Feedback Visual
- Animacions alegres
- Colors brillants
- Emojis representatius
- Missatges clars de correcte/incorrecte

### 5. Persistència Local
- Tot es guarda al dispositiu
- No cal connexió a internet
- Privacitat total

## 🏗️ Arquitectura

### Monorepo amb Turborepo

```
joscola/
├── apps/
│   └── game/              # Aplicació Next.js principal
├── packages/
│   ├── ui/                # Components compartits
│   ├── typescript-config/ # Configs TS
│   └── eslint-config/     # Configs ESLint
└── docs/                  # Documentació
```

### Stack

- **Framework**: Next.js 15 (App Router)
- **React**: 19
- **TypeScript**: Per tipus segur
- **Zustand**: Gestió d'estat global
- **Framer Motion**: Animacions
- **Tailwind CSS**: Estils
- **localStorage**: Persistència

## 🔄 Flux de l'Usuari

```
1. ONBOARDING
   Introduir nom i edat
   ↓
2. SELECCIÓ D'ASSIGNATURA
   Triar Matemàtiques (altres pròximament)
   ↓
3. GRAELLA D'EXERCICIS
   Veure tots els conjunts disponibles
   Indicadors de progrés (✓ verd)
   ↓
4. EXERCICIS INDIVIDUALS
   Completar exercici → CORREGIR
   Feedback animat (BEN FET! / TORNA-HO A INTENTAR!)
   Navegació: ← ANTERIOR | SEGÜENT →
   Opció d'ESBORRAR respostes
   ↓
5. SEGÜENT EXERCICI
   Repetir fins completar tots
   ↓
6. TORNAR A LA GRAELLA
   Veure progrés actualitzat
```

## 📦 Persistència de Dades

### localStorage

Totes les dades es guarden localment:

- **game-storage**: Dades globals (usuari, assignatura, progrés)
- **exercise-answers-{id}**: Respostes per cada exercici
- **exercise-corrections-{setId}**: Correccions per conjunt

Veure [STORAGE.md](./STORAGE.md) per detalls complets.

## 🧩 Afegir Nous Exercicis

### Pas a Pas

1. Definir interfície a `types.ts`
2. Crear component a `components/exercises/`
3. Afegir validació a `ExerciseViewer.tsx`
4. Afegir render case a `ExerciseViewer.tsx`
5. Crear dades a `matematiques.ts`

Veure [EXERCISES.md](./EXERCISES.md) per una guia detallada.

## 🐛 Debugging

### localStorage Inspector

Chrome DevTools → Application → Local Storage

```javascript
// Consola del navegador
Object.keys(localStorage)  // Veure totes les claus
localStorage.clear()        // Netejar tot
```

### React DevTools

Per inspeccionar estat de components i Zustand store.

## 🔮 Pròximes Funcionalitats

### Curt Termini
- [ ] Més tipus d'exercicis (magic-square, number-search, number-line, estimation)
- [ ] Més exercicis per als conjunts existents
- [ ] Millores d'animacions i feedback

### Mig Termini
- [ ] Assignatura de Català
- [ ] Assignatura de Castellà
- [ ] Assignatura d'Anglès
- [ ] Sistema de recompenses/gamificació
- [ ] Estadístiques de progrés

### Llarg Termini
- [ ] Mode multijugador local
- [ ] Exportació de progressos per a pares/professors
- [ ] Més nivells educatius
- [ ] Modes de dificultat

## 📄 Llicència

[Definir llicència]

## 👥 Contribuir

[Definir guia de contribució]

## 📞 Contacte

[Definir informació de contacte]

---

**Documentació generada**: Novembre 2025
**Versió**: 1.0.0
