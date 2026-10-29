export type WordKind = 'noun' | 'verb' | 'adjective';

export interface WordCard {
  id: string;
  word: string;
  translation: string;
  translationEnglish: string;
  category: string;
  kind: WordKind;
  phrase: string;
  example: string;
}

export interface Phrase {
  german: string;
  translation: string;
  example: string;
}

export interface ReadingText {
  title: string;
  level: string;
  german: string;
  translation: string;
  questions: Array<{ question: string; answer: string }>;
}
