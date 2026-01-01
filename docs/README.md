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
- 17 tipus d'exercicis implementats amb exemples
- Component ExerciseViewer i les seves responsabilitats
- Flux de correcció i validació amb gamificació
- Sistema de navegació entre exercicis
- Guia pas a pas per afegir nous tipus d'exercicis
- Millors pràctiques, touch support i patrons

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
- Exercicis de **matemàtiques**, **català** i **castellà**
- **Persistència local** sense necessitat de backend
- **PWA** amb suport offline

### Funcionalitats Actuals

✅ Onboarding amb nom, edat i selecció d'avatar
✅ Selecció d'assignatura (Matemàtiques, Català, Castellà actius)
✅ 17 tipus d'exercicis diferents
✅ Sistema de correcció amb feedback visual i sons
✅ Navegació entre exercicis
✅ Persistència de respostes a localStorage
✅ Indicadors de progrés
✅ Animacions amb Framer Motion
✅ **Sistema de gamificació**: Estrelles per exercici, medalles per conjunt
✅ **Pàgina de perfil** amb estadístiques i medalles
✅ **PWA** amb Service Worker per a funcionalitat offline
✅ **Touch support complet** per a tablets

### Tipus d'Exercicis Implementats (17 tipus)

#### Matemàtiques (12 tipus)
1. **number-sequence**: Seqüències numèriques (endavant/enrere, diferents passos)
2. **counting**: Comptar objectes (grid/scattered/groups)
3. **addition-three**: Suma de tres números amb representació visual
4. **subtraction-jumps**: Resta saltant pel 10 amb línia numèrica
5. **addition-jumps**: Suma saltant pel 10 amb línia numèrica
6. **grid-100**: Graella 1-100 amb números perduts
7. **number-order**: Ordenar nombres (smallest/largest/order-asc/order-desc)
8. **train-position**: Posicions en un tren amb túnels
9. **number-pattern**: Patrons numèrics (cross/line/square)
10. **magic-square**: Quadrats màgics 2x2 i 3x3
11. **number-line**: Recta numèrica interactiva
12. **estimation**: Estimació amb diners

#### Llengua (5 tipus)
13. **reading-speed**: Velocitat lectora (60 paraules en 2 minuts)
14. **calligraphy**: Cal·ligrafia amb canvas per dibuixar
15. **word-search**: Sopa de lletres amb selecció tàctil
16. **pictogram-crossword**: Crucigrama amb pictogrames/emojis
17. **number-search**: (Definit però no implementat visualment)

### Conjunts d'Exercicis Disponibles

#### Matemàtiques
- 🔢 **COMPTEM** (set-21) - Comptar objectes
- 📊 **ORDENA NOMBRES** (set-22) - Seqüències numèriques
- ➕ **SUMEM 3 NOMBRES** (set-23) - Suma de tres números
- ➖ **RESTEM SALTANT** (set-24) - Resta amb salts
- 🦘 **SUMEM SALTANT** (set-25) - Suma amb salts pel 10
- ⬇️ **RESTEM SALTANT PEL 10** (set-26) - Resta amb salts pel 10
- 📐 **GRAELLA 1-100** (set-30) - Graella numèrica
- 🚂 **EL TREN DELS NOMBRES** (set-31) - Posicions en un tren
- 🔢 **LA RECTA NUMÈRICA** (set-32) - Recta numèrica
- 🔷 **PATRONS NUMÈRICS** (set-33) - Patrons en creu/línia/quadrat
- ⬜ **QUADRATS MÀGICS** (set-34) - Quadrats màgics

#### Català
- 📖 **VELOCITAT LECTORA** (set-50 a set-58) - 9 fases de lectura
- ✍️ **CAL·LIGRAFIA** (set-60 a set-65) - Lletres minúscules i majúscules

#### Castellà
- 📖 **VELOCIDAD LECTORA** (set-70 a set-78) - 9 fases de lectura
- ✍️ **CALIGRAFÍA** (set-80 a set-85) - Letras minúsculas y mayúsculas
- 🔍 **SOPA DE LETRAS** (set-86) - Soques de lletres
- 🧩 **CRUCIGRAMA** (set-87 a set-88) - Crucigrames amb pictogrames

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

### 4. Feedback Visual i Sonor
- Animacions alegres amb Framer Motion
- Colors brillants
- Emojis representatius
- Missatges clars de correcte/incorrecte
- Sons d'èxit i error (Web Audio API)

### 5. Persistència Local
- Tot es guarda al dispositiu
- No cal connexió a internet
- Privacitat total

### 6. Gamificació
- ⭐ Estrelles per cada exercici correcte (primera vegada)
- 🏅 Medalles per completar conjunts d'exercicis
- 👤 Perfil amb estadístiques i totes les medalles
- 🎨 Avatars personalitzables

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
- **Zustand**: Gestió d'estat global amb persist middleware
- **Framer Motion**: Animacions
- **Tailwind CSS**: Estils
- **localStorage**: Persistència
- **Web Audio API**: Sons
- **PWA**: Service Worker per offline

## 🔄 Flux de l'Usuari

```
1. ONBOARDING
   Introduir nom, edat i seleccionar avatar
   ↓
2. SELECCIÓ D'ASSIGNATURA
   Triar Matemàtiques, Català o Castellà
   (Anglès pròximament)
   ↓
3. GRAELLA D'EXERCICIS
   Veure tots els conjunts disponibles
   Indicadors de progrés (estrelles i medalles)
   ↓
4. EXERCICIS INDIVIDUALS
   Completar exercici → CORREGIR
   Feedback animat amb sons (BEN FET! / TORNA-HO A INTENTAR!)
   Navegació: ← ANTERIOR | SEGÜENT →
   Opció d'ESBORRAR respostes
   ↓
5. GUANYAR RECOMPENSES
   ⭐ Estrella per cada exercici correcte
   🏅 Medalla al completar el conjunt
   ↓
6. PERFIL
   Veure estadístiques, estrelles i medalles
```

## 📦 Persistència de Dades

### localStorage

Totes les dades es guarden localment:

- **game-storage**: Dades globals (usuari, assignatura, progrés, gamificació)
- **exercise-answers-{id}**: Respostes per cada exercici
- **exercise-corrections-{setId}**: Correccions per conjunt

Veure [STORAGE.md](./STORAGE.md) per detalls complets.

### Gamificació

- **stars**: Estrelles totals acumulades
- **medals**: Array de medalles amb setId, emoji i data
- **avatar**: Avatar seleccionat per l'usuari

## 🧩 Afegir Nous Exercicis

### Pas a Pas

1. Definir interfície a `types.ts`
2. Crear component a `components/exercises/`
3. Afegir validació a `ExerciseViewer.tsx`
4. Afegir render case a `ExerciseViewer.tsx`
5. Crear dades a `matematiques.ts`, `catala.ts` o `castellano.ts`

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
- [ ] Assignatura d'Anglès
- [ ] Més exercicis per als conjunts existents
- [ ] Millores d'animacions i feedback

### Mig Termini
- [ ] Mode multijugador local
- [ ] Exportació de progressos per a pares/professors

### Llarg Termini
- [ ] Més nivells educatius
- [ ] Modes de dificultat
- [ ] Sincronització entre dispositius

## 📄 Llicència

[Definir llicència]

## 👥 Contribuir

[Definir guia de contribució]

## 📞 Contacte

[Definir informació de contacte]

---

**Documentació actualitzada**: Gener 2026
**Versió**: 2.0.0
