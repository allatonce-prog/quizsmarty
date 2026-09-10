import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useQuiz } from '../context/QuizContext';
import { MasteryBar } from '../components/MasteryBar';
import { analyticsStyles as styles } from './AnalyticsScreen.styles';
import { TrendingUp, AlertTriangle, History, BookOpen, Clock } from 'lucide-react-native';

export const AnalyticsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { weakTopics, subjectMasteries, attempts, quizzes, setActiveQuiz } = useQuiz();

  const handleRetakeQuiz = (quizId: string) => {
    const q = quizzes.find((item) => item.id === quizId);
    if (q) {
      setActiveQuiz(q);
      navigation.navigate('QuizPlayer');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Analytics & Mastery</Text>
        <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
          Track subject performance, historical logs, and AI weak topic alerts.
        </Text>

        {/* Weak Topic Detection (Requirement #11) */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.sectionHeaderRow}>
            <AlertTriangle size={20} color={theme.danger} />
            <Text style={[styles.sectionTitle, { color: theme.danger }]}>Weak Topic Detection</Text>
          </View>

          {weakTopics.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No weak topics detected! Keep taking quizzes to analyze topic performance.
            </Text>
          ) : (
            weakTopics.map((item, idx) => (
              <View key={idx} style={[styles.weakItemRow, { backgroundColor: theme.inputBg }]}>
                <View style={styles.weakInfo}>
                  <Text style={[styles.weakName, { color: theme.textPrimary }]}>{item.topic}</Text>
                  <Text style={[styles.weakMeta, { color: theme.textSecondary }]}>
                    {item.subject} • Tested {item.totalCount} times
                  </Text>
                </View>
                <View style={[styles.weakAccuracyBadge, { backgroundColor: theme.dangerBg }]}>
                  <Text style={[styles.weakAccuracyText, { color: theme.danger }]}>{item.accuracy}% Accuracy</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Subject Mastery Progress (Requirement #17 & #18) */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.sectionHeaderRow}>
            <TrendingUp size={20} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Subject Mastery</Text>
          </View>

          {subjectMasteries.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Take quizzes to calculate your overall subject mastery percentage.
            </Text>
          ) : (
            subjectMasteries.map((item, idx) => (
              <MasteryBar
                key={idx}
                label={item.subject}
                percentage={item.masteryPercentage}
                quizzesCount={item.quizzesTaken}
              />
            ))
          )}
        </View>

        {/* History Log of Taken Quizzes (Requirement #16) */}
        <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.sectionHeaderRow}>
            <History size={20} color={theme.secondary} />
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Quiz History Log</Text>
          </View>

          {attempts.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No quiz attempts recorded yet.</Text>
          ) : (
            attempts.map((attempt) => (
              <TouchableOpacity
                key={attempt.id}
                style={[styles.historyRow, { borderBottomColor: theme.cardBorder }]}
                onPress={() => handleRetakeQuiz(attempt.quizId)}
                activeOpacity={0.8}
              >
                <View style={[styles.historyIcon, { backgroundColor: theme.primaryBg }]}>
                  <BookOpen size={18} color={theme.primary} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={[styles.historyTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                    {attempt.quizTitle}
                  </Text>
                  <View style={styles.historyMetaRow}>
                    <Clock size={12} color={theme.textMuted} />
                    <Text style={[styles.historyMeta, { color: theme.textMuted }]}>
                      {new Date(attempt.date).toLocaleDateString()} • {attempt.durationSeconds}s
                    </Text>
                  </View>
                </View>
                <View style={[styles.scorePill, { backgroundColor: theme.primary }]}>
                  <Text style={styles.scoreText}>{attempt.percentage}%</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};
