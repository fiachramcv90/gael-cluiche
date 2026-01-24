// Irish numbers - Ulster dialect forms
// Uimhreacha na Gaeilge - canúint Uladh

export interface NumberWord {
  value: number;
  irish: string;
  audio?: string;
}

// Numbers 1-20
export const numbers1to20: NumberWord[] = [
  { value: 1, irish: 'a haon' },
  { value: 2, irish: 'a dó' },
  { value: 3, irish: 'a trí' },
  { value: 4, irish: 'a ceathair' },
  { value: 5, irish: 'a cúig' },
  { value: 6, irish: 'a sé' },
  { value: 7, irish: 'a seacht' },
  { value: 8, irish: 'a hocht' },
  { value: 9, irish: 'a naoi' },
  { value: 10, irish: 'a deich' },
  { value: 11, irish: 'a haon déag' },
  { value: 12, irish: 'a dó dhéag' },
  { value: 13, irish: 'a trí déag' },
  { value: 14, irish: 'a ceathair déag' },
  { value: 15, irish: 'a cúig déag' },
  { value: 16, irish: 'a sé déag' },
  { value: 17, irish: 'a seacht déag' },
  { value: 18, irish: 'a hocht déag' },
  { value: 19, irish: 'a naoi déag' },
  { value: 20, irish: 'fiche' },
];

// Tens 10-100
export const tens: NumberWord[] = [
  { value: 10, irish: 'a deich' },
  { value: 20, irish: 'fiche' },
  { value: 30, irish: 'tríocha' },
  { value: 40, irish: 'daichead' },
  { value: 50, irish: 'caoga' },
  { value: 60, irish: 'seasca' },
  { value: 70, irish: 'seachtó' },
  { value: 80, irish: 'ochtó' },
  { value: 90, irish: 'nócha' },
  { value: 100, irish: 'céad' },
];

// Generate all numbers 1-100
export function getIrishNumber(n: number): string {
  if (n <= 0 || n > 100) return '';
  if (n <= 20) return numbers1to20[n - 1].irish;
  if (n === 100) return 'céad';
  
  const tensDigit = Math.floor(n / 10);
  const unitsDigit = n % 10;
  
  if (unitsDigit === 0) {
    return tens[tensDigit - 1].irish;
  }
  
  // Ulster Irish uses "is" to connect tens and units
  // e.g., 21 = fiche a haon (or sometimes "fiche is a haon")
  const tensWord = tens[tensDigit - 1].irish;
  const unitsWord = numbers1to20[unitsDigit - 1].irish;
  
  return `${tensWord} ${unitsWord}`;
}

// Generate full number list for games
export const allNumbers: NumberWord[] = Array.from({ length: 100 }, (_, i) => ({
  value: i + 1,
  irish: getIrishNumber(i + 1),
}));

// Counting words (for objects)
export const countingPrefixes: Record<number, string> = {
  1: 'aon',
  2: 'dhá',
  3: 'trí',
  4: 'ceithre',
  5: 'cúig',
  6: 'sé',
  7: 'seacht',
  8: 'ocht',
  9: 'naoi',
  10: 'deich',
};

// Math operation words
export const mathWords = {
  plus: 'móide', // or 'agus' informally
  minus: 'lúide',
  equals: 'sin',
  add: 'cuir le',
  subtract: 'bain de',
};
