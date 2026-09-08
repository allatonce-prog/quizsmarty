import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, TextInput, Alert, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { User, Key, LogOut, Shield, Award, Sparkles, Sun, Moon, X, Settings } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface RightSidebarDrawerProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToProfile?: () => void;
}

export const RightSidebarDrawer: React.FC<RightSidebarDrawerProps> = ({
  visible,
  onClose,
  onNavigateToProfile,
}) => {
  const { user, apiKey, setApiKey, logout } = useAuth();
  const { theme, mode, setMode, isDark } = useTheme();
  const [keyInput, setKeyInput] = useState<string>(apiKey || '');

  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSaveApiKey = async () => {
    await setApiKey(keyInput.trim());
    Alert.alert('Saved', 'Google Gemini API key saved successfully.');
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} onRequestClose={onClose} animationType="none">
      <View style={styles.overlay}>
        {/* Backdrop Press to Close */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        {/* Sliding Right Drawer Container */}
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
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.drawerContent} showsVerticalScrollIndicator={false}>
            {/* User Info Hero */}
            <View style={[styles.userBox, { backgroundColor: theme.bg, borderColor: theme.cardBorder }]}>
              <View style={[styles.avatarCircle, { borderColor: theme.primary }]}>
                <User size={28} color={theme.textPrimary} />
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

            {/* Quick Dark / Light Mode Switch */}
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
                    Dark
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
                    Light
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Google Gemini API Key Entry */}
            <View style={[styles.sectionCard, { borderColor: theme.cardBorder }]}>
              <View style={styles.cardHeaderRow}>
                <Key size={18} color={theme.primaryLight} />
                <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginLeft: 6 }]}>Gemini AI Key</Text>
              </View>
              <TextInput
                style={[
                  styles.keyInput,
                  { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.textPrimary },
                ]}
                value={keyInput}
                onChangeText={setKeyInput}
                placeholder="AIzaSy..."
                placeholderTextColor={theme.textMuted}
                secureTextEntry
              />
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.primary }]} onPress={handleSaveApiKey}>
                <Sparkles size={14} color="#FFF" />
                <Text style={styles.saveBtnText}>Save Key</Text>
              </TouchableOpacity>
            </View>

            {/* Profile Settings Nav Link */}
            {onNavigateToProfile && (
              <TouchableOpacity
                style={[styles.navLinkBtn, { backgroundColor: theme.bg, borderColor: theme.cardBorder }]}
                onPress={() => {
                  onClose();
                  onNavigateToProfile();
                }}
              >
                <Settings size={18} color={theme.primary} />
                <Text style={[styles.navLinkText, { color: theme.textPrimary }]}>Profile & Preferences</Text>
              </TouchableOpacity>
            )}

            {/* Logout / Switch Account */}
            <TouchableOpacity
              style={[styles.logoutBtn, { backgroundColor: theme.dangerBg, borderColor: `${theme.danger}40` }]}
              onPress={() => {
                onClose();
                logout();
              }}
            >
              <LogOut size={18} color={theme.danger} />
              <Text style={[styles.logoutText, { color: theme.danger }]}>Logout / Reset Account</Text>
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
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    width: Math.min(SCREEN_WIDTH * 0.82, 320),
    height: '100%',
    borderLeftWidth: 1,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  keyInput: {
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    borderWidth: 1,
    marginBottom: 10,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 6,
  },
  navLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  navLinkText: {
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
    marginTop: 6,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 8,
  },
});
