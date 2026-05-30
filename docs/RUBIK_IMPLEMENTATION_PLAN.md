# PLA D'IMPLEMENTACIÓ — ASSIGNATURA "RUBIK"

Objectiu: afegir una nova assignatura **RUBIK** a JoEscola que ensenyi de
manera interactiva l'idioma de notació del cub (R, L, U, D, F, B i els seus
invertits R', L'...) i el practiqui amb exercicis clicables a la tablet.
El contingut surt del quadern `Idioma_del_cub_de_Rubik.pdf`.

---

## 1. Com encaixa amb l'arquitectura actual

Afegir una assignatura nova toca exactament els mateixos punts que tenen
"català" o "castellà". Els punts d'integració són:

| Fitxer | Què fa avui | Què cal fer |
|---|---|---|
| `src/components/SubjectSelector.tsx` | Array `subjects[]` amb les targetes | Afegir la targeta RUBIK (activa) |
| `src/app/page.tsx` | Enruta `currentSubject` → `ExerciseSetGrid` | Afegir cas `"rubik"` |
| `src/components/ExerciseSetGrid.tsx` | Tria `exerciseSets` segons subject | Afegir `rubik` + títol de capçalera |
| `src/components/ExerciseViewer.tsx` | Tria sets, `validateAnswer`, `renderExercise` | Afegir sets + casos nous |
| `src/lib/exercises/types.ts` | Unió `ExerciseType` i `Exercise` | Afegir tipus nous |
| `src/lib/exercises/rubik.ts` | — (no existeix) | **Nou**: dades dels exercicis |
| `src/lib/store.ts` | `isExerciseSetComplete` importa tots els sets | Afegir import de `rubikExerciseSets` |
| `src/components/exercises/Rubik*.tsx` | — | **Nous** components interactius |

> Nota: avui hi ha **3 assignatures actives** (matemàtiques, català, castellà)
> i "anglès" està a `disabled: true`. Rubik serà la 4a targeta activa.

---

## 2. El cor visual: component `RubikCube`

Tot el material depèn d'un dibuix clar del cub amb una cara ressaltada i una
fletxa de direcció. Ja tenim la lògica de projecció validada (al generador del
PDF). Cal **portar-la a un component React que dibuixi SVG inline** (com fan
`NumberLineExercise` o `TrainPositionExercise`), no PNGs estàtics, perquè
escali net a qualsevol mida de tablet i es pugui acolorir/animar.

**Fitxer nou:** `src/components/exercises/RubikCube.tsx`

```tsx
// Projecció obliqua: x→dreta, y→amunt, z→cap a l'espectador
const S = 46;
const EX = [1, 0], EY = [0, -1], EZ = [-0.46, 0.46];
const proj = (x:number,y:number,z:number):[number,number] => [
  S*(x*EX[0] + y*EY[0] + z*EZ[0]),
  S*(x*EX[1] + y*EY[1] + z*EZ[1]),
];
```

Tres cares visibles (3×3 cada una): **F** (davant, z=3), **U** (dalt, y=3),
**R** (dreta, x=3). Es pinten en ordre U → R → F perquè el davant tapi bé.

Capes que es ressalten (groc) per cada lletra:
- `R`: cara dreta sencera + columna dreta del davant + columna dreta de dalt.
- `L`: columna esquerra del davant + columna esquerra de dalt (cara L oculta).
- `U`: cara de dalt sencera + fila superior del davant + fila superior de la dreta.
- `D`: fila inferior del davant + fila inferior de la dreta (cara D oculta).
- `F`: cara del davant sencera.
- `B`: fila del darrere de dalt + columna del darrere de la dreta (cara B oculta).

Fletxa de rotació (arc el·líptic sobre el pla de la cara). Base per cara
(vector "dreta vist des de fora" A i "avall vist des de fora" Dn, en coords cub):

