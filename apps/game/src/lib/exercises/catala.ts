import type { ExerciseSet, ReadingSpeedExercise } from "./types";

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
  }
];