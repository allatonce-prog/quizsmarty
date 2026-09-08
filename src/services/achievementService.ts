import { Badge, Tier, UserStats } from '../types/achievement';
import { QuizAttempt } from '../types/quiz';

export const achievementService = {
  /**
   * Evaluates user stats and unlocks qualifying badges & returns newly unlocked badges
   */
  checkBadges(stats: UserStats, currentBadges: Badge[], latestAttempt?: QuizAttempt): { updatedBadges: Badge[]; newUnlocks: Badge[]; updatedStats: UserStats } {
    let xpGained = 0;
    const newUnlocks: Badge[] = [];

    const updatedBadges = currentBadges.map((badge) => {
      if (badge.unlocked) return badge;

      let currentProgress = badge.progress;
      let shouldUnlock = false;

      switch (badge.category) {
        case 'quiz_count':
          currentProgress = stats.totalQuizzesTaken;
          if (currentProgress >= badge.maxProgress) shouldUnlock = true;
          break;

        case 'accuracy':
          if (latestAttempt && latestAttempt.percentage >= 100) {
            currentProgress = 1;
            shouldUnlock = true;
          }
          break;

        case 'document_uploader':
          currentProgress = stats.documentsUploaded;
          if (currentProgress >= badge.maxProgress) shouldUnlock = true;
          break;

        case 'mistake_master':
          currentProgress = stats.mistakesResolved;
          if (currentProgress >= badge.maxProgress) shouldUnlock = true;
          break;

        case 'mastery':
          currentProgress = stats.accuracyRate;
          if (currentProgress >= badge.maxProgress) shouldUnlock = true;
          break;
      }

      if (shouldUnlock) {
        xpGained += badge.xpReward;
        const unlockedBadge: Badge = {
          ...badge,
          unlocked: true,
          progress: badge.maxProgress,
          unlockedAt: new Date().toISOString(),
        };
        newUnlocks.push(unlockedBadge);
        return unlockedBadge;
      }

      return {
        ...badge,
        progress: Math.min(currentProgress, badge.maxProgress),
      };
    });

    const newXP = stats.xp + xpGained;
    const newLevel = Math.floor(newXP / 200) + 1;

    let tier: Tier = 'bronze';
    if (newLevel >= 10) tier = 'gold';
    else if (newLevel >= 5) tier = 'silver';

    const updatedStats: UserStats = {
      ...stats,
      xp: newXP,
      level: newLevel,
      tier,
    };

    return {
      updatedBadges,
      newUnlocks,
      updatedStats,
    };
  },
};