| Cara | A | Dn |
|---|---|---|
| F | (1,0,0) | (0,-1,0) |
| B | (-1,0,0) | (0,-1,0) |
| R | (0,0,-1) | (0,-1,0) |
| L | (0,0,1) | (0,-1,0) |
| U | (1,0,0) | (0,0,1) |
| D | (1,0,0) | (0,0,-1) |

L'arc va de −50° a +230° (sentit horari vist des de fora) per a la lletra sola,
i invertit (+230° → −50°) per a la versió amb apòstrof. Punta de fletxa amb la
tangent al final. Aquesta lògica ja està verificada visualment al PDF.

**Props proposades:**
```tsx
interface RubikCubeProps {
  move?: "R"|"R'"|"L"|"L'"|"U"|"U'"|"D"|"D'"|"F"|"F'"|"B"|"B'";
  showArrow?: boolean;   // amaga la fletxa per als reptes "endevina"
  showLabels?: boolean;  // mostra U/F/R a les cares (per a la intro)
  size?: number;         // amplada en px
}
```

---

## 3. Tipus d'exercici nous (mapats des del PDF)

Es proposen **4 tipus**, suficients per cobrir tot el quadern:

### 3.1 `rubik-info` — Explicacions (Portada, "Com girar", Diccionari)
Pantalla de lectura amb un o més cubs + text + botó **"ENTÈS! ✓"**. No es
corregeix; en tocar el botó es marca completada (com fa la cal·ligrafia, que
té el seu propi botó d'acabar). Atorga estrella.

```ts
interface RubikInfoExercise extends BaseExercise {
  type: "rubik-info";
  blocks: Array<{ move?: Move; text: string }>; // diagrama opcional + explicació
}
```

### 3.2 `rubik-letter-quiz` — "Quin moviment és?" (Joc 1)
Mostra un cub amb cara ressaltada i fletxa (`showArrow`), i 3–4 botons amb
lletres. El nen toca la correcta.

```ts
interface RubikLetterQuizExercise extends BaseExercise {
  type: "rubik-letter-quiz";
  move: Move;          // resposta correcta
  options: Move[];     // botons (inclou la correcta)
}
```
**Validació:** `answers.get("answer") === exercise.move`.

### 3.3 `rubik-match` — Diccionari interactiu (relaciona)
3–4 cubs a l'esquerra i 3–4 lletres barrejades a la dreta. El nen toca un cub i
després la lletra per aparellar-los.

```ts
interface RubikMatchExercise extends BaseExercise {
  type: "rubik-match";
  pairs: Move[];   // p.ex. ["R","U","F"]
}
```
**Validació:** cada `answers.get("match-<move>") === move`.

### 3.4 `rubik-sequence-tap` — "Llegeix i fes" (Joc 2)
Mostra una seqüència escrita (p.ex. `R U R' U'`) i una filera de botons de
moviment. El nen toca els botons **en ordre** per reproduir-la (substitueix el
cub físic per validació digital; el text pot recordar "fes-ho també amb el cub").

```ts
interface RubikSequenceTapExercise extends BaseExercise {
  type: "rubik-sequence-tap";
  sequence: Move[];     // ordre correcte
  buttons: Move[];      // moviments disponibles
}
```
**Validació:** la llista tocada (guardada com a string CSV a `answers.get("taps")`)
coincideix exactament amb `sequence`.

> "Joc 3 · Segueix la peça" del PDF demana seguir físicament una peça i és
> difícil de validar sense un cub virtual complet. Proposta: deixar-lo per a una
> **fase 2** (cub 3D interactiu) o convertir-lo en `rubik-info` amb la pista.

---

## 4. Contingut concret (`rubik.ts`)

Estructura: `rubikExerciseSets: ExerciseSet[]`. Proposta de 3 grups:

1. **APRÈN LES LLETRES** (icona 🧩) — `rubik-info` portada + `rubik-info` "com
   girar" + 6 `rubik-info` (un per cara, amb el diagrama i la pista del
   diccionari, p.ex. *"R: la franja dreta del davant PUJA"*).
