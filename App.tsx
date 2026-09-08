import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { QuizProvider, useQuiz } from './src/context/QuizContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { CelebrationModal } from './src/components/CelebrationModal';

function MainApp() {
  const { newlyUnlockedBadges, clearNewUnlocks } = useQuiz();
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
      <CelebrationModal
        badges={newlyUnlockedBadges}
        onClose={clearNewUnlocks}
      />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <QuizProvider>
            <MainApp />
          </QuizProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
