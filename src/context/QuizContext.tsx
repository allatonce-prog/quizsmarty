import React, { createContext, useContext, useState, useEffect } from 'react';
import { Quiz, QuizAttempt, MistakeItem, QuizConfig, SubjectMastery } from '../types/quiz';
import { Badge, UserStats } from '../types/achievement';
import { storageService } from '../services/storageService';
import { geminiService } from '../services/geminiService';
import { analyticsService } from '../services/analyticsService';
import { achievementService } from '../services/achievementService';
import { useAuth } from './AuthContext';

interface QuizContextType {
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  mistakes: MistakeItem[];
  badges: Badge[];
  subjectMasteries: SubjectMastery[];
  weakTopics: { topic: string; subject: string; accuracy: number; totalCount: number }[];
  activeQuiz: Quiz | null;
  setActiveQuiz: (quiz: Quiz | null) => void;
  latestAttempt: QuizAttempt | null;
  newlyUnlockedBadges: Badge[];
  clearNewUnlocks: () => void;
  isGenerating: boolean;
  generateQuiz: (config: QuizConfig) => Promise<Quiz>;
  submitAttempt: (quiz: Quiz, userAnswers: Record<string, string>, durationSeconds: number) => Promise<QuizAttempt>;
  resolveMistake: (mistakeId: string) => Promise<void>;
  retakeMistakesAsQuiz: (items: MistakeItem[]) => Quiz;
  refreshData: () => Promise<void>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { apiKey, updateProfileStats, user } = useAuth();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [subjectMasteries, setSubjectMasteries] = useState<SubjectMastery[]>([]);
  const [weakTopics, setWeakTopics] = useState<{ topic: string; subject: string; accuracy: number; totalCount: number }[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<Badge[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const loadedQuizzes = await storageService.getQuizzes();
    const loadedAttempts = await storageService.getAttempts();
    const loadedMistakes = await storageService.getMistakes();
    const loadedBadges = await storageService.getBadges();

    setQuizzes(loadedQuizzes);
    setAttempts(loadedAttempts);
    setMistakes(loadedMistakes);
    setBadges(loadedBadges);

    const masteries = analyticsService.calculateSubjectMastery(loadedAttempts);
    const weak = analyticsService.detectWeakTopics(loadedAttempts);

    setSubjectMasteries(masteries);
    setWeakTopics(weak);
  };

  const generateQuiz = async (config: QuizConfig): Promise<Quiz> => {
    setIsGenerating(true);
    try {
      const questions = await geminiService.generateQuiz(config, apiKey || undefined);

      const newQuiz: Quiz = {
        id: `quiz_${Date.now()}`,
        title: config.title || `Quiz on ${config.subject}`,
        subject: config.subject || 'General Studies',
        difficulty: config.difficulty,
        documentName: config.documentName,
        questions,
        createdAt: new Date().toISOString(),
      };

      await storageService.saveQuiz(newQuiz);
      setQuizzes((prev) => [newQuiz, ...prev]);

      // Update upload count stat
      if (config.documentName) {
        await updateProfileStats((prev) => ({
          ...prev,
          documentsUploaded: prev.documentsUploaded + 1,
        }));
      }

      return newQuiz;
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAttempt = async (quiz: Quiz, userAnswers: Record<string, string>, durationSeconds: number): Promise<QuizAttempt> => {
    let score = 0;
    const missedQuestions = quiz.questions.filter((q) => {
      const uAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const cAns = (q.correctAnswer || '').trim().toLowerCase();
      const isCorrect = uAns === cAns || (q.type === 'enumeration' && cAns.includes(uAns) && uAns.length > 0);
      if (isCorrect) {
        score += 1;
        return false;
      }
      return true;
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Identify weak topics for this attempt
    const weakTopicsInAttempt = Array.from(new Set(missedQuestions.map((q) => q.topicTag)));

    const newAttempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      quizId: quiz.id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      score,
      totalQuestions,
      percentage,
      date: new Date().toISOString(),
      durationSeconds,
      answers: userAnswers,
      missedQuestions,
      weakTopics: weakTopicsInAttempt,
    };

    await storageService.saveAttempt(newAttempt);
    setAttempts((prev) => [newAttempt, ...prev]);
    setLatestAttempt(newAttempt);

    // Auto-add missed questions to Mistake Bank
    for (const missedQ of missedQuestions) {
      const mistake: MistakeItem = {
        id: `mistake_${missedQ.id}_${Date.now()}`,
        question: missedQ,
        quizTitle: quiz.title,
        subject: quiz.subject,
        dateAdded: new Date().toISOString(),
        userAnswer: userAnswers[missedQ.id] || 'No answer',
        timesRetaken: 0,
        mastered: false,
      };
      await storageService.addMistake(mistake);
    }

    // Refresh mistakes list
    const updatedMistakes = await storageService.getMistakes();
    setMistakes(updatedMistakes);

    // Update User Stats
    let newStats: UserStats = { ...user!.stats };
    await updateProfileStats((prev) => {
      const newTotalTaken = prev.totalQuizzesTaken + 1;
      const newTotalAnswered = prev.totalQuestionsAnswered + totalQuestions;
      const newCorrectCount = prev.correctAnswersCount + score;
      const newAccuracy = Math.round((newCorrectCount / newTotalAnswered) * 100);

      newStats = {
        ...prev,
        totalQuizzesTaken: newTotalTaken,
        totalQuestionsAnswered: newTotalAnswered,
        correctAnswersCount: newCorrectCount,
        accuracyRate: newAccuracy,
      };
      return newStats;
    });

    // Check Badges & XP Awards
    const { updatedBadges, newUnlocks, updatedStats } = achievementService.checkBadges(newStats, badges, newAttempt);

    if (newUnlocks.length > 0) {
      setNewlyUnlockedBadges(newUnlocks);
    }

    await storageService.saveBadges(updatedBadges);
    await storageService.saveUserStats(updatedStats);
    setBadges(updatedBadges);

    // Refresh analytics metrics
    const updatedAttempts = [newAttempt, ...attempts];
    setSubjectMasteries(analyticsService.calculateSubjectMastery(updatedAttempts));
    setWeakTopics(analyticsService.detectWeakTopics(updatedAttempts));

    return newAttempt;
  };

  const resolveMistake = async (mistakeId: string) => {
    const list = mistakes.map((m) => (m.id === mistakeId ? { ...m, mastered: true } : m));
    await storageService.saveMistakes(list);
    setMistakes(list);

    await updateProfileStats((prev) => ({
      ...prev,
      mistakesResolved: prev.mistakesResolved + 1,
    }));
  };

  const retakeMistakesAsQuiz = (items: MistakeItem[]): Quiz => {
    const questions = items.map((m) => m.question);
    return {
      id: `retake_${Date.now()}`,
      title: `Mistake Bank Practice (${items.length} Items)`,
      subject: items[0]?.subject || 'Targeted Practice',
      difficulty: 'medium',
      questions,
      createdAt: new Date().toISOString(),
    };
  };

  const clearNewUnlocks = () => {
    setNewlyUnlockedBadges([]);
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        attempts,
        mistakes,
        badges,
        subjectMasteries,
        weakTopics,
        activeQuiz,
        setActiveQuiz,
        latestAttempt,
        newlyUnlockedBadges,
        clearNewUnlocks,
        isGenerating,
        generateQuiz,
        submitAttempt,
        resolveMistake,
        retakeMistakesAsQuiz,
        refreshData,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
};
