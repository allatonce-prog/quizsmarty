import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Badge } from '../types/achievement';
import { colors } from '../theme/colors';
import { Award, Sparkles, X } from 'lucide-react-native';

interface CelebrationModalProps {
  badges: Badge[];
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({ badges, onClose }) => {
  if (!badges || badges.length === 0) return null;
  const currentBadge = badges[0];

  return (
    <Modal transparent animationType="fade" visible={badges.length > 0}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={20} color={colors.textDarkSecondary} />
          </TouchableOpacity>

          <View style={styles.sparkleIcon}>
            <Sparkles size={36} color={colors.warning} />
          </View>

          <Text style={styles.congrats}>ACHIEVEMENT UNLOCKED!</Text>

          <View style={styles.badgeBox}>
            <Award size={48} color={colors.tierGold} />
            <Text style={styles.badgeTitle}>{currentBadge.title}</Text>
            <Text style={styles.badgeDesc}>{currentBadge.description}</Text>
          </View>

          <View style={styles.xpPill}>
            <Text style={styles.xpText}>+{currentBadge.xpReward} XP EARNED!</Text>
          </View>

          <TouchableOpacity style={styles.claimBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.claimText}>AWESOME!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: colors.cardDark,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.tierGold,
    shadowColor: colors.tierGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  sparkleIcon: {
    marginBottom: 8,
  },
  congrats: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.warning,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  badgeBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  badgeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDarkPrimary,
    marginTop: 10,
  },
  badgeDesc: {
    fontSize: 13,
    color: colors.textDarkSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  xpPill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  xpText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
  },
  claimBtn: {
    backgroundColor: colors.success,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  claimText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1,
  },
});
