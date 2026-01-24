// Irish alphabet - An Aibítir Ghaeilge
// The Irish alphabet has 18 letters (no j, k, q, v, w, x, y, z)

export interface Letter {
  letter: string;
  name: string; // Traditional Irish letter name
  sound: string; // Phonetic hint
  exampleWord: string;
  exampleMeaning: string;
  audio?: string;
}

export const irishAlphabet: Letter[] = [
  { letter: 'A', name: 'ailm', sound: 'ah', exampleWord: 'arán', exampleMeaning: 'bread' },
  { letter: 'B', name: 'beith', sound: 'beh', exampleWord: 'bád', exampleMeaning: 'boat' },
  { letter: 'C', name: 'coll', sound: 'kuh', exampleWord: 'cat', exampleMeaning: 'cat' },
  { letter: 'D', name: 'dair', sound: 'duh', exampleWord: 'doras', exampleMeaning: 'door' },
  { letter: 'E', name: 'eadhadh', sound: 'eh', exampleWord: 'éan', exampleMeaning: 'bird' },
  { letter: 'F', name: 'fearn', sound: 'fuh', exampleWord: 'fear', exampleMeaning: 'man' },
  { letter: 'G', name: 'gort', sound: 'guh', exampleWord: 'grian', exampleMeaning: 'sun' },
  { letter: 'H', name: 'huath', sound: 'huh', exampleWord: 'hata', exampleMeaning: 'hat' },
  { letter: 'I', name: 'iodhadh', sound: 'ee', exampleWord: 'im', exampleMeaning: 'butter' },
  { letter: 'L', name: 'luis', sound: 'luh', exampleWord: 'leabhar', exampleMeaning: 'book' },
  { letter: 'M', name: 'muin', sound: 'muh', exampleWord: 'máthair', exampleMeaning: 'mother' },
  { letter: 'N', name: 'nuin', sound: 'nuh', exampleWord: 'nead', exampleMeaning: 'nest' },
  { letter: 'O', name: 'onn', sound: 'oh', exampleWord: 'oráiste', exampleMeaning: 'orange' },
  { letter: 'P', name: 'peith', sound: 'puh', exampleWord: 'páiste', exampleMeaning: 'child' },
  { letter: 'R', name: 'ruis', sound: 'ruh', exampleWord: 'rí', exampleMeaning: 'king' },
  { letter: 'S', name: 'sail', sound: 'suh', exampleWord: 'súil', exampleMeaning: 'eye' },
  { letter: 'T', name: 'tinne', sound: 'tuh', exampleWord: 'teach', exampleMeaning: 'house' },
  { letter: 'U', name: 'úr', sound: 'oo', exampleWord: 'uisce', exampleMeaning: 'water' },
];

// Vowels and consonants
export const vowels = ['A', 'E', 'I', 'O', 'U'];
export const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'L', 'M', 'N', 'P', 'R', 'S', 'T'];

// Fadas (accented vowels)
export const fadaVowels = ['Á', 'É', 'Í', 'Ó', 'Ú'];

// Simple words for spelling games (3-4 letters)
export const simpleWords = [
  { word: 'cat', meaning: 'cat' },
  { word: 'bád', meaning: 'boat' },
  { word: 'bus', meaning: 'bus' },
  { word: 'bia', meaning: 'food' },
  { word: 'lá', meaning: 'day' },
  { word: 'bó', meaning: 'cow' },
  { word: 'muc', meaning: 'pig' },
  { word: 'úll', meaning: 'apple' },
  { word: 'rí', meaning: 'king' },
  { word: 'tír', meaning: 'country' },
  { word: 'ór', meaning: 'gold' },
  { word: 'cos', meaning: 'foot' },
  { word: 'súil', meaning: 'eye' },
  { word: 'lámh', meaning: 'hand' },
  { word: 'béal', meaning: 'mouth' },
];

// Letter phrases for games
export const letterPhrases = {
  whatLetter: 'Cad é an litir seo?',
  findTheLetter: 'Aimsigh an litir',
  spellTheWord: 'Litriú an focal',
  thisIs: 'Seo',
  theLetterIs: 'Is í an litir ná',
};
