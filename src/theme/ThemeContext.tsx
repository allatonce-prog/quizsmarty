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
  skyBlue: string; // Theme accent token (Maroon/Red variant)
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
  bg: '#09090B', // Sleek Onyx Pure Black
  card: '#121215', // Elevated Pure Dark Charcoal Card
  cardBorder: '#27272A', // Crisp Modern Zinc Border
  textPrimary: '#F8FAFC',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  primary: '#DC2626', // Vibrant Red Accent
  primaryLight: '#EF4444',
  primaryBg: 'rgba(220, 38, 38, 0.2)',
  skyBlue: '#DC2626', // Vibrant Red Accent
  skyBlueLight: '#EF4444',
  skyBlueBg: 'rgba(220, 38, 38, 0.2)',
  secondary: '#EF4444',
  accent: '#DC2626',
  success: '#10B981',
  successBg: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.15)',
  danger: '#EF4444',
  dangerBg: 'rgba(239, 68, 68, 0.2)',
  inputBg: '#18181B',
  inputBorder: '#3F3F46',
  tierBronze: '#CD7F32',
  tierSilver: '#94A3B8',
  tierGold: '#F59E0B',
  shadowColor: '#DC2626',
};

export const lightTheme: ThemeColors = {
  bg: '#FFF5F5', // Warm Soft White & Pearl Background
  card: '#FFFFFF', // Crisp Clean White Card
  cardBorder: '#FECDD3', // Light Red / Rose Border
  textPrimary: '#1A050A', // Deep Maroon Slate Text
  textSecondary: '#4A1521',
  textMuted: '#64748B',
  primary: '#800000', // Rich Maroon
  primaryLight: '#A51D24',
  primaryBg: 'rgba(128, 0, 0, 0.08)',
  skyBlue: '#DC2626', // Vibrant Red Accent
  skyBlueLight: '#EF4444',
  skyBlueBg: 'rgba(220, 38, 38, 0.12)',
  secondary: '#A51D24',
  accent: '#DC2626',
  success: '#059669',
  successBg: 'rgba(5, 150, 105, 0.08)',
  warning: '#D97706',
  warningBg: 'rgba(217, 119, 6, 0.08)',
  danger: '#DC2626',
  dangerBg: 'rgba(220, 38, 38, 0.08)',
  inputBg: '#FFE4E6',
  inputBorder: '#FDA4AF',
  tierBronze: '#B87333',
  tierSilver: '#64748B',
  tierGold: '#D97706',
  shadowColor: '#DC2626',
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
