import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Flame, Award, Sun, Moon, User } from 'lucide-react-native';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onPressProfile?: () => void;
  onPressSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onPressProfile,
  onPressSettings,
}) => {
  const { user } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const stats = user?.stats;

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'gold': return theme.tierGold;
      case 'silver': return theme.tierSilver;
      default: return theme.tierBronze;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderBottomColor: theme.cardBorder }]}>
      <View style={styles.leftSection}>
        {title ? (
          <View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
            {subtitle ? <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text> : null}
          </View>
        ) : (
          <TouchableOpacity style={styles.userInfo} onPress={onPressProfile} activeOpacity={0.8}>
            <View style={[styles.avatar, { borderColor: getTierColor(stats?.tier), backgroundColor: theme.bg }]}>
              <User size={20} color={theme.textPrimary} />
            </View>
            <View>
              <Text style={[styles.userName, { color: theme.textPrimary }]}>{user?.displayName || 'Student'}</Text>
              <View style={styles.tierPill}>
                <Award size={12} color={getTierColor(stats?.tier)} />
                <Text style={[styles.tierText, { color: getTierColor(stats?.tier) }]}>
                  {(stats?.tier || 'bronze').toUpperCase()} • Lvl {stats?.level || 1}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.rightSection}>
        {/* Streak Badge */}
        <View style={[styles.streakBadge, { backgroundColor: theme.warningBg, borderColor: `${theme.warning}40` }]}>
          <Flame size={15} color={theme.warning} />
          <Text style={[styles.streakText, { color: theme.warning }]}>{stats?.currentStreakDays || 1} Day</Text>
        </View>

        {/* Dark/Light Mode Toggle */}
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: theme.bg, borderColor: theme.cardBorder }]}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          {isDark ? <Sun size={18} color={theme.warning} /> : <Moon size={18} color={theme.primary} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
