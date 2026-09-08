export type QuestionType = 'multiple_choice' | 'true_false' | 'enumeration';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // Required for multiple choice
  correctAnswer: string; // Or comma-separated/array for enumeration
  explanation: string;
  topicTag: string; // Used for Weak Topic Detection
}

export interface QuizConfig {
  title: string;
  subject: string;
  numQuestions: number; // 5 to 50 items
  types: QuestionType[];
  difficulty: DifficultyLevel;
  documentName?: string;
  rawText: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  difficulty: DifficultyLevel;
  documentName?: string;
  questions: Question[];
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  durationSeconds: number;
  answers: Record<string, string>; // questionId -> user answer
  missedQuestions: Question[];
  weakTopics: string[];
}

export interface MistakeItem {
  id: string;
  question: Question;
  quizTitle: string;
  subject: string;
  dateAdded: string;
  userAnswer: string;
  timesRetaken: number;
  mastered: boolean;
}

export interface SubjectMastery {
  subject: string;
  quizzesTaken: number;
  averageScore: number;
  totalQuestionsAnswered: number;
  masteryPercentage: number; // 0 to 100%
  weakTopics: string[];
  strongTopics: string[];
}
