export interface AnimalEntry {
  letter: string; // A-Z
  name: string; // Nom en català (majúscules)
  article: "EL" | "LA" | "L'";
  emoji: string;
  // Onomatopeia que es dirà en veu alta. Ha de contenir alguna vocal que
  // trenqui les consonants repetides: els motors de veu lletregen les
  // cadenes de consonants idèntiques sense cap vocal (p.ex. "Ssssss!" es
  // sent com "essa, essa, essa...") en comptes de fer-ne un so continu.
  sound: string;
}

export const animalAlphabet: AnimalEntry[] = [
  { letter: "A", name: "ABELLA", article: "L'", emoji: "🐝", sound: "Bzzzum, bzzzum!" },
  { letter: "B", name: "BALENA", article: "LA", emoji: "🐳", sound: "Uuuh, uuuh!" },
  { letter: "C", name: "CAVALL", article: "EL", emoji: "🐴", sound: "Hiiiii!" },
  { letter: "D", name: "DOFÍ", article: "EL", emoji: "🐬", sound: "Clic, clic!" },
  { letter: "E", name: "ELEFANT", article: "L'", emoji: "🐘", sound: "Barriiit!" },
  { letter: "F", name: "FOCA", article: "LA", emoji: "🦭", sound: "Ork, ork!" },
  { letter: "G", name: "GAT", article: "EL", emoji: "🐱", sound: "Meu, meu!" },
  { letter: "H", name: "HIPOPÒTAM", article: "L'", emoji: "🦛", sound: "Grunt, grunt!" },
  { letter: "I", name: "IGUANA", article: "L'", emoji: "🦎", sound: "Sssiii, sssiii!" },
  { letter: "J", name: "JAGUAR", article: "EL", emoji: "🐆", sound: "Grrraaam!" },
  { letter: "K", name: "KIWI", article: "EL", emoji: "🥝", sound: "Kivi, kivi!" },
  { letter: "L", name: "LLEÓ", article: "EL", emoji: "🦁", sound: "Rrroaar!" },
  { letter: "M", name: "MICO", article: "EL", emoji: "🐒", sound: "Ii-ii, ah-ah!" },
  { letter: "N", name: "NÚTRIA", article: "LA", emoji: "🦦", sound: "Txip, txip!" },
  { letter: "O", name: "ÓS", article: "L'", emoji: "🐻", sound: "Groaar!" },
  { letter: "P", name: "PANDA", article: "EL", emoji: "🐼", sound: "Bee, bee!" },
  { letter: "Q", name: "QUISSO", article: "EL", emoji: "🐶", sound: "Bup, bup!" },
  { letter: "R", name: "RATOLÍ", article: "EL", emoji: "🐭", sound: "Iii, iii!" },
  { letter: "S", name: "SERP", article: "LA", emoji: "🐍", sound: "Sssiii, sssiii!" },
  { letter: "T", name: "TIGRE", article: "EL", emoji: "🐯", sound: "Grrrhaaa!" },
  { letter: "U", name: "UNICORN", article: "L'", emoji: "🦄", sound: "Hiiii!" },
  { letter: "V", name: "VACA", article: "LA", emoji: "🐮", sound: "Muuu, muuu!" },
  { letter: "W", name: "WOMBAT", article: "EL", emoji: "🦡", sound: "Grunt, grunt!" },
  { letter: "X", name: "XAI", article: "EL", emoji: "🐑", sound: "Bee, bee!" },
  { letter: "Y", name: "YAK", article: "EL", emoji: "🐂", sound: "Muuu!" },
  { letter: "Z", name: "ZEBRA", article: "LA", emoji: "🦓", sound: "Hi-han!" },
];

export function getAnimalForLetter(letter: string): AnimalEntry | undefined {
  return animalAlphabet.find((a) => a.letter === letter.toUpperCase());
}