2. **GIRS AL REVÉS** (icona 🔄) — `rubik-info` explicant l'apòstrof + diccionari
   dels 6 invertits.
3. **A JUGAR!** (icona 🎮) — barreja de `rubik-letter-quiz`, `rubik-match` i
   `rubik-sequence-tap` (escalfament `U U U U`, "puja i baixa" `R U R'`, "el
   balancí" `R U R' U'`).

Tots els títols i instruccions en MAJÚSCULES (convenció del projecte).

---

## 5. Canvis fitxer per fitxer

**`types.ts`**
- Afegir a `ExerciseType`: `"rubik-info" | "rubik-letter-quiz" | "rubik-match" | "rubik-sequence-tap"`.
- Definir un alias `type Move = "R"|"R'"|...` i les 4 interfaces.
- Afegir-les a la unió `Exercise`.

**`lib/exercises/rubik.ts`** (nou) — exporta `rubikExerciseSets`.

**`components/exercises/RubikCube.tsx`** (nou) — renderitzador SVG (secció 2).

**`components/exercises/RubikInfoExercise.tsx`**,
**`RubikLetterQuizExercise.tsx`**, **`RubikMatchExercise.tsx`**,
**`RubikSequenceTapExercise.tsx`** (nous) — segueixen el patró
`{ exercise, answers, onAnswer }` dels components existents.

**`ExerciseViewer.tsx`**
- `import { rubikExerciseSets } from "@/lib/exercises/rubik"`.
- Estendre la tria de `exerciseSets` (a `ExerciseViewer` i `ExerciseSetGrid`) amb `subject === "rubik"`.
- Afegir els 4 casos a `validateAnswer` (secció 3).
- Afegir els 4 casos a `renderExercise`.
- `rubik-info` necessita un botó d'acabar propi (com `isCalligraphy`): afegir una
  bandera `isRubikInfo` perquè no mostri "CORREGIR" sinó "ENTÈS! ✓".

**`ExerciseSetGrid.tsx`** — afegir `rubik` a la tria i al títol de capçalera.

**`page.tsx`** — afegir `{user && currentSubject === "rubik" && <ExerciseSetGrid subject="rubik" />}` i treure'l del cas "not implemented".

**`SubjectSelector.tsx`** — afegir `{ id: "rubik", name: "RUBIK", icon: "🧩", color: "from-red-400 to-orange-600" }`.

**`store.ts`** — a `isExerciseSetComplete`, afegir `const { rubikExerciseSets } = require('./exercises/rubik')` i incloure'l a `allExerciseSets`.

---

## 6. Fases recomanades

1. **Fonament**: `RubikCube.tsx` + tipus a `types.ts`. (Verificar el dibuix amb
   una pàgina de prova / Playwright, com fan els altres exercicis.)
2. **Assignatura visible**: SubjectSelector + page + ExerciseSetGrid + store, amb
   un `rubik.ts` mínim (1 grup `rubik-info`). Confirmar que es navega i es completa.
3. **Exercicis interactius**: afegir `rubik-letter-quiz`, `rubik-match`,
   `rubik-sequence-tap` + validacions + render.
4. **Contingut complet**: omplir els 3 grups amb tot el material del PDF.
5. (Opcional, fase 2) Cub 3D interactiu per a "Segueix la peça".

---

## 7. Riscos i decisions obertes

- **Validació sense cub físic**: `rubik-sequence-tap` valida l'ordre tocat, no
  el cub real. És el compromís raonable per a tablet.
- **`rubik-info` i el flux de correcció**: el `ExerciseViewer` està pensat per
  corregir respostes. Les pantalles d'explicació necessiten el tractament
  especial del botó (ja hi ha precedent amb cal·ligrafia i lectura).
- **Accents/SVG**: el text dins l'SVG del cub és mínim; el text llarg va en HTML
  Tailwind, sense problemes d'accents.
- **Mida a tablet**: el cub és SVG escalable; fixar una amplada màxima i centrar,
  com fa `NumberLineExercise`.
