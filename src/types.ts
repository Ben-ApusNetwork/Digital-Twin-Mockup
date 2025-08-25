
export enum AppStep {
  BIO = 'BIO',
  QUIZ = 'QUIZ',
  GENERATING = 'GENERATING',
  CHAT = 'CHAT',
  RATING = 'RATING',
  FINAL = 'FINAL',
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'text' | 'choice';
  options?: string[];
}

export type QuizAnswers = Record<string, string>;

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface Ratings {
  accuracy: number;
  consciousness: number;
  note: string;
}