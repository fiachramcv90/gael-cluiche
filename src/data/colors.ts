// Irish colors - Dathanna na Gaeilge

export interface ColorWord {
  id: string;
  irish: string;
  english: string;
  hex: string;
  audio?: string;
}

export const colors: ColorWord[] = [
  { id: 'dearg', irish: 'dearg', english: 'red', hex: '#e63946' },
  { id: 'glas', irish: 'glas', english: 'green', hex: '#2a9d8f' },
  { id: 'gorm', irish: 'gorm', english: 'blue', hex: '#3a86ff' },
  { id: 'buí', irish: 'buí', english: 'yellow', hex: '#ffbe0b' },
  { id: 'bán', irish: 'bán', english: 'white', hex: '#f8f9fa' },
  { id: 'dubh', irish: 'dubh', english: 'black', hex: '#212529' },
  { id: 'donn', irish: 'donn', english: 'brown', hex: '#8b4513' },
  { id: 'oráiste', irish: 'oráiste', english: 'orange', hex: '#fb8500' },
  { id: 'bándearg', irish: 'bándearg', english: 'pink', hex: '#ff69b4' },
  { id: 'corcra', irish: 'corcra', english: 'purple', hex: '#7b2cbf' },
  { id: 'liath', irish: 'liath', english: 'grey', hex: '#6c757d' },
];

// Color phrases for games
export const colorPhrases = {
  whatColor: 'Cad é an dath?',
  thisIs: 'Seo',
  correct: 'Ceart! Tá sé',
  theColorIs: 'Is é an dath ná',
  findThe: 'Aimsigh an dath',
  paintIt: 'Péinteáil é',
};
