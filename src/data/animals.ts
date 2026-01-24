// Irish animals - Ainmhithe na Gaeilge

export interface AnimalWord {
  id: string;
  irish: string;
  english: string;
  category: 'farm' | 'wild' | 'sea' | 'pets' | 'birds';
  emoji: string;
  audio?: string;
}

export const animals: AnimalWord[] = [
  // Farm animals - Ainmhithe feirme
  { id: 'bó', irish: 'bó', english: 'cow', category: 'farm', emoji: '🐄' },
  { id: 'capall', irish: 'capall', english: 'horse', category: 'farm', emoji: '🐴' },
  { id: 'caora', irish: 'caora', english: 'sheep', category: 'farm', emoji: '🐑' },
  { id: 'muc', irish: 'muc', english: 'pig', category: 'farm', emoji: '🐷' },
  { id: 'cearc', irish: 'cearc', english: 'hen', category: 'farm', emoji: '🐔' },
  { id: 'coileach', irish: 'coileach', english: 'rooster', category: 'farm', emoji: '🐓' },
  { id: 'lacha', irish: 'lacha', english: 'duck', category: 'farm', emoji: '🦆' },
  { id: 'gé', irish: 'gé', english: 'goose', category: 'farm', emoji: '🪿' },
  { id: 'gabhar', irish: 'gabhar', english: 'goat', category: 'farm', emoji: '🐐' },
  { id: 'asal', irish: 'asal', english: 'donkey', category: 'farm', emoji: '🫏' },
  
  // Pets - Peataí
  { id: 'madra', irish: 'madra', english: 'dog', category: 'pets', emoji: '🐕' },
  { id: 'cat', irish: 'cat', english: 'cat', category: 'pets', emoji: '🐈' },
  { id: 'coinín', irish: 'coinín', english: 'rabbit', category: 'pets', emoji: '🐰' },
  { id: 'hamstar', irish: 'hamstar', english: 'hamster', category: 'pets', emoji: '🐹' },
  { id: 'iasc órga', irish: 'iasc órga', english: 'goldfish', category: 'pets', emoji: '🐠' },
  
  // Wild animals - Ainmhithe fiáine
  { id: 'leon', irish: 'leon', english: 'lion', category: 'wild', emoji: '🦁' },
  { id: 'eilifint', irish: 'eilifint', english: 'elephant', category: 'wild', emoji: '🐘' },
  { id: 'síoráf', irish: 'síoráf', english: 'giraffe', category: 'wild', emoji: '🦒' },
  { id: 'moncaí', irish: 'moncaí', english: 'monkey', category: 'wild', emoji: '🐒' },
  { id: 'béar', irish: 'béar', english: 'bear', category: 'wild', emoji: '🐻' },
  { id: 'sionnach', irish: 'sionnach', english: 'fox', category: 'wild', emoji: '🦊' },
  { id: 'broc', irish: 'broc', english: 'badger', category: 'wild', emoji: '🦡' },
  { id: 'iora rua', irish: 'iora rua', english: 'squirrel', category: 'wild', emoji: '🐿️' },
  { id: 'fia', irish: 'fia', english: 'deer', category: 'wild', emoji: '🦌' },
  { id: 'tíogar', irish: 'tíogar', english: 'tiger', category: 'wild', emoji: '🐅' },
  { id: 'seabra', irish: 'seabra', english: 'zebra', category: 'wild', emoji: '🦓' },
  { id: 'nathair', irish: 'nathair', english: 'snake', category: 'wild', emoji: '🐍' },
  { id: 'crogall', irish: 'crogall', english: 'crocodile', category: 'wild', emoji: '🐊' },
  
  // Sea creatures - Ainmhithe mara
  { id: 'iasc', irish: 'iasc', english: 'fish', category: 'sea', emoji: '🐟' },
  { id: 'míol mór', irish: 'míol mór', english: 'whale', category: 'sea', emoji: '🐋' },
  { id: 'rón', irish: 'rón', english: 'seal', category: 'sea', emoji: '🦭' },
  { id: 'deilf', irish: 'deilf', english: 'dolphin', category: 'sea', emoji: '🐬' },
  { id: 'portán', irish: 'portán', english: 'crab', category: 'sea', emoji: '🦀' },
  { id: 'ochtapas', irish: 'ochtapas', english: 'octopus', category: 'sea', emoji: '🐙' },
  { id: 'sliogéisc', irish: 'sliogéisc', english: 'shellfish', category: 'sea', emoji: '🦪' },
  { id: 'siorc', irish: 'siorc', english: 'shark', category: 'sea', emoji: '🦈' },
  
  // Birds - Éin
  { id: 'éan', irish: 'éan', english: 'bird', category: 'birds', emoji: '🐦' },
  { id: 'iolar', irish: 'iolar', english: 'eagle', category: 'birds', emoji: '🦅' },
  { id: 'ulchabhán', irish: 'ulchabhán', english: 'owl', category: 'birds', emoji: '🦉' },
  { id: 'piongain', irish: 'piongain', english: 'penguin', category: 'birds', emoji: '🐧' },
  { id: 'péacóg', irish: 'péacóg', english: 'peacock', category: 'birds', emoji: '🦚' },
  { id: 'flamaingó', irish: 'flamaingó', english: 'flamingo', category: 'birds', emoji: '🦩' },
];

// Get animals by category
export const farmAnimals = animals.filter(a => a.category === 'farm');
export const wildAnimals = animals.filter(a => a.category === 'wild');
export const seaAnimals = animals.filter(a => a.category === 'sea');
export const petAnimals = animals.filter(a => a.category === 'pets');
export const birds = animals.filter(a => a.category === 'birds');

// Animal phrases for games
export const animalPhrases = {
  whatAnimal: 'Cad é an t-ainmhí seo?',
  thisIs: 'Seo',
  findThe: 'Aimsigh an',
  whereIs: 'Cá bhfuil an',
  iSee: 'Feicim',
};
