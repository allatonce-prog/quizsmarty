import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge } from '../types/achievement';
import { colors } from '../theme/colors';
import { Award, BookOpen, Zap, FileText, CheckCircle, Crown, Lock } from 'lucide-react-native';

interface BadgeCardProps {
  badge: Badge;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  const getBadgeIcon = () => {
    const size = 24;
    const color = badge.unlocked ? colors.textDarkPrimary : colors.textDarkMuted;

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
    if (!badge.unlocked) return colors.cardDarkBorder;
    switch (badge.tier) {
      case 'gold': return colors.tierGold;
      case 'silver': return colors.tierSilver;
      default: return colors.tierBronze;
    }
  };

  const progressPercent = Math.round((badge.progress / badge.maxProgress) * 100);

  return (
    <View style={[styles.card, { borderColor: getTierBorder() }, !badge.unlocked && styles.lockedCard]}>
      <View style={[styles.iconBox, { backgroundColor: badge.unlocked ? `${getTierBorder()}30` : colors.cardDarkBorder }]}>
        {badge.unlocked ? getBadgeIcon() : <Lock size={20} color={colors.textDarkMuted} />}
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, !badge.unlocked && styles.mutedText]}>{badge.title}</Text>
          <View style={[styles.tierTag, { backgroundColor: `${getTierBorder()}20` }]}>
            <Text style={[styles.tierTagText, { color: getTierBorder() }]}>
              {badge.tier.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>{badge.description}</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(100, progressPercent)}%`, backgroundColor: getTierBorder() }]} />
          </View>
          <Text style={styles.progressText}>
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
    backgroundColor: colors.cardDark,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    marginVertical: 6,
  },
  lockedCard: {
    opacity: 0.7,
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
    color: colors.textDarkPrimary,
  },
  mutedText: {
    color: colors.textDarkSecondary,
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
    color: colors.textDarkSecondary,
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
    backgroundColor: colors.cardDarkBorder,
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
    color: colors.textDarkMuted,
  },
});
