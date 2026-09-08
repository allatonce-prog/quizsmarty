import { QuizAttempt, SubjectMastery } from '../types/quiz';

export const analyticsService = {
  /**
   * Detects weak topics where average accuracy is below 65%
   */
  detectWeakTopics(attempts: QuizAttempt[]): { topic: string; subject: string; accuracy: number; totalCount: number }[] {
    const topicStats: Record<string, { correct: number; total: number; subject: string }> = {};

    attempts.forEach((attempt) => {
      // Analyze missed questions for topic tags
      attempt.missedQuestions.forEach((q) => {
        const topic = q.topicTag || 'General Concept';
        if (!topicStats[topic]) {
          topicStats[topic] = { correct: 0, total: 0, subject: attempt.subject };
        }
        topicStats[topic].total += 1;
      });

      // Analyze overall score to estimate correct answers across topics
      const correctCount = attempt.score;
      const totalCount = attempt.totalQuestions;
      const sampleTopic = attempt.subject || 'General';

      if (!topicStats[sampleTopic]) {
        topicStats[sampleTopic] = { correct: 0, total: 0, subject: attempt.subject };
      }
      topicStats[sampleTopic].correct += correctCount;
      topicStats[sampleTopic].total += totalCount;
    });

    const weakTopics: { topic: string; subject: string; accuracy: number; totalCount: number }[] = [];

    Object.entries(topicStats).forEach(([topic, stat]) => {
      const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      if (accuracy < 70 && stat.total >= 1) {
        weakTopics.push({
          topic,
          subject: stat.subject,
          accuracy,
          totalCount: stat.total,
        });
      }
    });

    return weakTopics.sort((a, b) => a.accuracy - b.accuracy);
  },

  /**
   * Calculates overall subject mastery percentages
   */
  calculateSubjectMastery(attempts: QuizAttempt[]): SubjectMastery[] {
    const map: Record<string, { scoreSum: number; questionSum: number; count: number; weak: Set<string>; strong: Set<string> }> = {};

    attempts.forEach((a) => {
      const subj = a.subject || 'General Studies';
      if (!map[subj]) {
        map[subj] = { scoreSum: 0, questionSum: 0, count: 0, weak: new Set(), strong: new Set() };
      }
      map[subj].scoreSum += a.score;
      map[subj].questionSum += a.totalQuestions;
      map[subj].count += 1;

      a.weakTopics.forEach((t) => map[subj].weak.add(t));
      if (a.percentage >= 80) {
        a.missedQuestions.length === 0 && map[subj].strong.add(`${subj} Mastery`);
      }
    });

    return Object.entries(map).map(([subject, data]) => {
      const masteryPercentage = data.questionSum > 0 ? Math.round((data.scoreSum / data.questionSum) * 100) : 0;
      return {
        subject,
        quizzesTaken: data.count,
        averageScore: Math.round(data.scoreSum / (data.count || 1)),
        totalQuestionsAnswered: data.questionSum,
        masteryPercentage,
        weakTopics: Array.from(data.weak),
        strongTopics: Array.from(data.strong),
      };
    });
  },
};
