# SISTEMA DE PERSISTÈNCIA

## Visió General

Joscola utilitza **localStorage** del navegador per emmagatzemar totes les dades de manera local. No hi ha backend ni base de dades externa. Tot es guarda al dispositiu de l'usuari.

## Estratègia d'Emmagatzematge

### Dos Sistemes de Persistència

#### 1. Zustand Store (Dades Globals)

**Clau**: `game-storage`

**Dades emmagatzemades**:
```typescript
{
  state: {
    user: {
      name: string;
      age: number;
    } | null,
    currentSubject: string | null,
    exerciseProgress: Array<{
      exerciseSetId: string;
      exerciseId: string;
      completed: boolean;
      attempts: number;
      lastAttempt: Date;
    }>
  },
  version: 0
}
```

**Quan s'actualitza**:
- En completar l'onboarding (setUser)
- En seleccionar una assignatura (setSubject)
- En completar correctament un exercici (markExerciseComplete)

**Middleware**: `persist` de Zustand amb configuració per defecte

**Exemple real**:
```json
{
  "state": {
    "user": {
      "name": "JOAN",
      "age": 6
    },
    "currentSubject": "matematiques",
    "exerciseProgress": [
      {
        "exerciseSetId": "set-21",
        "exerciseId": "21-1",
        "completed": true,
        "attempts": 1,
        "lastAttempt": "2025-11-08T12:30:00.000Z"
      }
    ]
  },
  "version": 0
}
```

#### 2. Exercise Answers & Corrections (Dades d'Exercicis)

**Claus individuals per exercici**:
- `exercise-answers-{exerciseId}`: Respostes de l'usuari
- `exercise-corrections-{setId}`: Correccions del conjunt

**Estructura d'Answers**:
```json
{
  "result": 15,
  "step-1": 10,
  "pos-2": 12
}
```

**Estructura de Corrections**:
```json
{
  "21-1": true,
  "21-2": false,
  "21-3": true
}
```

**Exemple real**:

`exercise-answers-25-1` (Addition Jumps: 8 + 7):
```json
{
  "result": 15,
  "step-1": 10
}
```

`exercise-corrections-set-25`:
```json
{
  "25-1": true,
  "25-2": true,
  "25-3": false
}
```

## Funcions d'Emmagatzematge

### Save Answers

```typescript
const saveAnswersToStorage = (exerciseId: string, answers: Map<string, number | string>) => {
  if (typeof window !== "undefined") {
    const obj = Object.fromEntries(answers);
    localStorage.setItem(STORAGE_KEY_PREFIX + exerciseId, JSON.stringify(obj));
  }
};
```

**Quan s'executa**: En prémer "CORREGIR"

**Propòsit**: Guardar les respostes de l'usuari per si torna més tard

### Load Answers

```typescript
const loadAnswersFromStorage = (exerciseId: string): Map<string, number | string> => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY_PREFIX + exerciseId);
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        return new Map(Object.entries(obj));
      } catch (e) {
        return new Map();
      }
    }
  }
  return new Map();
};
```

**Quan s'executa**:
- En carregar un exercici (useEffect)
- En navegar entre exercicis (handleNext, handlePrevious)

**Propòsit**: Recuperar respostes guardades prèviament

### Save Corrections

```typescript
const saveCorrectionsToStorage = (setId: string, corrections: Map<string, boolean>) => {
  if (typeof window !== "undefined") {
    const obj = Object.fromEntries(corrections);
    localStorage.setItem(STORAGE_KEY_CORRECTIONS + setId, JSON.stringify(obj));
  }
};
```

**Quan s'executa**:
- En prémer "CORREGIR"
- En prémer "ESBORRAR"

**Propòsit**: Guardar si cada exercici està correcte o incorrecte

### Load Corrections

```typescript
const loadCorrectionsFromStorage = (setId: string): Map<string, boolean> => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY_CORRECTIONS + setId);
    if (stored) {
      try {
        const obj = JSON.parse(stored);
        return new Map(Object.entries(obj).map(([k, v]) => [k, v as boolean]));
      } catch (e) {
        return new Map();
      }
    }
  }
  return new Map();
};
```

**Quan s'executa**: En muntar el component ExerciseViewer (useEffect)

**Propòsit**: Recuperar l'estat de correccions per mostrar indicadors verds

### Delete Answers

```typescript
const deleteAnswersFromStorage = (exerciseId: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY_PREFIX + exerciseId);
  }
};
```

**Quan s'executa**: En prémer "ESBORRAR"

**Propòsit**: Netejar respostes guardades per començar de nou

## Flux de Dades

### Completar un Exercici

```
1. Usuari omple camps
   ↓
2. Actualització d'estat local: setAnswers(newMap)
   ↓
3. Usuari prem "CORREGIR"
   ↓
4. validateAnswer() → true/false
   ↓
5. SI CORRECTE:
   - saveAnswersToStorage(exerciseId, answers)
   - saveCorrectionsToStorage(setId, corrections)
   - markExerciseComplete() → actualitza Zustand → guarda a localStorage

   SI INCORRECTE:
   - saveAnswersToStorage(exerciseId, answers)  [per si vol continuar més tard]
   - saveCorrectionsToStorage(setId, corrections)
```

### Navegar a un Exercici

