import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { BadgeCard } from '../components/BadgeCard';
import { Tier } from '../types/achievement';
import { achievementsStyles as styles } from './AchievementsScreen.styles';
import { Crown } from 'lucide-react-native';

export const AchievementsScreen: React.FC = () => {
  const { badges } = useQuiz();
  const { user } = useAuth();
  const stats = user?.stats;

  const [selectedTier, setSelectedTier] = useState<Tier | 'all'>('all');

  const filteredBadges = badges.filter((b) => {
    if (selectedTier !== 'all') return b.tier === selectedTier;
    return true;
  });

  const getTierColor = (t?: string) => {
    switch (t) {
      case 'gold': return colors.tierGold;
      case 'silver': return colors.tierSilver;
      default: return colors.tierBronze;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tier Recognition Card */}
        <View style={styles.tierHeroCard}>
          <View style={[styles.crownIcon, { backgroundColor: `${getTierColor(stats?.tier)}20` }]}>
            <Crown size={36} color={getTierColor(stats?.tier)} />
          </View>

          <Text style={[styles.tierTitle, { color: getTierColor(stats?.tier) }]}>
            {(stats?.tier || 'bronze').toUpperCase()} RECOGNITION TIER
          </Text>
          <Text style={styles.levelText}>Level {stats?.level || 1} Academician</Text>

          <View style={styles.xpRow}>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${Math.min(100, ((stats?.xp || 0) % 200) / 2)}%` }]} />
            </View>
            <Text style={styles.xpSubtext}>{stats?.xp || 0} XP</Text>
          </View>
        </View>

        {/* Tier Selector */}
        <Text style={styles.sectionHeader}>Recognition Tiers & Badges</Text>
        <View style={styles.tierFilterRow}>
          {(['all', 'bronze', 'silver', 'gold'] as const).map((tier) => (
            <TouchableOpacity
              key={tier}
              style={[styles.tierFilterBtn, selectedTier === tier && styles.tierFilterBtnActive]}
              onPress={() => setSelectedTier(tier)}
            >
              <Text style={[styles.tierFilterText, selectedTier === tier && styles.tierFilterTextActive]}>
                {tier.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Badges List */}
        {filteredBadges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </ScrollView>
    </View>
  );
};
