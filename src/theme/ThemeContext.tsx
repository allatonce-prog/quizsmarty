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
  bg: '#0B0F19',
  card: '#151C2C',
  cardBorder: '#232D42',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryBg: 'rgba(99, 102, 241, 0.12)',
  secondary: '#8B5CF6',
  accent: '#EC4899',
  success: '#10B981',
  successBg: 'rgba(16, 185, 129, 0.12)',
  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.12)',
  danger: '#EF4444',
  dangerBg: 'rgba(239, 68, 68, 0.12)',
  inputBg: '#0F172A',
  inputBorder: '#232D42',
  tierBronze: '#CD7F32',
  tierSilver: '#C0C0C0',
  tierGold: '#FFD700',
  shadowColor: '#000000',
};

export const lightTheme: ThemeColors = {
  bg: '#F8FAFC',
  card: '#FFFFFF',
  cardBorder: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#4F46E5',
  primaryLight: '#6366F1',
  primaryBg: 'rgba(79, 70, 229, 0.08)',
  secondary: '#7C3AED',
  accent: '#DB2777',
  success: '#059669',
  successBg: 'rgba(5, 150, 105, 0.08)',
  warning: '#D97706',
  warningBg: 'rgba(217, 119, 6, 0.08)',
  danger: '#DC2626',
  dangerBg: 'rgba(220, 38, 38, 0.08)',
  inputBg: '#F1F5F9',
  inputBorder: '#CBD5E1',
  tierBronze: '#B87333',
  tierSilver: '#A0A0A0',
  tierGold: '#E6B800',
  shadowColor: '#64748B',
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
