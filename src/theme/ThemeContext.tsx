import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  bg: string;
  card: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryBg: string;
  skyBlue: string;
  skyBlueLight: string;
  skyBlueBg: string;
  secondary: string;
  accent: string;
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  danger: string;
  dangerBg: string;
  inputBg: string;
  inputBorder: string;
  tierBronze: string;
  tierSilver: string;
  tierGold: string;
  shadowColor: string;
}

export const darkTheme: ThemeColors = {
  bg: '#0B1329', // Deep Midnight Navy Blue
  card: '#131E3A', // Rich Dark Blue Card
  cardBorder: '#1E2D54', // Sky Blue Tint Border
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  primary: '#2563EB', // Royal Blue
  primaryLight: '#3B82F6',
  primaryBg: 'rgba(37, 99, 235, 0.15)',
  skyBlue: '#0EA5E9', // Sky Blue Accent
  skyBlueLight: '#38BDF8',
  skyBlueBg: 'rgba(14, 165, 233, 0.18)',
  secondary: '#0284C7',
  accent: '#38BDF8',
  success: '#10B981',
  successBg: 'rgba(16, 185, 129, 0.12)',
  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.12)',
  danger: '#EF4444',
  dangerBg: 'rgba(239, 68, 68, 0.12)',
  inputBg: '#0F172A',
  inputBorder: '#1E2D54',
  tierBronze: '#CD7F32',
  tierSilver: '#94A3B8',
  tierGold: '#F59E0B',
  shadowColor: '#0284C7',
};

export const lightTheme: ThemeColors = {
  bg: '#F0F9FF', // Soft Sky Blue & Crisp White Tint Background
  card: '#FFFFFF', // Crisp Clean White Card
  cardBorder: '#BAE6FD', // Light Sky Blue Border
  textPrimary: '#0F172A', // Deep Navy Slate Text
  textSecondary: '#334155',
  textMuted: '#64748B',
  primary: '#2563EB', // Royal Blue
  primaryLight: '#3B82F6',
  primaryBg: 'rgba(37, 99, 235, 0.08)',
  skyBlue: '#0EA5E9', // Vibrant Sky Blue
  skyBlueLight: '#38BDF8',
  skyBlueBg: 'rgba(14, 165, 233, 0.12)',
  secondary: '#0284C7',
  accent: '#0EA5E9',
  success: '#059669',
  successBg: 'rgba(5, 150, 105, 0.08)',
  warning: '#D97706',
  warningBg: 'rgba(217, 119, 6, 0.08)',
  danger: '#DC2626',
  dangerBg: 'rgba(220, 38, 38, 0.08)',
  inputBg: '#E0F2FE',
  inputBorder: '#7DD3FC',
  tierBronze: '#B87333',
  tierSilver: '#64748B',
  tierGold: '#D97706',
  shadowColor: '#0EA5E9',
};

interface ThemeContextType {
  mode: ThemeMode;
  theme: ThemeColors;
  isDark: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY = '@quizsmarty_theme_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        setModeState(saved);
      }
    } catch {
      setModeState('dark');
    }
  };

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
  };

  const toggleTheme = async () => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    await setMode(nextMode);
  };

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ mode, theme, isDark: mode === 'dark', setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
