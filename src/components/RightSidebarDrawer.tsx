import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Dimensions, Easing } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Award, Sun, Moon, X, Settings, ChevronRight, BarChart2 } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RightSidebarDrawerProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToLogin?: () => void;
  onNavigateToAnalytics?: () => void;
}

export const RightSidebarDrawer: React.FC<RightSidebarDrawerProps> = ({
  visible,
  onClose,
  onNavigateToProfile,
  onNavigateToLogin,
  onNavigateToAnalytics,
}) => {
  const { user, logout } = useAuth();
  const { theme, mode, setMode } = useTheme();
  const [modalVisible, setModalVisible] = useState<boolean>(visible);

  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_WIDTH,
          duration: 220,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(false);
      });
    }
  }, [visible]);

  const handleClose = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 220,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      if (callback) callback();
    });
  };

  const handleLogout = async () => {
    handleClose(async () => {
      await logout();
      if (onNavigateToLogin) {
        onNavigateToLogin();
      }
    });
  };

  if (!modalVisible && !visible) return null;

  return (
    <Modal transparent visible={modalVisible} onRequestClose={() => handleClose()} animationType="none">
      <View style={styles.overlay}>
        {/* Animated Smooth Backdrop Fade */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.65],
              }),
            },
          ]}
        >
          <TouchableOpacity style={styles.backdropPressable} activeOpacity={1} onPress={() => handleClose()} />
        </Animated.View>

        {/* Sliding Formal Right Drawer Panel */}
        <Animated.View
          style={[
            styles.drawerContainer,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Drawer Header */}
          <View style={[styles.drawerHeader, { borderBottomColor: theme.cardBorder }]}>
            <Text style={[styles.drawerTitle, { color: theme.textPrimary }]}>Account & Settings</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => handleClose()}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.drawerContent} showsVerticalScrollIndicator={false}>
            {/* User Profile Hero Card */}
            <View style={[styles.userBox, { backgroundColor: theme.bg, borderColor: theme.cardBorder }]}>
              <View style={[styles.avatarCircle, { borderColor: theme.primary }]}>
                <User size={26} color={theme.textPrimary} />
              </View>
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.textPrimary }]} numberOfLines={1}>
                  {user?.displayName || 'Student'}
                </Text>
                <Text style={[styles.userEmail, { color: theme.textSecondary }]} numberOfLines={1}>
                  {user?.isAnonymous ? 'Guest Account' : user?.email}
                </Text>
                <View style={[styles.tierPill, { backgroundColor: `${theme.tierGold}15` }]}>
                  <Award size={12} color={theme.tierGold} />
                  <Text style={[styles.tierText, { color: theme.tierGold }]}>
                    {(user?.stats?.tier || 'bronze').toUpperCase()} • Level {user?.stats?.level || 1}
                  </Text>
                </View>
              </View>
            </View>

            {/* Appearance & Theme Section */}
            <View style={[styles.sectionCard, { borderColor: theme.cardBorder }]}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Appearance</Text>
              <View style={styles.themeToggleRow}>
                <TouchableOpacity
                  style={[
                    styles.themeOptionBtn,
                    {
                      backgroundColor: mode === 'dark' ? theme.primary : theme.inputBg,
                      borderColor: theme.cardBorder,
                    },
                  ]}
                  onPress={() => setMode('dark')}
                  activeOpacity={0.8}
                >
                  <Moon size={16} color={mode === 'dark' ? '#FFF' : theme.textPrimary} />
                  <Text
                    style={[
                      styles.themeOptionText,
                      { color: mode === 'dark' ? '#FFF' : theme.textPrimary },
                    ]}
                  >
                    Dark Mode
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.themeOptionBtn,
                    {
                      backgroundColor: mode === 'light' ? theme.primary : theme.inputBg,
                      borderColor: theme.cardBorder,
                    },
                  ]}
                  onPress={() => setMode('light')}
                  activeOpacity={0.8}
                >
                  <Sun size={16} color={mode === 'light' ? '#FFF' : theme.textPrimary} />
                  <Text
                    style={[
                      styles.themeOptionText,
                      { color: mode === 'light' ? '#FFF' : theme.textPrimary },
                    ]}
                  >
                    Light Mode
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Formal Menu Links */}
            <View style={[styles.sectionCard, { borderColor: theme.cardBorder, padding: 6 }]}>
              {onNavigateToProfile && (
                <TouchableOpacity
                  style={styles.menuRowBtn}
                  onPress={() => {
                    handleClose(onNavigateToProfile);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuLeft}>
                    <Settings size={18} color={theme.primary} />
                    <Text style={[styles.menuText, { color: theme.textPrimary }]}>Profile & Settings</Text>
                  </View>
                  <ChevronRight size={16} color={theme.textMuted} />
                </TouchableOpacity>
              )}

              {onNavigateToAnalytics && (
                <TouchableOpacity
                  style={styles.menuRowBtn}
                  onPress={() => {
                    handleClose(onNavigateToAnalytics);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuLeft}>
                    <BarChart2 size={18} color={theme.secondary} />
                    <Text style={[styles.menuText, { color: theme.textPrimary }]}>Study Analytics</Text>
                  </View>
                  <ChevronRight size={16} color={theme.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={[styles.logoutBtn, { backgroundColor: theme.dangerBg, borderColor: `${theme.danger}40` }]}
              onPress={handleLogout}
              activeOpacity={0.85}
            >
              <LogOut size={18} color={theme.danger} />
              <Text style={[styles.logoutText, { color: theme.danger }]}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
  },
  backdropPressable: {
    flex: 1,
  },
  drawerContainer: {
    width: Math.min(SCREEN_WIDTH * 0.82, 320),
    height: '100%',
    borderLeftWidth: 1,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: -6, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    marginLeft: 'auto',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  drawerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  drawerContent: {
    padding: 16,
  },
  userBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 11,
    marginTop: 2,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 4,
  },
  sectionCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  themeToggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  themeOptionText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  menuRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
});
