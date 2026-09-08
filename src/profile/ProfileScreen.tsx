import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { profileStyles as styles } from './ProfileScreen.styles';
import { User, Key, LogOut, Shield, Award, Sparkles, Sun, Moon } from 'lucide-react-native';

export const ProfileScreen: React.FC = () => {
  const { user, apiKey, setApiKey, logout } = useAuth();
  const { theme, mode, setMode, isDark } = useTheme();
  const [keyInput, setKeyInput] = useState<string>(apiKey || '');

  const handleSaveApiKey = async () => {
    await setApiKey(keyInput.trim());
    Alert.alert('Saved', 'Google Gemini API key saved successfully.');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={[styles.userHero, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.inputBg }]}>
            <User size={36} color={theme.textPrimary} />
          </View>
          <Text style={[styles.userName, { color: theme.textPrimary }]}>{user?.displayName || 'Student'}</Text>
          <Text style={[styles.userStatus, { color: theme.textSecondary }]}>
            {user?.isAnonymous ? 'Guest Student Account' : user?.email}
          </Text>

          <View style={[styles.tierPill, { backgroundColor: `${theme.tierGold}15` }]}>
            <Award size={14} color={theme.tierGold} />
            <Text style={[styles.tierPillText, { color: theme.tierGold }]}>
              {(user?.stats?.tier || 'bronze').toUpperCase()} TIER • LEVEL {user?.stats?.level || 1}
            </Text>
          </View>
        </View>

        {/* Theme Settings (Dark Mode / Light Mode) */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            {isDark ? <Moon size={20} color={theme.primaryLight} /> : <Sun size={20} color={theme.warning} />}
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Appearance & Theme</Text>
          </View>
          <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
            Choose your preferred color theme. This setting applies universally across all screens.
          </Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            <TouchableOpacity
              style={[
                styles.saveKeyBtn,
                { flex: 1, backgroundColor: mode === 'dark' ? theme.primary : theme.inputBg, borderWidth: 1, borderColor: theme.cardBorder }
              ]}
              onPress={() => setMode('dark')}
              activeOpacity={0.8}
            >
              <Moon size={16} color={mode === 'dark' ? '#FFF' : theme.textPrimary} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: mode === 'dark' ? '#FFF' : theme.textPrimary, marginLeft: 6 }}>
                Dark Mode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveKeyBtn,
                { flex: 1, backgroundColor: mode === 'light' ? theme.primary : theme.inputBg, borderWidth: 1, borderColor: theme.cardBorder }
              ]}
              onPress={() => setMode('light')}
              activeOpacity={0.8}
            >
              <Sun size={16} color={mode === 'light' ? '#FFF' : theme.textPrimary} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: mode === 'light' ? '#FFF' : theme.textPrimary, marginLeft: 6 }}>
                Light Mode
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Gemini API Key Section */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <Key size={20} color={theme.primaryLight} />
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Google Gemini AI Settings</Text>
          </View>

          <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
            Enter your Google Gemini API key below for direct live AI quiz generation.
          </Text>

          <TextInput
            style={[styles.keyInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.textPrimary }]}
            value={keyInput}
            onChangeText={setKeyInput}
            placeholder="AIzaSy..."
            placeholderTextColor={theme.textMuted}
            secureTextEntry
          />

          <TouchableOpacity style={[styles.saveKeyBtn, { backgroundColor: theme.primary }]} onPress={handleSaveApiKey}>
            <Sparkles size={16} color="#FFF" />
            <Text style={styles.saveKeyText}>Save Gemini API Key</Text>
          </TouchableOpacity>
        </View>

        {/* Account Controls */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <Shield size={20} color={theme.secondary} />
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Account Security</Text>
          </View>

          <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: theme.dangerBg, borderColor: `${theme.danger}30` }]} onPress={logout}>
            <LogOut size={18} color={theme.danger} />
            <Text style={[styles.logoutText, { color: theme.danger }]}>Reset / Switch Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
