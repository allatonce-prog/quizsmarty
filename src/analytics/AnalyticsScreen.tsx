import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { useQuiz } from '../context/QuizContext';
import { MasteryBar } from '../components/MasteryBar';
import { analyticsStyles as styles } from './AnalyticsScreen.styles';
import { TrendingUp, AlertTriangle, History, BookOpen, Clock } from 'lucide-react-native';

export const AnalyticsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { weakTopics, subjectMasteries, attempts, quizzes, setActiveQuiz } = useQuiz();

  const handleRetakeQuiz = (quizId: string) => {
    const q = quizzes.find((item) => item.id === quizId);
    if (q) {
      setActiveQuiz(q);
      navigation.navigate('QuizPlayer');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.headerTitle}>Analytics & Mastery</Text>
        <Text style={styles.headerSub}>Track subject performance, historical logs, and AI weak topic alerts.</Text>

        {/* Weak Topic Detection (Requirement #11) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <AlertTriangle size={20} color={colors.danger} />
            <Text style={[styles.sectionTitle, { color: colors.danger }]}>Weak Topic Detection</Text>
          </View>

          {weakTopics.length === 0 ? (
            <Text style={styles.emptyText}>No weak topics detected! Keep taking quizzes to analyze topic performance.</Text>
          ) : (
            weakTopics.map((item, idx) => (
              <View key={idx} style={styles.weakItemRow}>
                <View style={styles.weakInfo}>
                  <Text style={styles.weakName}>{item.topic}</Text>
                  <Text style={styles.weakMeta}>{item.subject} • Tested {item.totalCount} times</Text>
                </View>
                <View style={styles.weakAccuracyBadge}>
                  <Text style={styles.weakAccuracyText}>{item.accuracy}% Accuracy</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Subject Mastery Progress (Requirement #17 & #18) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <TrendingUp size={20} color={colors.primaryLight} />
            <Text style={styles.sectionTitle}>Subject Mastery</Text>
          </View>

          {subjectMasteries.length === 0 ? (
            <Text style={styles.emptyText}>Take quizzes to calculate your overall subject mastery percentage.</Text>
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
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <History size={20} color={colors.secondary} />
            <Text style={styles.sectionTitle}>Quiz History Log</Text>
          </View>

          {attempts.length === 0 ? (
            <Text style={styles.emptyText}>No quiz attempts recorded yet.</Text>
          ) : (
            attempts.map((attempt) => (
              <TouchableOpacity
                key={attempt.id}
                style={styles.historyRow}
                onPress={() => handleRetakeQuiz(attempt.quizId)}
                activeOpacity={0.8}
              >
                <View style={styles.historyIcon}>
                  <BookOpen size={18} color={colors.primaryLight} />
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle} numberOfLines={1}>{attempt.quizTitle}</Text>
                  <View style={styles.historyMetaRow}>
                    <Clock size={12} color={colors.textDarkMuted} />
                    <Text style={styles.historyMeta}>
                      {new Date(attempt.date).toLocaleDateString()} • {attempt.durationSeconds}s
                    </Text>
                  </View>
                </View>
                <View style={styles.scorePill}>
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
