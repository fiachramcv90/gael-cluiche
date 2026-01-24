// Irish phrases for game feedback and UI
// Frásaí Gaeilge don chluiche

export const gamePhrases = {
  // Positive feedback
  correct: [
    'Maith thú!',           // Well done!
    'Iontach!',             // Excellent!
    'Ar fheabhas!',         // Brilliant!
    'Go hiontach!',         // Wonderful!
    'Tá sé sin ceart!',     // That's correct!
    'Den scoth!',           // Top class!
    'An-mhaith ar fad!',    // Very good indeed!
  ],
  
  // Encouragement after wrong answer
  tryAgain: [
    'Bain triail eile as!', // Try again!
    'Triail arís!',         // Try again!
    'Ná bíodh imní ort!',   // Don't worry!
    'Tá tú in ann é!',      // You can do it!
    'Beagnach!',            // Almost!
  ],
  
  // Game instructions
  instructions: {
    tapTheAnswer: 'Brúigh an freagra ceart',
    listenAndChoose: 'Éist agus roghnaigh',
    countTheObjects: 'Comhair na rudaí',
    findTheColor: 'Aimsigh an dath',
    spellTheWord: 'Litriú an focal',
    matchThePairs: 'Meaitseáil na péirí',
  },
  
  // UI labels
  ui: {
    play: 'Imir',
    start: 'Tosaigh',
    next: 'Ar aghaidh',
    back: 'Ar ais',
    home: 'Baile',
    menu: 'Roghchlár',
    stars: 'Réaltaí',
    score: 'Scór',
    level: 'Leibhéal',
    easy: 'Éasca',
    medium: 'Meánach',
    hard: 'Deacair',
    settings: 'Socruithe',
    sound: 'Fuaim',
    music: 'Ceol',
    quit: 'Éirigh as',
    resume: 'Lean ar aghaidh',
    restart: 'Tosaigh arís',
    yes: 'Tá',
    no: 'Níl',
  },
  
  // Game states
  states: {
    loading: 'Ag lódáil...',
    ready: 'Réidh?',
    go: 'Téigh!',
    finished: 'Críochnaithe!',
    newRecord: 'Taifead nua!',
    levelComplete: 'Leibhéal críochnaithe!',
    gameOver: 'Deireadh an chluiche',
  },
  
  // Dino character phrases
  dino: {
    greeting: 'Dia duit! Is mise Dino!',
    letsGo: 'Ar aghaidh linn!',
    great: 'Iontach!',
    oops: 'Úps!',
    celebrate: 'Tá tú go hiontach!',
    encourage: 'Ná bíodh eagla ort!',
    explain: 'Déanfaidh mé míniú...',
    bye: 'Slán go fóill!',
  },
  
  // Planet-specific
  planets: {
    numbers: {
      welcome: 'Fáilte go Pláinéad na nUimhreacha!',
      counting: 'Comhair liom!',
      addUp: 'Cuir le chéile iad!',
      takeAway: 'Bain uaidh!',
    },
    letters: {
      welcome: 'Fáilte go Pláinéad na Litreacha!',
      alphabet: 'Seo an aibítir!',
      findIt: 'Aimsigh an litir!',
    },
    colors: {
      welcome: 'Fáilte go Pláinéad na nDathanna!',
      whatColor: 'Cad é an dath?',
      paint: 'Péinteáil é!',
    },
    animals: {
      welcome: 'Fáilte go Pláinéad na nAinmhithe!',
      whoIsThis: 'Cé hé seo?',
      whatSound: 'Cad é an fhuaim?',
    },
    words: {
      welcome: 'Fáilte go Pláinéad na bhFocal!',
      whatIsThis: 'Cad é seo?',
      findIt: 'Aimsigh é!',
    },
  },
};

// Get a random phrase from a category
export function getRandomPhrase(phrases: string[]): string {
  return phrases[Math.floor(Math.random() * phrases.length)];
}

// Get random positive feedback
export function getPositiveFeedback(): string {
  return getRandomPhrase(gamePhrases.correct);
}

// Get random encouragement
export function getEncouragement(): string {
  return getRandomPhrase(gamePhrases.tryAgain);
}
