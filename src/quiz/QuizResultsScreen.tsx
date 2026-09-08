import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { useQuiz } from '../context/QuizContext';
import { Award, CheckCircle, XCircle, ShieldAlert, RotateCcw, Home, HelpCircle } from 'lucide-react-native';

export const QuizResultsScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { latestAttempt, activeQuiz, setActiveQuiz } = useQuiz();
  const attempt = latestAttempt;

  if (!attempt) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No results available.</Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.ctaText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isPassed = attempt.percentage >= 70;
  const gradeColor = attempt.percentage >= 85 ? colors.success : attempt.percentage >= 60 ? colors.warning : colors.danger;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Score Header Card */}
        <View style={styles.scoreCard}>
          <View style={[styles.badgeCircle, { backgroundColor: `${gradeColor}20` }]}>
            <Award size={48} color={gradeColor} />
          </View>
          <Text style={styles.scorePercentage}>{attempt.percentage}%</Text>
          <Text style={[styles.gradeStatus, { color: gradeColor }]}>
            {attempt.percentage >= 90 ? 'OUTSTANDING PERFORMANCE!' : isPassed ? 'PASSED - GOOD JOB!' : 'NEEDS PRACTICE'}
          </Text>

          <View style={styles.statsSummaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{attempt.score}/{attempt.totalQuestions}</Text>
              <Text style={styles.summaryLabel}>Correct Items</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{attempt.durationSeconds}s</Text>
              <Text style={styles.summaryLabel}>Completion Time</Text>
            </View>
          </View>
        </View>

        {/* Weak Topics Warning Banner */}
        {attempt.weakTopics.length > 0 && (
          <View style={styles.weakBox}>
            <ShieldAlert size={20} color={colors.warning} />
            <View style={styles.weakInfo}>
              <Text style={styles.weakTitle}>Weak Topics Identified:</Text>
              <Text style={styles.weakSub}>{attempt.weakTopics.join(', ')}</Text>
            </View>
          </View>
        )}

        {/* Question Breakdown with Explanations */}
        <Text style={styles.sectionHeader}>Question Review & AI Explanations</Text>
        {activeQuiz?.questions.map((q, idx) => {
          const userAns = attempt.answers[q.id] || 'No answer';
          const isCorrect = !attempt.missedQuestions.some((m) => m.id === q.id);

          return (
            <View key={q.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewIndex}>#{idx + 1}</Text>
                <View style={styles.reviewStatus}>
                  {isCorrect ? (
                    <View style={styles.correctPill}>
                      <CheckCircle size={14} color={colors.success} />
                      <Text style={styles.correctText}>CORRECT</Text>
                    </View>
                  ) : (
                    <View style={styles.wrongPill}>
                      <XCircle size={14} color={colors.danger} />
                      <Text style={styles.wrongText}>INCORRECT</Text>
                    </View>
                  )}
                </View>
              </View>

              <Text style={styles.reviewQuestion}>{q.text}</Text>

              <View style={styles.answerComparisonBox}>
                <Text style={styles.ansLine}>
                  <Text style={styles.ansBold}>Your Answer: </Text>
                  <Text style={{ color: isCorrect ? colors.success : colors.danger }}>{userAns}</Text>
                </Text>
                {!isCorrect && (
                  <Text style={styles.ansLine}>
                    <Text style={styles.ansBold}>Correct Answer: </Text>
                    <Text style={{ color: colors.success }}>{q.correctAnswer}</Text>
                  </Text>
                )}
              </View>

              {/* AI Explanation */}
              <View style={styles.explanationBox}>
                <View style={styles.expHeader}>
                  <HelpCircle size={14} color={colors.primaryLight} />
                  <Text style={styles.expTitle}>Gemini AI Explanation:</Text>
                </View>
                <Text style={styles.expText}>{q.explanation}</Text>
              </View>
            </View>
          );
        })}

        {/* Action Buttons */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.retakeBtn}
            onPress={() => {
              if (activeQuiz) {
                setActiveQuiz(activeQuiz);
                navigation.replace('QuizPlayer');
              }
            }}
          >
            <RotateCcw size={18} color="#FFF" />
            <Text style={styles.retakeText}>Retake Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Dashboard')}>
            <Home size={18} color={colors.textDarkPrimary} />
            <Text style={styles.homeText}>Dashboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  scrollContent: {
    padding: 20,
  },
  scoreCard: {
    backgroundColor: colors.cardDark,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardDarkBorder,
    marginBottom: 20,
  },
  badgeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  scorePercentage: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.textDarkPrimary,
  },
  gradeStatus: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
    marginBottom: 20,
  },
  statsSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: colors.bgDark,
    paddingVertical: 14,
    borderRadius: 14,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textDarkPrimary,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.textDarkSecondary,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.cardDarkBorder,
  },
  weakBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: 20,
  },
  weakInfo: {
    marginLeft: 12,
    flex: 1,
  },
  weakTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.warning,
  },
  weakSub: {
    fontSize: 12,
    color: colors.textDarkSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textDarkPrimary,
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: colors.cardDark,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardDarkBorder,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewIndex: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryLight,
  },
  reviewStatus: {},
  correctPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  correctText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.success,
    marginLeft: 4,
  },
  wrongPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  wrongText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.danger,
    marginLeft: 4,
  },
  reviewQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDarkPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  answerComparisonBox: {
    backgroundColor: colors.bgDark,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  ansLine: {
    fontSize: 13,
    marginVertical: 2,
  },
  ansBold: {
    fontWeight: '700',
    color: colors.textDarkSecondary,
  },
  explanationBox: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  expHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  expTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryLight,
    marginLeft: 6,
  },
  expText: {
    fontSize: 12,
    color: colors.textDarkSecondary,
    lineHeight: 17,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  retakeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
  },
  retakeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 8,
  },
  homeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardDarkBorder,
    paddingVertical: 14,
    borderRadius: 14,
  },
  homeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDarkPrimary,
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    color: colors.textDarkPrimary,
    marginBottom: 16,
  },
  ctaBtn: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
  },
  ctaText: {
    color: '#FFF',
    fontWeight: '700',
  },
});
