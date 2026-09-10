import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { RightSidebarDrawer } from './RightSidebarDrawer';
import { Sparkles, User } from 'lucide-react-native';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onPressProfile?: () => void;
  onPressSettings?: () => void;
  navigation?: any;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onPressProfile,
  navigation,
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const stats = user?.stats;

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  return (
    <>
      <View style={[styles.container, { backgroundColor: theme.card, borderBottomColor: theme.cardBorder }]}>
        {/* Left Section: App Brand Name */}
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.brandRow}
            onPress={() => setDrawerVisible(true)}
            activeOpacity={0.85}
          >
            <View style={[styles.logoIconBadge, { backgroundColor: theme.skyBlueBg }]}>
              <Sparkles size={18} color={theme.skyBlue} />
            </View>
            <View>
              <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>
                {title || 'QuizSmarty'}
                {!title && <Text style={{ color: theme.skyBlue }}> AI</Text>}
              </Text>
              {subtitle ? <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text> : null}
            </View>
          </TouchableOpacity>
        </View>

        {/* Right Section: Profile Drawer Avatar Icon Button */}
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={[styles.avatarBtn, { backgroundColor: theme.bg, borderColor: theme.skyBlue }]}
            onPress={() => setDrawerVisible(true)}
            activeOpacity={0.8}
          >
            <User size={18} color={theme.skyBlue} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Slide-out Formal Right Sidebar Drawer */}
      <RightSidebarDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onNavigateToProfile={onPressProfile}
        onNavigateToLogin={() => {
          if (navigation) navigation.navigate('Login');
        }}
        onNavigateToAnalytics={() => {
          if (navigation) navigation.navigate('Analytics');
        }}
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
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

