import type { ExerciseSet, ReadingSpeedExercise, CalligraphyExercise } from "./types";

// Based on the reading speed method from the PDF
// Each phase has 60 words arranged in 4 columns

const readingPhases = {
  // Phase 1: Direct syllables
  phase1: [
    "Pa", "Ta", "Le", "Fu",
    "Ca", "So", "Ju", "Ga",
    "Go", "Be", "Tu", "Se",
    "Fi", "Lo", "Go", "Ti",
    "Po", "Re", "He", "Bo",
    "Te", "Mo", "Na", "Mi",
    "Fe", "Ni", "Mu", "Na",
    "Ma", "Xo", "Fa", "Da",
    "De", "Du", "No", "Ri",
    "Ru", "Bi", "Vo", "Si",
    "Xe", "Ki", "Gu", "Ji",
    "Pu", "Xu", "Ja", "Vi",
    "Di", "Je", "Po", "Ko",
    "Ce", "Vu", "Ha", "Ci",
    "Co", "Ho", "Jo", "Pi"
  ],

  // Phase 2: Inverse syllables
  phase2: [
    "Ap", "Et", "Op", "Ol",
    "Ef", "IF", "AC", "OB",
    "Er", "Ut", "Ev", "Of",
    "As", "Id", "Is", "Ep",
    "Oz", "Ix", "Ir", "Em",
    "In", "Am", "Ed", "Es",
    "Os", "Uf", "Im", "On",
    "Us", "Ic", "Ec", "Un",
    "An", "Ik", "Ak", "Ex",
    "Oh", "Eh", "Ih", "Ah",
    "Ug", "El", "Ig", "Ag",
    "Oc", "Uc", "Ic", "Ip",
    "Ox", "Uh", "Om", "Oj",
    "Aj", "Ej", "Ij", "Uj",
    "Uy", "Oy", "Iy", "Ay"
  ],

  // Phase 3: Monosyllabic words
  phase3: [
    "Mà", "Món", "Pi", "Que",
    "Joc", "Fi", "Teu", "Bo",
    "Sa", "Meu", "De", "Re",
    "Fa", "Sol", "Seu", "Peu",
    "Fiu", "Sac", "Sec", "Sot",
    "No", "Tir", "Res", "Nom",
    "Cap", "Xiu", "Dos", "Dit",
    "Feu", "Cuc", "Coc", "Miau",
    "Foc", "Toc", "Rec", "Rot",
    "Un", "Gat", "Gos", "Sis",
    "Buit", "Set", "Vas", "Bou",
    "Ou", "Cec", "Cou", "Vuit",
    "Fem", "Pit", "Xic", "Cul",
    "Pet", "Nen", "Vi", "Lot",
    "Qui", "Xoc", "Nus", "Pot"
  ],

  // Phase 4: Direct bisyllabic words
  phase4: [
    "Casa", "Papa", "Cosa", "Roca",
    "Pipa", "Soca", "Tela", "Bona",
    "Dita", "Xoca", "Foca", "Meta",
    "Mono", "Mapa", "Nina", "Roda",
    "Goma", "Home", "Lupa", "Lila",
    "Dino", "Fulla", "Fuma", "Pera",
    "Bola", "Cine", "Moca", "Boca",
    "Cera", "Nena", "Mola", "Sura",
    "Fica", "Lloca", "Tira", "Sopa",
    "Gota", "Nota", "Mica", "Fira",
    "Seca", "Zero", "Cuca", "Bota",
    "Vida", "Boda", "Nuca", "Rima",
    "Roma", "Gata", "Pota", "Jota",
    "Juga", "Gorra", "Taca", "Data",
    "Copa", "Capa", "Mona", "Meva"
  ],

  // Phase 5: Inverse bisyllabic words
  phase5: [
    "Eriçó", "Arbre", "Circ", "Antic",
    "Amic", "Ungla", "Arc", "Multa",
    "Indi", "Espia", "Esclat", "Amo",
    "Arpa", "Alta", "Estel", "Arma",
    "Astre", "Agulla", "Ombra", "Estil",
    "Ànec", "Albert", "Anell", "Estat",
    "Amor", "Ancla", "Oncle", "Asma",
    "Avi", "Onze", "Elena", "Polse",
    "Barca", "Inma", "Emma", "Eric",
    "Ona", "Ànim", "Adob", "Indi",
    "Or", "Arc", "Iglú", "Urpa",
    "Estri", "Anna", "Emma", "Acte",
    "Actor", "Ajut", "Actriu", "Avall",
    "Amunt", "Fusta", "Germà", "Estoig",
    "Ordre", "Unit", "Iman", "Oli"
  ],

  // Phase 6: Words with complex syllables
  phase6: [
    "Tractor", "Branca", "Flauta", "Brisa",
    "Bruixa", "Plàtan", "Broma", "Trineu",
    "Timbre", "Premi", "Flota", "Flor",
    "Préstec", "Arbre", "Fruita", "Blanc",
    "Tros", "Pebrot", "Blau", "Primer",
    "Brusa", "Bruc", "Tro", "Trampa",
    "Intrús", "Trompa", "Flama", "Ploma",
    "Compra", "Pluja", "truja", "Front",
    "Fred", "Grua", "Gros", "Tigre",
    "Lladre", "Groc", "Bloc", "Ample",
    "Fletxa", "Flotar", "Xancles", "Cicle",
    "Closca", "Cabra", "Clip", "Llibre",
    "Globus", "Glop", "Regle", "Poble",
    "Bíblia", "Blat", "Pruna", "Prim",
    "Pruna", "Gran", "Flam", "Frena"
  ],

  // Phase 7: Trisyllabic words
  phase7: [
    "Carpeta", "Estufa", "Armari", "Setmana",
    "Hospital", "Vosaltres", "Aranya", "Joguina",
    "Motxilla", "Caseta", "Domino", "Ratolí",
    "Ampolla", "Pantalla", "Bufanda", "Jaqueta",
    "Faldilla", "Menjador", "Màquina", "Cullera",
    "Agenda", "Professor", "Pissarra", "Pilota",
    "Sabata", "Girafa", "Ganivet", "Esquirol",
    "Tomàquet", "Cassola", "Elefant", "Cirera",
    "Cavanya", "Forquilla", "Vacances", "Pintura",
    "Lectura", "Beguda", "Farina", "Galeta",
    "Escala", "Cadira", "Taronja", "Somriure",
    "Germana", "Autobús", "Semàfor", "Baldufa",
    "Cinema", "Catorze", "Guitarra", "Tristesa",
    "Tempesta", "Princesa", "Maleta", "Català",
    "Naturals", "Director", "Llengua", "Gallina"
  ],

  // Phase 8: Long words (more than 3 syllables)
  phase8: [
    "Helicòpter", "Impressora", "Cremallera", "Infermera",
    "Dromedari", "Matemàtiques", "Ambulància", "Futbolista",
    "Amanida", "Astronauta", "Avellanes", "Senyoreta",
    "Espardenya", "Botifarra", "Televisió", "Melmelada",
    "Paperera", "Ordinador", "Hipopòtam", "Regadora",
    "Samarreta", "Termòmetre", "Pissarra", "Agradable",
    "Mandíbula", "Cartellera", "Carregador", "Telescopi",
    "Relaxació", "Papallona", "Helicòpter", "Respiració",
    "Espantaocells", "Esparadrap", "Musculatura", "Gimnàstica",
    "Espardenyes", "Escarabat", "Marieta", "Calculadora",
    "Monstruosa", "Maquineta", "Grapadora", "Escuradents",
    "Joieria", "Investigació", "Escriptura", "Emperador",
    "Arracada", "Cabellera", "Costurera", "Velocitat",
    "Camamilla", "Diferència", "Calefacció", "Mobilitat",
    "Uniforme", "Articulació", "Despertador", "Pintallavis"
  ],

  // Phase 9: Pseudowords
  phase9: [
    "Sergaminya", "Crostrepoc", "Glopisa", "Nemicota",
    "Mirandeta", "Tropicons", "Mifressat", "Minoreta",
    "Babotalic", "Reritroli", "Mirratrila", "Poralitra",
    "Copalusa", "Otimbalica", "Quetrusca", "Maquestria",
    "Maquestria", "Xaxonita", "Mimoca", "Calidotria",
    "Maquiotra", "Clavemilla", "Girocalit", "Llallitrocali",
    "Sergentona", "Gigagot", "Coralicossi", "Pirotet",
    "Focalipos", "Golameta", "Mirambella", "Mocramita",
    "Comicali", "Samuntina", "Lissaminat", "Microlicre",
    "Potulicas", "Comitalia", "Trotricat", "Munidressi",
    "Micoluis", "Cafristas", "Potrilleria", "Casetivas",
    "Crossira", "Beatrimat", "Zampritos", "Otimbalica",
    "Mudrissona", "Sacrelitries", "Ruquerra", "Cromicret",
    "Julimunt", "Porlotura", "Bricrasat", "Trestriassa",
    "Horritral", "Crotramina", "Craterina", "Puntamita"
  ]
};

