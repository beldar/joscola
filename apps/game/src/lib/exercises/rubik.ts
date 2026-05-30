import type { ExerciseSet, RubikInfoExercise, RubikLetterQuizExercise, RubikMatchExercise, RubikSequenceTapExercise } from "./types";

export const rubikExerciseSets: ExerciseSet[] = [
  // ─── GROUP 1: APRÈN LES LLETRES ───────────────────────────────────────────
  {
    id: "rubik-aprèn-lletres",
    title: "APRÈN LES LLETRES",
    icon: "🧩",
    exercises: [
      {
        id: "rubik-info-portada",
        type: "rubik-info",
        title: "L'IDIOMA DEL CUB",
        instructions: "LLEGEIX I APRÈN COM PARLEM DEL CUB DE RUBIK",
        blocks: [
          {
            text: "El cub de Rubik té SIS CARES. Cada cara té un NOM d'una lletra: R, L, U, D, F i B.\n\nR = Right (dreta)\nL = Left (esquerra)\nU = Up (dalt)\nD = Down (baix)\nF = Front (davant)\nB = Back (darrere)",
          },
          {
            text: "Quan escrivim una lletra, vol dir: GIR AQUELLA CARA EN SENTIT HORARI (com les agulles del rellotge) vist des de fora.",
          },
        ],
      } as RubikInfoExercise,

      {
        id: "rubik-info-com-girar",
        type: "rubik-info",
        title: "COM FEM UN GIR?",
        instructions: "MIRA LA FLETXA: INDICA LA DIRECCIÓ DEL GIR",
        blocks: [
          {
            move: "R",
            text: "R: Gira la cara de la DRETA en sentit horari.\nLa franja dreta del davant PUJA.",
          },
          {
            move: "U",
            text: "U: Gira la cara de DALT en sentit horari.\nLa franja de dalt del davant va a la DRETA.",
          },
          {
            move: "F",
            text: "F: Gira la cara del DAVANT en sentit horari.\nLes peces de la vora giren com les agulles.",
          },
        ],
      } as RubikInfoExercise,

      {
        id: "rubik-info-R",
        type: "rubik-info",
        title: "LA LLETRA R",
        instructions: "R = RIGHT = DRETA",
        blocks: [
          {
            move: "R",
            text: "R: Gira la columna de la DRETA cap amunt.\nLa franja groga (dreta) és la que es mou.\n\nRecorda: R de «Right» (dreta en anglès).",
          },
        ],
      } as RubikInfoExercise,

      {
        id: "rubik-info-L",
        type: "rubik-info",
        title: "LA LLETRA L",
        instructions: "L = LEFT = ESQUERRA",
        blocks: [
          {
            move: "L",
            text: "L: Gira la columna de l'ESQUERRA cap amunt.\nLa franja groga (esquerra) és la que es mou.\n\nRecorda: L de «Left» (esquerra en anglès).",
          },
        ],
      } as RubikInfoExercise,

      {
        id: "rubik-info-U",
        type: "rubik-info",
        title: "LA LLETRA U",
        instructions: "U = UP = DALT",
        blocks: [
          {
            move: "U",
            text: "U: Gira la fila de DALT cap a la dreta.\nLa franja groga (dalt) és la que es mou.\n\nRecorda: U de «Up» (dalt en anglès).",
          },
        ],
      } as RubikInfoExercise,

      {
        id: "rubik-info-D",
        type: "rubik-info",
        title: "LA LLETRA D",
        instructions: "D = DOWN = BAIX",
        blocks: [
          {
            move: "D",
            text: "D: Gira la fila de BAIX cap a la dreta.\nLa franja groga (baix) és la que es mou.\n\nRecorda: D de «Down» (baix en anglès).",
          },
        ],
      } as RubikInfoExercise,

      {
        id: "rubik-info-F",
        type: "rubik-info",
        title: "LA LLETRA F",
        instructions: "F = FRONT = DAVANT",
        blocks: [
          {
            move: "F",
            text: "F: Gira tota la cara del DAVANT en sentit horari.\nLa cara groga (davant) és la que es mou.\n\nRecorda: F de «Front» (davant en anglès).",
          },
        ],
      } as RubikInfoExercise,

      {
        id: "rubik-info-B",
        type: "rubik-info",
        title: "LA LLETRA B",
        instructions: "B = BACK = DARRERE",
        blocks: [
          {
            move: "B",
            text: "B: Gira tota la cara del DARRERE en sentit horari.\nLes franges grogues (vora del darrere) són les que es mouen.\n\nRecorda: B de «Back» (darrere en anglès).",
          },
        ],
      } as RubikInfoExercise,
    ],
  },

  // ─── GROUP 2: GIRS AL REVÉS ───────────────────────────────────────────────
  {
    id: "rubik-girs-al-revés",
    title: "GIRS AL REVÉS",
    icon: "🔄",
    exercises: [
      {
        id: "rubik-info-apostref",
        type: "rubik-info",
        title: "QUÈ VOL DIR EL APÒSTROF?",
        instructions: "QUAN HI HA UN ' DARRERE LA LLETRA, EL GIR VA AL REVÉS",
        blocks: [
          {
            text: "R' (R amb apòstrof) vol dir: gira la dreta en sentit ANTIHORARI.\n\nÉs com desfer el moviment R.\n\nR i R' es desfan mútuament:\nSi fas R i després R', tornes a on eres!",
          },
        ],
      } as RubikInfoExercise,

      {
        id: "rubik-info-Rprime",
        type: "rubik-info",
        title: "R' — DRETA AL REVÉS",
        instructions: "LA FLETXA VA EN SENTIT CONTRARI",
        blocks: [
          {
            move: "R'",
            text: "R': La columna de la DRETA baixa.\nLa fletxa va en sentit ANTIHORARI.",
          },
        ],
      } as RubikInfoExercise,

      {
        id: "rubik-info-Lprime",
        type: "rubik-info",
        title: "L' — ESQUERRA AL REVÉS",
        instructions: "LA FLETXA VA EN SENTIT CONTRARI",
        blocks: [
          {
            move: "L'",
            text: "L': La columna de l'ESQUERRA baixa.\nLa fletxa va en sentit ANTIHORARI.",
          },
        ],
      } as RubikInfoExercise,

      {
        id: "rubik-info-Uprime",
        type: "rubik-info",
        title: "U' — DALT AL REVÉS",
        instructions: "LA FLETXA VA EN SENTIT CONTRARI",
        blocks: [
          {
            move: "U'",
            text: "U': La fila de DALT va cap a l'esquerra.\nLa fletxa va en sentit ANTIHORARI.",
          },
        ],
      } as RubikInfoExercise,

      {
        id: "rubik-info-Dprime",
        type: "rubik-info",
        title: "D' — BAIX AL REVÉS",
        instructions: "LA FLETXA VA EN SENTIT CONTRARI",
        blocks: [
          {
            move: "D'",
            text: "D': La fila de BAIX va cap a l'esquerra.\nLa fletxa va en sentit ANTIHORARI.",
          },
        ],
      } as RubikInfoExercise,

      {
        id: "rubik-info-Fprime",
        type: "rubik-info",
        title: "F' — DAVANT AL REVÉS",
        instructions: "LA FLETXA VA EN SENTIT CONTRARI",
        blocks: [
          {
            move: "F'",
            text: "F': La cara del DAVANT gira en sentit ANTIHORARI.\nLa fletxa va al revés.",
          },
        ],
      } as RubikInfoExercise,

      {
        id: "rubik-info-Bprime",
        type: "rubik-info",
        title: "B' — DARRERE AL REVÉS",
        instructions: "LA FLETXA VA EN SENTIT CONTRARI",
        blocks: [
          {
            move: "B'",
            text: "B': La cara del DARRERE gira en sentit ANTIHORARI.\nLa fletxa va al revés.",
          },
        ],
      } as RubikInfoExercise,
    ],
  },

  // ─── GROUP 3: A JUGAR! ────────────────────────────────────────────────────
  {
    id: "rubik-a-jugar",
    title: "A JUGAR!",
    icon: "🎮",
    exercises: [
      // Letter quiz exercises
      {
        id: "rubik-quiz-1",
        type: "rubik-letter-quiz",
        title: "QUIN MOVIMENT ÉS?",
        instructions: "MIRA EL CUB I LA FLETXA. TOCA LA LLETRA CORRECTA.",
        move: "R",
        options: ["R", "L", "U", "F"],
      } as RubikLetterQuizExercise,

      {
        id: "rubik-quiz-2",
        type: "rubik-letter-quiz",
        title: "QUIN MOVIMENT ÉS?",
        instructions: "MIRA EL CUB I LA FLETXA. TOCA LA LLETRA CORRECTA.",
        move: "U",
        options: ["F", "U", "D", "R"],
      } as RubikLetterQuizExercise,

      {
        id: "rubik-quiz-3",
        type: "rubik-letter-quiz",
        title: "QUIN MOVIMENT ÉS?",
        instructions: "MIRA EL CUB I LA FLETXA. TOCA LA LLETRA CORRECTA.",
        move: "F",
        options: ["B", "R", "F", "L"],
      } as RubikLetterQuizExercise,

      {
        id: "rubik-quiz-4",
        type: "rubik-letter-quiz",
        title: "QUIN MOVIMENT ÉS?",
        instructions: "MIRA EL CUB I LA FLETXA. TOCA LA LLETRA CORRECTA.",
        move: "L",
        options: ["L", "R", "D", "U"],
      } as RubikLetterQuizExercise,

      {
        id: "rubik-quiz-5",
        type: "rubik-letter-quiz",
        title: "QUIN MOVIMENT ÉS?",
        instructions: "MIRA EL CUB I LA FLETXA. TOCA LA LLETRA CORRECTA.",
        move: "R'",
        options: ["R", "R'", "L'", "U'"],
      } as RubikLetterQuizExercise,

      {
        id: "rubik-quiz-6",
        type: "rubik-letter-quiz",
        title: "QUIN MOVIMENT ÉS?",
        instructions: "MIRA EL CUB I LA FLETXA. TOCA LA LLETRA CORRECTA.",
        move: "U'",
        options: ["U", "D'", "U'", "F'"],
      } as RubikLetterQuizExercise,

      // Match exercise
      {
        id: "rubik-match-1",
        type: "rubik-match",
        title: "RELACIONA EL CUB AMB LA LLETRA",
        instructions: "TOCA UN CUB I DESPRÉS LA SEVA LLETRA.",
        pairs: ["R", "U", "F"],
      } as RubikMatchExercise,

      {
        id: "rubik-match-2",
        type: "rubik-match",
        title: "RELACIONA EL CUB AMB LA LLETRA",
        instructions: "TOCA UN CUB I DESPRÉS LA SEVA LLETRA.",
        pairs: ["L", "D", "B"],
      } as RubikMatchExercise,

      {
        id: "rubik-match-3",
        type: "rubik-match",
        title: "RELACIONA EL CUB AMB LA LLETRA",
        instructions: "TOCA UN CUB I DESPRÉS LA SEVA LLETRA.",
        pairs: ["R'", "U'", "F'"],
      } as RubikMatchExercise,

      // Sequence tap exercises
      {
        id: "rubik-seq-1",
        type: "rubik-sequence-tap",
        title: "ESCALFAMENT: U U U U",
        instructions: "TOCA ELS BOTONS EN ORDRE PER REPRODUIR LA SEQÜÈNCIA. FES-HO TAMBÉ AMB EL CUB!",
        sequence: ["U", "U", "U", "U"],
        buttons: ["R", "U", "F", "L", "D", "B"],
      } as RubikSequenceTapExercise,

      {
        id: "rubik-seq-2",
        type: "rubik-sequence-tap",
        title: "PUJA I BAIXA: R U R'",
        instructions: "TOCA ELS BOTONS EN ORDRE. FES-HO TAMBÉ AMB EL CUB!",
        sequence: ["R", "U", "R'"],
        buttons: ["R", "R'", "U", "U'", "F", "L"],
      } as RubikSequenceTapExercise,

      {
        id: "rubik-seq-3",
        type: "rubik-sequence-tap",
        title: "EL BALANCÍ: R U R' U'",
        instructions: "AQUEST ÉS UN DELS ALGORITMES MÉS FAMOSOS! TOCA'L EN ORDRE.",
        sequence: ["R", "U", "R'", "U'"],
        buttons: ["R", "R'", "U", "U'", "F", "D"],
      } as RubikSequenceTapExercise,
    ],
  },
];
