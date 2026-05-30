import type {
  ExerciseSet,
  RubikInfoExercise,
  RubikLetterQuizExercise,
  RubikMatchExercise,
  RubikSequenceTapExercise,
  RubikSolverPathExercise,
} from "./types";

const guideAsset = (name: string) => `/rubik-2x2-guide/${name}.png`;

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

  // ─── GROUP 4: SOLUCIONADOR 2x2 ───────────────────────────────────────────
  {
    id: "rubik-solucionador-2x2",
    title: "SOLUCIONADOR 2x2",
    icon: "🧭",
    exercises: [
      {
        id: "rubik-mini-solver",
        type: "rubik-solver-path",
        title: "CAMÍ DEL MINI",
        instructions: "MIRA EL TEU CUB, TOCA EL DIBUIX I SEGUEIX EL CAMÍ",
        startNodeId: "c2",
        nodes: [
          {
            id: "c2",
            phase: "CAPA BLANCA",
            title: "2A CANTONADA",
            text: "Busca la peça blanc-blau-taronja.",
            image: guideAsset("preparacio-canto-2"),
            imageAlt: "Cub amb el logo blanc a dalt, vermell davant i blau a la dreta.",
            options: [
              {
                label: "Ja és al seu lloc",
                hint: "Passa a la tercera cantonada.",
                image: guideAsset("c2-ja-posat"),
                nextNodeId: "c3",
              },
              {
                label: "És a dalt",
                hint: "Primer la baixarem.",
                image: guideAsset("c2-a-dalt"),
                nextNodeId: "c2-top",
              },
              {
                label: "És a baix",
                hint: "Ara la posarem bé.",
                image: guideAsset("c2-a-baix"),
                nextNodeId: "c2-bottom",
              },
            ],
          },
          {
            id: "c2-top",
            phase: "CAPA BLANCA",
            title: "BAIXA LA PEÇA",
            text: "Posa el cub com el dibuix i fes els moviments.",
            image: guideAsset("c2-baixar-de-dalt"),
            imageAlt: "Tres casos per baixar la cantonada blanc-blau-taronja amb R', D' i R.",
            options: [{ label: "Ja és a baix", nextNodeId: "c2-bottom" }],
          },
          {
            id: "c2-bottom",
            phase: "CAPA BLANCA",
            title: "TRIA EL CAS",
            text: "Gira D fins que el teu cub sigui com un dibuix.",
            options: [
              { label: "Cas 1", image: guideAsset("c2-cas-1"), nextNodeId: "c3" },
              { label: "Cas 2", image: guideAsset("c2-cas-2"), nextNodeId: "c3" },
              { label: "Cas 3", image: guideAsset("c2-cas-3"), nextNodeId: "c3" },
            ],
          },
          {
            id: "c3",
            phase: "CAPA BLANCA",
            title: "3A CANTONADA",
            text: "Busca la peça blanc-verd-taronja.",
            image: guideAsset("preparacio-canto-3"),
            imageAlt: "Cub preparat per trobar la tercera cantonada.",
            options: [
              { label: "Ja és al seu lloc", image: guideAsset("c3-ja-posat"), nextNodeId: "c4" },
              { label: "És a dalt", image: guideAsset("c3-a-dalt"), nextNodeId: "c3-top" },
              { label: "És a baix", image: guideAsset("c3-a-baix"), nextNodeId: "c3-bottom" },
            ],
          },
          {
            id: "c3-top",
            phase: "CAPA BLANCA",
            title: "SI ÉS A DALT",
            text: "Toca el dibuix que s'assembla més al teu cub.",
            options: [
              { label: "Cas 1", hint: "Després ja vas a la quarta cantonada.", image: guideAsset("c3-dalt-cas-1"), nextNodeId: "c4" },
              { label: "Cas 2 o 3", image: guideAsset("c3-dalt-cas-2-3"), nextNodeId: "c3-bottom" },
              { label: "Cas 4 o 5", image: guideAsset("c3-dalt-cas-4-5"), nextNodeId: "c3-bottom" },
            ],
          },
          {
            id: "c3-bottom",
            phase: "CAPA BLANCA",
            title: "SI ÉS A BAIX",
            text: "Gira D fins que coincideixi i fes el dibuix.",
            options: [
              { label: "Cas 1", image: guideAsset("c3-baix-cas-1"), nextNodeId: "c4" },
              { label: "Cas 2", image: guideAsset("c3-baix-cas-2"), nextNodeId: "c4" },
              { label: "Cas 3", image: guideAsset("c3-baix-cas-3"), nextNodeId: "c4" },
            ],
          },
          {
            id: "c4",
            phase: "CAPA BLANCA",
            title: "4A CANTONADA",
            text: "Busca la peça blanc-verd-vermell.",
            image: guideAsset("preparacio-canto-4"),
            imageAlt: "Cub preparat per trobar la quarta cantonada.",
            options: [
              { label: "Ja és al seu lloc", image: guideAsset("c4-ja-posat"), nextNodeId: "yellow" },
              { label: "És a dalt", image: guideAsset("c4-a-dalt"), nextNodeId: "c4-top" },
              { label: "És a baix", image: guideAsset("c4-a-baix"), nextNodeId: "c4-bottom" },
            ],
          },
          {
            id: "c4-top",
            phase: "CAPA BLANCA",
            title: "BAIXA-LA",
            text: "Fes el dibuix. Després mira-la a baix.",
            image: guideAsset("c4-baixar-de-dalt"),
            imageAlt: "Moviments per baixar la quarta cantonada.",
            options: [{ label: "Ja és a baix", nextNodeId: "c4-bottom" }],
          },
          {
            id: "c4-bottom",
            phase: "CAPA BLANCA",
            title: "ÚLTIM CAS BLANC",
            text: "Gira D fins que coincideixi.",
            options: [
              { label: "Cas 1", hint: "Després aniràs al cas 2.", image: guideAsset("c4-baix-cas-1"), nextNodeId: "c4-bottom-case-2" },
              { label: "Cas 2", image: guideAsset("c4-baix-cas-2"), nextNodeId: "yellow" },
              { label: "Cas 3", image: guideAsset("c4-baix-cas-3"), nextNodeId: "yellow" },
            ],
          },
          {
            id: "c4-bottom-case-2",
            phase: "CAPA BLANCA",
            title: "ARA EL CAS 2",
            text: "Fes aquest dibuix per acabar la capa blanca.",
            image: guideAsset("c4-baix-cas-2"),
            imageAlt: "Cas 2 de la quarta cantonada.",
            options: [{ label: "Capa blanca feta", nextNodeId: "yellow" }],
          },
          {
            id: "yellow",
            phase: "CARA GROGA",
            title: "QUANTS GROCS HI HA A DALT?",
            text: "Mira només la cara de dalt.",
            image: guideAsset("preparacio-groc"),
            imageAlt: "Cub amb la cara blanca a baix.",
            options: [
              { label: "1 groc", image: guideAsset("groc-1"), nextNodeId: "yellow-algorithm" },
              { label: "0 grocs", image: guideAsset("groc-0"), nextNodeId: "yellow-algorithm" },
              { label: "2 grocs", image: guideAsset("groc-2"), nextNodeId: "yellow-algorithm" },
            ],
          },
          {
            id: "yellow-algorithm",
            phase: "CARA GROGA",
            title: "FES L'ALGORITME",
            text: "Fes els moviments. Potser cal repetir-ho.",
            image: guideAsset("algoritme-cara-groga"),
            imageAlt: "Algoritme R U R' U R U2 R' per fer la cara groga.",
            options: [
              { label: "Encara no és tota groga", nextNodeId: "yellow" },
              { label: "Ja és tota groga", nextNodeId: "place-corners" },
            ],
          },
          {
            id: "place-corners",
            phase: "ÚLTIM PAS",
            title: "COL·LOCA LES GROGUES",
            text: "Gira U fins que dues cantonades casin amb baix.",
            image: guideAsset("gira-capa-u"),
            imageAlt: "Gir U de la capa de dalt.",
            options: [
              { label: "Ja està resolt", image: guideAsset("mini-resolt-model"), nextNodeId: "done", complete: true },
              { label: "Encara no", nextNodeId: "swap-corners" },
            ],
          },
          {
            id: "swap-corners",
            phase: "ÚLTIM PAS",
            title: "QUINES CANVIEN?",
            text: "Toca el dibuix que s'assembla al teu cub.",
            options: [
              { label: "Costat amb costat", image: guideAsset("canvi-adjacent"), nextNodeId: "swap-algorithm" },
              { label: "En diagonal", image: guideAsset("canvi-diagonal"), nextNodeId: "swap-algorithm" },
            ],
          },
          {
            id: "swap-algorithm",
            phase: "ÚLTIM PAS",
            title: "CANVIA LES CANTONADES",
            text: "Fes l'algoritme i torna a mirar.",
            image: guideAsset("algoritme-canviar-cantonades"),
            imageAlt: "Algoritme per intercanviar cantonades grogues.",
            options: [{ label: "Tornar a mirar", nextNodeId: "place-corners" }],
          },
          {
            id: "done",
            phase: "FET!",
            title: "CUB RESOLT",
            text: "Has arribat al final.",
            image: guideAsset("felicitats"),
            imageAlt: "Pàgina de felicitació del PDF.",
            complete: true,
          },
        ],
      } as RubikSolverPathExercise,
    ],
  },
];