// Calligraphy exercises for Catalan lowercase cursive letters
const calligraphyExercises: CalligraphyExercise[] = [
  // Vowels first
  {
    id: "calligraphy-a",
    type: "calligraphy",
    title: "Lletra A",
    instructions: "Practica l'escriptura de la lletra 'a' en lletra lligada",
    letter: "a",
    letterDisplay: "A",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-e",
    type: "calligraphy",
    title: "Lletra E",
    instructions: "Practica l'escriptura de la lletra 'e' en lletra lligada",
    letter: "e",
    letterDisplay: "E",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-i",
    type: "calligraphy",
    title: "Lletra I",
    instructions: "Practica l'escriptura de la lletra 'i' en lletra lligada",
    letter: "i",
    letterDisplay: "I",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-o",
    type: "calligraphy",
    title: "Lletra O",
    instructions: "Practica l'escriptura de la lletra 'o' en lletra lligada",
    letter: "o",
    letterDisplay: "O",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-u",
    type: "calligraphy",
    title: "Lletra U",
    instructions: "Practica l'escriptura de la lletra 'u' en lletra lligada",
    letter: "u",
    letterDisplay: "U",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  // Consonants
  {
    id: "calligraphy-b",
    type: "calligraphy",
    title: "Lletra B",
    instructions: "Practica l'escriptura de la lletra 'b' en lletra lligada",
    letter: "b",
    letterDisplay: "B",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-c",
    type: "calligraphy",
    title: "Lletra C",
    instructions: "Practica l'escriptura de la lletra 'c' en lletra lligada",
    letter: "c",
    letterDisplay: "C",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-d",
    type: "calligraphy",
    title: "Lletra D",
    instructions: "Practica l'escriptura de la lletra 'd' en lletra lligada",
    letter: "d",
    letterDisplay: "D",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-f",
    type: "calligraphy",
    title: "Lletra F",
    instructions: "Practica l'escriptura de la lletra 'f' en lletra lligada",
    letter: "f",
    letterDisplay: "F",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-g",
    type: "calligraphy",
    title: "Lletra G",
    instructions: "Practica l'escriptura de la lletra 'g' en lletra lligada",
    letter: "g",
    letterDisplay: "G",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-h",
    type: "calligraphy",
    title: "Lletra H",
    instructions: "Practica l'escriptura de la lletra 'h' en lletra lligada",
    letter: "h",
    letterDisplay: "H",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-j",
    type: "calligraphy",
    title: "Lletra J",
    instructions: "Practica l'escriptura de la lletra 'j' en lletra lligada",
    letter: "j",
    letterDisplay: "J",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-k",
    type: "calligraphy",
    title: "Lletra K",
    instructions: "Practica l'escriptura de la lletra 'k' en lletra lligada",
    letter: "k",
    letterDisplay: "K",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-l",
    type: "calligraphy",
    title: "Lletra L",
    instructions: "Practica l'escriptura de la lletra 'l' en lletra lligada",
    letter: "l",
    letterDisplay: "L",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-m",
    type: "calligraphy",
    title: "Lletra M",
    instructions: "Practica l'escriptura de la lletra 'm' en lletra lligada",
    letter: "m",
    letterDisplay: "M",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-n",
    type: "calligraphy",
    title: "Lletra N",
    instructions: "Practica l'escriptura de la lletra 'n' en lletra lligada",
    letter: "n",
    letterDisplay: "N",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-p",
    type: "calligraphy",
    title: "Lletra P",
    instructions: "Practica l'escriptura de la lletra 'p' en lletra lligada",
    letter: "p",
    letterDisplay: "P",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-q",
    type: "calligraphy",
    title: "Lletra Q",
    instructions: "Practica l'escriptura de la lletra 'q' en lletra lligada",
    letter: "q",
    letterDisplay: "Q",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-r",
    type: "calligraphy",
    title: "Lletra R",
    instructions: "Practica l'escriptura de la lletra 'r' en lletra lligada",
    letter: "r",
    letterDisplay: "R",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-s",
    type: "calligraphy",
    title: "Lletra S",
    instructions: "Practica l'escriptura de la lletra 's' en lletra lligada",
    letter: "s",
    letterDisplay: "S",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-t",
    type: "calligraphy",
    title: "Lletra T",
    instructions: "Practica l'escriptura de la lletra 't' en lletra lligada",
    letter: "t",
    letterDisplay: "T",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-v",
    type: "calligraphy",
    title: "Lletra V",
    instructions: "Practica l'escriptura de la lletra 'v' en lletra lligada",
    letter: "v",
    letterDisplay: "V",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-w",
    type: "calligraphy",
    title: "Lletra W",
    instructions: "Practica l'escriptura de la lletra 'w' en lletra lligada",
    letter: "w",
    letterDisplay: "W",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-x",
    type: "calligraphy",
    title: "Lletra X",
    instructions: "Practica l'escriptura de la lletra 'x' en lletra lligada",
    letter: "x",
    letterDisplay: "X",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-y",
    type: "calligraphy",
    title: "Lletra Y",
    instructions: "Practica l'escriptura de la lletra 'y' en lletra lligada",
    letter: "y",
    letterDisplay: "Y",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
  {
    id: "calligraphy-z",
    type: "calligraphy",
    title: "Lletra Z",
    instructions: "Practica l'escriptura de la lletra 'z' en lletra lligada",
    letter: "z",
    letterDisplay: "Z",
    letterType: "lowercase",
    style: "cursive",
    practiceBoxes: 18,
    showGuidelines: true,
    showModel: true,
  },
];

// Create exercise sets for Catalan reading speed
export const catalaExerciseSets: ExerciseSet[] = [
  {
    id: "reading-speed-basic",
    title: "Velocitat Lectora - Bàsic",
    icon: "📖",
    exercises: [
      {
        id: "reading-speed-1",
        type: "reading-speed",
        title: "Fase 1: Síl·labes directes",
        instructions: "Llegeix les 60 paraules en 2 minuts. Segueix l'ordre per columnes i no saltis cap paraula.",
        phase: 1,
        words: readingPhases.phase1,
        timeLimit: 120,
        columns: 4
      } as ReadingSpeedExercise,
      {
        id: "reading-speed-2",
        type: "reading-speed",
        title: "Fase 2: Síl·labes inverses",
        instructions: "Llegeix les 60 paraules en 2 minuts. Segueix l'ordre per columnes i no saltis cap paraula.",
        phase: 2,
        words: readingPhases.phase2,
        timeLimit: 120,
        columns: 4
      } as ReadingSpeedExercise,
      {
        id: "reading-speed-3",
        type: "reading-speed",
        title: "Fase 3: Paraules monosíl·labes",
        instructions: "Llegeix les 60 paraules en 2 minuts. Segueix l'ordre per columnes i no saltis cap paraula.",
        phase: 3,
        words: readingPhases.phase3,
        timeLimit: 120,
        columns: 4
      } as ReadingSpeedExercise
    ]
  },
  {
    id: "reading-speed-intermediate",
    title: "Velocitat Lectora - Intermedi",
    icon: "📗",
    exercises: [
      {
        id: "reading-speed-4",
        type: "reading-speed",
        title: "Fase 4: Bisíl·labs directes",
        instructions: "Llegeix les 60 paraules en 2 minuts. Segueix l'ordre per columnes i no saltis cap paraula.",
        phase: 4,
        words: readingPhases.phase4,
        timeLimit: 120,
        columns: 4
      } as ReadingSpeedExercise,
      {
        id: "reading-speed-5",
        type: "reading-speed",
        title: "Fase 5: Bisíl·labs inverses",
        instructions: "Llegeix les 60 paraules en 2 minuts. Segueix l'ordre per columnes i no saltis cap paraula.",
        phase: 5,
        words: readingPhases.phase5,
        timeLimit: 120,
        columns: 4
      } as ReadingSpeedExercise,
      {
        id: "reading-speed-6",
        type: "reading-speed",
        title: "Fase 6: Síl·labes travades",
        instructions: "Llegeix les 60 paraules en 2 minuts. Segueix l'ordre per columnes i no saltis cap paraula.",
        phase: 6,
        words: readingPhases.phase6,
        timeLimit: 120,
        columns: 4
      } as ReadingSpeedExercise
    ]
  },
  {
    id: "reading-speed-advanced",
    title: "Velocitat Lectora - Avançat",
    icon: "📘",
    exercises: [
      {
        id: "reading-speed-7",
        type: "reading-speed",
        title: "Fase 7: Trisíl·labs",
        instructions: "Llegeix les 60 paraules en 2 minuts. Segueix l'ordre per columnes i no saltis cap paraula.",
        phase: 7,
        words: readingPhases.phase7,
        timeLimit: 120,
        columns: 4
      } as ReadingSpeedExercise,
      {
        id: "reading-speed-8",
        type: "reading-speed",
        title: "Fase 8: Paraules llargues",
        instructions: "Llegeix les 60 paraules en 2 minuts. Segueix l'ordre per columnes i no saltis cap paraula.",
        phase: 8,
        words: readingPhases.phase8,
        timeLimit: 120,
        columns: 4
      } as ReadingSpeedExercise,
      {
        id: "reading-speed-9",
        type: "reading-speed",
        title: "Fase 9: Pseudoparaules",
        instructions: "Llegeix les 60 paraules en 2 minuts. Segueix l'ordre per columnes i no saltis cap paraula.",
        phase: 9,
        words: readingPhases.phase9,
        timeLimit: 120,
        columns: 4
      } as ReadingSpeedExercise
    ]
  },
  {
    id: "calligraphy-vowels",
    title: "Cal·ligrafia - Vocals",
    icon: "✍️",
    exercises: [
      calligraphyExercises[0], // a
      calligraphyExercises[1], // e
      calligraphyExercises[2], // i
      calligraphyExercises[3], // o
      calligraphyExercises[4], // u
    ]
  },
  {
    id: "calligraphy-consonants-1",
    title: "Cal·ligrafia - Consonants (A-G)",
    icon: "✍️",
    exercises: [
      calligraphyExercises[5],  // b
      calligraphyExercises[6],  // c
      calligraphyExercises[7],  // d
      calligraphyExercises[8],  // f
      calligraphyExercises[9],  // g
    ]
  },
  {
    id: "calligraphy-consonants-2",
    title: "Cal·ligrafia - Consonants (H-N)",
    icon: "✍️",
    exercises: [
      calligraphyExercises[10], // h
      calligraphyExercises[11], // j
      calligraphyExercises[12], // k
      calligraphyExercises[13], // l
      calligraphyExercises[14], // m
      calligraphyExercises[15], // n
    ]
  },
  {
    id: "calligraphy-consonants-3",
    title: "Cal·ligrafia - Consonants (P-Z)",
    icon: "✍️",
    exercises: [
      calligraphyExercises[16], // p
      calligraphyExercises[17], // q
      calligraphyExercises[18], // r
      calligraphyExercises[19], // s
      calligraphyExercises[20], // t
      calligraphyExercises[21], // v
      calligraphyExercises[22], // w
      calligraphyExercises[23], // x
      calligraphyExercises[24], // y
      calligraphyExercises[25], // z
    ]
  }
];