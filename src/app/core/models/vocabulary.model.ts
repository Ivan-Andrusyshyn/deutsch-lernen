export type WordKind = 'noun' | 'verb' | 'adjective';
export type LearningLanguage = 'de' | 'en';
export type AppTheme = 'light' | 'dark';
export type DailyGoal = 3 | 5 | 10 | 15;
export type LearningLevel = 'A2' | 'B1';

export interface WordCard {
  id: string;
  word: string;
  translation: string;
  translationEnglish: string;
  category: string;
  kind: WordKind;
  phrase: string;
  example: string;
  level: LearningLevel;
}

export interface Phrase {
  text: string;
  translation: string;
  example: string;
}

export interface ReadingText {
  title: string;
  level: string;
  body: string;
  translation: string;
  questions: Array<{ question: string; answer: string }>;
}
