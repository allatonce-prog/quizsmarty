import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { RightSidebarDrawer } from './RightSidebarDrawer';
import { Flame, Award, User } from 'lucide-react-native';

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
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const stats = user?.stats;

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'gold': return theme.tierGold;
      case 'silver': return theme.tierSilver;
      default: return theme.tierBronze;
    }
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.card, borderBottomColor: theme.cardBorder }]}>
        <View style={styles.leftSection}>
          {title ? (
            <View>
              <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
              {subtitle ? <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text> : null}
            </View>
          ) : (
            <TouchableOpacity style={styles.userInfo} onPress={() => setDrawerVisible(true)} activeOpacity={0.8}>
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

          {/* Right Avatar Button -> Opens Right Sidebar Drawer! */}
          <TouchableOpacity
            style={[styles.avatarBtn, { backgroundColor: theme.bg, borderColor: getTierColor(stats?.tier) }]}
            onPress={() => setDrawerVisible(true)}
            activeOpacity={0.8}
          >
            <User size={18} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Slide-out Right Sidebar Drawer */}
      <RightSidebarDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onNavigateToProfile={onPressProfile}
      />
    </>
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
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
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
    gap: 10,
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
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
