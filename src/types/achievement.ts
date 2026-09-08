export type Tier = 'bronze' | 'silver' | 'gold';

export type AchievementCategory = 
  | 'quiz_count' 
  | 'mastery' 
  | 'streak' 
  | 'accuracy' 
  | 'mistake_master'
  | 'document_uploader';

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  tier: Tier;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // Current count / percentage
  maxProgress: number; // Threshold needed
  xpReward: number;
}

export interface UserStats {
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  accuracyRate: number; // 0-100%
  currentStreakDays: number;
  bestStreakDays: number;
  documentsUploaded: number;
  mistakesResolved: number;
  xp: number;
  level: number;
  tier: Tier;
}