```
1. Usuari clica "SEGÜENT" o "ANTERIOR" o selecciona de la graella
   ↓
2. setCurrentIndex(newIndex)
   ↓
3. useEffect detecta canvi de currentExercise.id
   ↓
4. loadAnswersFromStorage(exerciseId)
   ↓
5. setAnswers(loadedAnswers)
   ↓
6. Component renderitza amb respostes prèvies (si n'hi ha)
```

### Tornar a la Graella

```
1. Usuari clica "← TORNAR"
   ↓
2. ExerciseSetGrid es renderitza
   ↓
3. Per cada exercici set:
   - Comprova corrections a localStorage
   - Mostra ✓ verd si tots els exercicis estan correctes
```

## Gestió de la Memòria

### Límits de localStorage

- **Quota típica**: 5-10MB per origin
- **Dades de Joscola**: ~1-2KB per exercici completat
- **Capacitat estimada**: Centenars d'exercicis sense problemes

### Neteja

**Manual**: Botó "ESBORRAR" per exercicis individuals

**Automàtica**: No implementada (podria afegir-se per netejar exercicis molt antics)

### Error Handling

Totes les funcions tenen try-catch per gestionar:
- JSON malformat
- localStorage deshabilitat
- Quota excedida (poc probable)

Si hi ha error, retornen valors per defecte (Map buida).

## Avantatges d'aquesta Aproximació

### ✅ Pros

1. **Privacitat**: Totes les dades són locals, cap telemetria
2. **Rendiment**: Accés instantani, sense latència de xarxa
3. **Offline**: Funciona sense connexió a internet
4. **Simplicitat**: No cal backend, base de dades, autenticació
5. **Cost**: Zero infraestructura
6. **RGPD**: Cap dada personal surt del dispositiu

### ❌ Contres

1. **No portable**: Dades lligades al navegador/dispositiu
2. **Esborrable**: L'usuari pot netejar localStorage
3. **No compartible**: No es pot sincronitzar entre dispositius
4. **No backup**: Si es perd el dispositiu, es perden dades

## Consideracions Futures

### Exportació/Importació

Es podria afegir funcionalitat per:

```typescript
// Exportar totes les dades a JSON
const exportData = () => {
  const data = {
    user: useGameStore.getState().user,
    progress: useGameStore.getState().exerciseProgress,
    answers: {},
    corrections: {}
  };

  // Exportar tots els answers de localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('exercise-')) {
      data[key] = localStorage.getItem(key);
    }
  }

  return JSON.stringify(data);
};

// Importar dades des de JSON
const importData = (jsonString: string) => {
  const data = JSON.parse(jsonString);
  // Restaurar a Zustand i localStorage
};
```

### Sincronització Cloud (Opcional)

Si en el futur es vol sincronitzar:
- Utilitzar Firebase Realtime Database
- Supabase
- Backend propi amb API REST

Però mantenir localStorage com a cache local.

## Debugging

### Inspeccionar localStorage

**Chrome DevTools**:
1. F12 → Application tab
2. Storage → Local Storage → http://localhost:3000
3. Veure totes les claus i valors

**Console**:
```javascript
// Veure totes les claus
Object.keys(localStorage)

// Veure una clau específica
localStorage.getItem('exercise-answers-25-1')

// Netejar tot
localStorage.clear()

// Netejar només exercicis
Object.keys(localStorage)
  .filter(key => key.startsWith('exercise-'))
  .forEach(key => localStorage.removeItem(key))
```

### Formats Esperats

Totes les dades es guarden com a strings JSON. Els Map es converteixen a objectes:

```typescript
// Map original
new Map([["result", 15], ["step-1", 10]])

// JSON guardat
'{"result":15,"step-1":10}'

// Al carregar
JSON.parse(stored) // { result: 15, step-1: 10 }
new Map(Object.entries(obj)) // Map(2) { "result" => 15, "step-1" => 10 }
```

## Claus Completes de localStorage

### Zustand Store
- `game-storage`: Dades globals de l'aplicació

### Per Exercici
- `exercise-answers-21-1`: Respostes exercici "Comptem" #1
- `exercise-answers-21-2`: Respostes exercici "Comptem" #2
- `exercise-answers-22-1`: Respostes exercici "Ordena nombres" #1
- `exercise-answers-23-1`: Respostes exercici "Sumem 3 nombres" #1
- `exercise-answers-24-1`: Respostes exercici "Restem saltant" #1
- `exercise-answers-25-1`: Respostes exercici "Sumem saltant" #1
- `exercise-answers-30-1`: Respostes exercici "Graella 1-100" #1
- ... (un per cada exercici completat/intentat)

### Per Conjunt d'Exercicis
- `exercise-corrections-set-21`: Correccions del conjunt "Comptem"
- `exercise-corrections-set-22`: Correccions del conjunt "Ordena nombres"
- `exercise-corrections-set-23`: Correccions del conjunt "Sumem 3 nombres"
- `exercise-corrections-set-24`: Correccions del conjunt "Restem saltant"
- `exercise-corrections-set-25`: Correccions del conjunt "Sumem saltant"
- `exercise-corrections-set-26`: Correccions del conjunt "Restem saltant pel 10"
- `exercise-corrections-set-30`: Correccions del conjunt "Graella 1-100"
- ... (un per cada conjunt amb exercicis intentats)
