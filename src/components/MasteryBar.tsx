import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface MasteryBarProps {
  label: string;
  percentage: number;
  quizzesCount?: number;
  isWeak?: boolean;
}

export const MasteryBar: React.FC<MasteryBarProps> = ({
  label,
  percentage,
  quizzesCount,
  isWeak = false,
}) => {
  const { theme } = useTheme();

  const getBarColor = () => {
    if (isWeak || percentage < 60) return theme.danger;
    if (percentage >= 85) return theme.success;
    return theme.warning;
  };

  const barColor = getBarColor();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>{label}</Text>
        <Text style={[styles.percentage, { color: barColor }]}>
          {percentage}% {isWeak ? '(Needs Review)' : ''}
        </Text>
      </View>

      <View style={[styles.track, { backgroundColor: theme.cardBorder }]}>
        <View style={[styles.fill, { width: `${Math.max(5, Math.min(100, percentage))}%`, backgroundColor: barColor }]} />
      </View>

      {quizzesCount !== undefined && (
        <Text style={[styles.subtext, { color: theme.textMuted }]}>{quizzesCount} quiz attempts recorded</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  percentage: {
    fontSize: 13,
    fontWeight: '800',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  subtext: {
    fontSize: 11,
    marginTop: 4,
  },
});
