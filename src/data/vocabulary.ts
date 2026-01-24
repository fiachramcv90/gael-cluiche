// Irish vocabulary - Focail shimplí
// Simple everyday words organized by category

export interface VocabWord {
  id: string;
  irish: string;
  english: string;
  category: 'house' | 'food' | 'body' | 'clothes' | 'family' | 'nature' | 'school';
  emoji: string;
  audio?: string;
}

export const vocabulary: VocabWord[] = [
  // House - Sa Teach
  { id: 'teach', irish: 'teach', english: 'house', category: 'house', emoji: '🏠' },
  { id: 'doras', irish: 'doras', english: 'door', category: 'house', emoji: '🚪' },
  { id: 'fuinneog', irish: 'fuinneog', english: 'window', category: 'house', emoji: '🪟' },
  { id: 'bord', irish: 'bord', english: 'table', category: 'house', emoji: '🪑' },
  { id: 'cathaoir', irish: 'cathaoir', english: 'chair', category: 'house', emoji: '🪑' },
  { id: 'leaba', irish: 'leaba', english: 'bed', category: 'house', emoji: '🛏️' },
  { id: 'cistin', irish: 'cistin', english: 'kitchen', category: 'house', emoji: '🍳' },
  { id: 'seomra', irish: 'seomra', english: 'room', category: 'house', emoji: '🏠' },
  { id: 'staighre', irish: 'staighre', english: 'stairs', category: 'house', emoji: '🪜' },
  { id: 'teilifís', irish: 'teilifís', english: 'television', category: 'house', emoji: '📺' },
  
  // Food & Drink - Bia agus Deoch
  { id: 'arán', irish: 'arán', english: 'bread', category: 'food', emoji: '🍞' },
  { id: 'bainne', irish: 'bainne', english: 'milk', category: 'food', emoji: '🥛' },
  { id: 'uisce', irish: 'uisce', english: 'water', category: 'food', emoji: '💧' },
  { id: 'úll', irish: 'úll', english: 'apple', category: 'food', emoji: '🍎' },
  { id: 'banana', irish: 'banana', english: 'banana', category: 'food', emoji: '🍌' },
  { id: 'oráiste', irish: 'oráiste', english: 'orange', category: 'food', emoji: '🍊' },
  { id: 'cáis', irish: 'cáis', english: 'cheese', category: 'food', emoji: '🧀' },
  { id: 'ubh', irish: 'ubh', english: 'egg', category: 'food', emoji: '🥚' },
  { id: 'iasc', irish: 'iasc', english: 'fish', category: 'food', emoji: '🐟' },
  { id: 'sicín', irish: 'sicín', english: 'chicken', category: 'food', emoji: '🍗' },
  { id: 'anraith', irish: 'anraith', english: 'soup', category: 'food', emoji: '🍲' },
  { id: 'milseán', irish: 'milseán', english: 'sweet/candy', category: 'food', emoji: '🍬' },
  { id: 'uachtar reoite', irish: 'uachtar reoite', english: 'ice cream', category: 'food', emoji: '🍦' },
  
  // Body - An Corp
  { id: 'ceann', irish: 'ceann', english: 'head', category: 'body', emoji: '👤' },
  { id: 'súil', irish: 'súil', english: 'eye', category: 'body', emoji: '👁️' },
  { id: 'srón', irish: 'srón', english: 'nose', category: 'body', emoji: '👃' },
  { id: 'béal', irish: 'béal', english: 'mouth', category: 'body', emoji: '👄' },
  { id: 'cluas', irish: 'cluas', english: 'ear', category: 'body', emoji: '👂' },
  { id: 'gruaig', irish: 'gruaig', english: 'hair', category: 'body', emoji: '💇' },
  { id: 'lámh', irish: 'lámh', english: 'hand', category: 'body', emoji: '✋' },
  { id: 'cos', irish: 'cos', english: 'foot/leg', category: 'body', emoji: '🦶' },
  { id: 'méar', irish: 'méar', english: 'finger', category: 'body', emoji: '☝️' },
  { id: 'bolg', irish: 'bolg', english: 'stomach', category: 'body', emoji: '🫃' },
  
  // Clothes - Éadaí
  { id: 'léine', irish: 'léine', english: 'shirt', category: 'clothes', emoji: '👔' },
  { id: 'bríste', irish: 'bríste', english: 'trousers', category: 'clothes', emoji: '👖' },
  { id: 'gúna', irish: 'gúna', english: 'dress', category: 'clothes', emoji: '👗' },
  { id: 'geansaí', irish: 'geansaí', english: 'jumper/sweater', category: 'clothes', emoji: '🧥' },
  { id: 'cóta', irish: 'cóta', english: 'coat', category: 'clothes', emoji: '🧥' },
  { id: 'hata', irish: 'hata', english: 'hat', category: 'clothes', emoji: '🎩' },
  { id: 'bróga', irish: 'bróga', english: 'shoes', category: 'clothes', emoji: '👟' },
  { id: 'stocaí', irish: 'stocaí', english: 'socks', category: 'clothes', emoji: '🧦' },
  { id: 'sciorta', irish: 'sciorta', english: 'skirt', category: 'clothes', emoji: '👗' },
  { id: 'scairf', irish: 'scairf', english: 'scarf', category: 'clothes', emoji: '🧣' },
  
  // Family - An Teaghlach
  { id: 'máthair', irish: 'máthair', english: 'mother', category: 'family', emoji: '👩' },
  { id: 'athair', irish: 'athair', english: 'father', category: 'family', emoji: '👨' },
  { id: 'mamaí', irish: 'mamaí', english: 'mammy', category: 'family', emoji: '👩' },
  { id: 'daidí', irish: 'daidí', english: 'daddy', category: 'family', emoji: '👨' },
  { id: 'deartháir', irish: 'deartháir', english: 'brother', category: 'family', emoji: '👦' },
  { id: 'deirfiúr', irish: 'deirfiúr', english: 'sister', category: 'family', emoji: '👧' },
  { id: 'seanmháthair', irish: 'seanmháthair', english: 'grandmother', category: 'family', emoji: '👵' },
  { id: 'seanathair', irish: 'seanathair', english: 'grandfather', category: 'family', emoji: '👴' },
  
  // Nature - An Dúlra
  { id: 'grian', irish: 'grian', english: 'sun', category: 'nature', emoji: '☀️' },
  { id: 'gealach', irish: 'gealach', english: 'moon', category: 'nature', emoji: '🌙' },
  { id: 'réalta', irish: 'réalta', english: 'star', category: 'nature', emoji: '⭐' },
  { id: 'crann', irish: 'crann', english: 'tree', category: 'nature', emoji: '🌳' },
  { id: 'bláth', irish: 'bláth', english: 'flower', category: 'nature', emoji: '🌸' },
  { id: 'féar', irish: 'féar', english: 'grass', category: 'nature', emoji: '🌿' },
  { id: 'farraige', irish: 'farraige', english: 'sea', category: 'nature', emoji: '🌊' },
  { id: 'sliabh', irish: 'sliabh', english: 'mountain', category: 'nature', emoji: '⛰️' },
  { id: 'abhainn', irish: 'abhainn', english: 'river', category: 'nature', emoji: '🏞️' },
  { id: 'scamall', irish: 'scamall', english: 'cloud', category: 'nature', emoji: '☁️' },
  { id: 'báisteach', irish: 'báisteach', english: 'rain', category: 'nature', emoji: '🌧️' },
];

// Get vocabulary by category
export const houseWords = vocabulary.filter(v => v.category === 'house');
export const foodWords = vocabulary.filter(v => v.category === 'food');
export const bodyWords = vocabulary.filter(v => v.category === 'body');
export const clothesWords = vocabulary.filter(v => v.category === 'clothes');
export const familyWords = vocabulary.filter(v => v.category === 'family');
export const natureWords = vocabulary.filter(v => v.category === 'nature');

// Vocabulary phrases for games
export const vocabPhrases = {
  whatIsThis: 'Cad é seo?',
  thisIs: 'Seo',
  findThe: 'Aimsigh an',
  pointTo: 'Taispeáin dom',
};
