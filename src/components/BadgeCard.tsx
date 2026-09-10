import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge } from '../types/achievement';
import { useTheme } from '../theme/ThemeContext';
import { Award, BookOpen, Zap, FileText, CheckCircle, Crown, Lock } from 'lucide-react-native';

interface BadgeCardProps {
  badge: Badge;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  const { theme } = useTheme();

  const getBadgeIcon = () => {
    const size = 24;
    const color = badge.unlocked ? theme.textPrimary : theme.textMuted;

    switch (badge.iconName) {
      case 'BookOpen': return <BookOpen size={size} color={color} />;
      case 'Zap': return <Zap size={size} color={color} />;
      case 'FileText': return <FileText size={size} color={color} />;
      case 'CheckCircle': return <CheckCircle size={size} color={color} />;
      case 'Crown': return <Crown size={size} color={color} />;
      default: return <Award size={size} color={color} />;
    }
  };

  const getTierBorder = () => {
    if (!badge.unlocked) return theme.cardBorder;
    switch (badge.tier) {
      case 'gold': return theme.tierGold;
      case 'silver': return theme.tierSilver;
      default: return theme.tierBronze;
    }
  };

  const progressPercent = Math.round((badge.progress / badge.maxProgress) * 100);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: getTierBorder(),
        },
        !badge.unlocked && styles.lockedCard,
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: badge.unlocked ? `${getTierBorder()}25` : theme.inputBg }]}>
        {badge.unlocked ? getBadgeIcon() : <Lock size={20} color={theme.textMuted} />}
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: badge.unlocked ? theme.textPrimary : theme.textSecondary }]}>
            {badge.title}
          </Text>
          <View style={[styles.tierTag, { backgroundColor: `${getTierBorder()}20` }]}>
            <Text style={[styles.tierTagText, { color: getTierBorder() }]}>
              {badge.tier.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={2}>
          {badge.description}
        </Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressTrack, { backgroundColor: theme.inputBg }]}>
            <View style={[styles.progressFill, { width: `${Math.min(100, progressPercent)}%`, backgroundColor: getTierBorder() }]} />
          </View>
          <Text style={[styles.progressText, { color: theme.textMuted }]}>
            {badge.unlocked ? 'UNLOCKED' : `${badge.progress}/${badge.maxProgress}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    marginVertical: 6,
  },
  lockedCard: {
    opacity: 0.75,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  tierTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tierTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
