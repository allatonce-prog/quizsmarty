import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { useQuiz } from '../context/QuizContext';
import { Question } from '../types/quiz';
import { Clock, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react-native';

export const QuizPlayerScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { activeQuiz, submitAttempt } = useQuiz();

  if (!activeQuiz || !activeQuiz.questions || activeQuiz.questions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No active quiz found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.backBtnText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  const currentQuestion: Question = activeQuiz.questions[currentIndex];
  const totalQuestions = activeQuiz.questions.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const unansweredCount = totalQuestions - Object.keys(answers).filter((k) => (answers[k] || '').trim()).length;

    if (unansweredCount > 0) {
      Alert.alert(
        'Submit Quiz?',
        `You have ${unansweredCount} unanswered item(s). Are you sure you want to finish now?`,
        [
          { text: 'Keep Answering', style: 'cancel' },
          { text: 'Submit Now', onPress: processSubmit },
        ]
      );
    } else {
      await processSubmit();
    }
  };

  const processSubmit = async () => {
    const attempt = await submitAttempt(activeQuiz, answers, secondsElapsed);
    navigation.replace('QuizResults', { attemptId: attempt.id });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.quizTitle} numberOfLines={1}>{activeQuiz.title}</Text>
          <Text style={styles.questionCounter}>
            Question {currentIndex + 1} of {totalQuestions} • {currentQuestion.topicTag}
          </Text>
        </View>
        <View style={styles.timerBadge}>
          <Clock size={16} color={colors.primaryLight} />
          <Text style={styles.timerText}>{formatTime(secondsElapsed)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Question Text */}
        <View style={styles.questionCard}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {currentQuestion.type === 'multiple_choice' ? 'MULTIPLE CHOICE' : currentQuestion.type === 'true_false' ? 'TRUE OR FALSE' : 'ENUMERATION'}
            </Text>
          </View>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </View>

        {/* Options / Input based on question type */}
        {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
          <View style={styles.optionsList}>
            {currentQuestion.options.map((opt, idx) => {
              const selected = answers[currentQuestion.id] === opt;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.optionItem, selected && styles.optionItemSelected]}
                  onPress={() => handleSelectOption(opt)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.optionRadio, selected && styles.optionRadioSelected]}>
                    <Text style={[styles.optionRadioText, selected && styles.optionRadioTextSelected]}>
                      {String.fromCharCode(65 + idx)}
                    </Text>
                  </View>
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {currentQuestion.type === 'true_false' && (
          <View style={styles.tfRow}>
            {['True', 'False'].map((val) => {
              const selected = answers[currentQuestion.id] === val;
              return (
                <TouchableOpacity
                  key={val}
                  style={[styles.tfBtn, selected && styles.tfBtnSelected]}
                  onPress={() => handleSelectOption(val)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tfText, selected && styles.tfTextSelected]}>{val}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {currentQuestion.type === 'enumeration' && (
          <View style={styles.enumBox}>
            <Text style={styles.enumHint}>Type your answer or primary keyword below:</Text>
            <TextInput
              style={styles.enumInput}
              value={answers[currentQuestion.id] || ''}
              onChangeText={(val) => handleSelectOption(val)}
              placeholder="Your answer..."
              placeholderTextColor={colors.textDarkMuted}
            />
          </View>
        )}
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <ArrowLeft size={18} color={currentIndex === 0 ? colors.textDarkMuted : colors.textDarkPrimary} />
          <Text style={[styles.navBtnText, currentIndex === 0 && styles.mutedText]}>Prev</Text>
        </TouchableOpacity>

        {currentIndex === totalQuestions - 1 ? (
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <CheckCircle2 size={18} color="#FFF" />
            <Text style={styles.submitBtnText}>Submit Quiz</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>Next</Text>
            <ArrowRight size={18} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textDarkSecondary,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.cardDark,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDarkPrimary,
    maxWidth: 220,
  },
  questionCounter: {
    fontSize: 12,
    color: colors.textDarkSecondary,
    marginTop: 2,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  timerText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryLight,
    marginLeft: 6,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.cardDarkBorder,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  scrollContent: {
    padding: 20,
  },
  questionCard: {
    backgroundColor: colors.cardDark,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardDarkBorder,
    marginBottom: 20,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.secondary,
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textDarkPrimary,
    lineHeight: 24,
  },
  optionsList: {
    gap: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardDark,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.cardDarkBorder,
  },
  optionItemSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
  },
  optionRadio: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.cardDarkBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionRadioSelected: {
    backgroundColor: colors.primary,
  },
  optionRadioText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDarkSecondary,
  },
  optionRadioTextSelected: {
    color: '#FFF',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: colors.textDarkPrimary,
    fontWeight: '500',
  },
  optionTextSelected: {
    fontWeight: '700',
  },
  tfRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tfBtn: {
    flex: 1,
    backgroundColor: colors.cardDark,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.cardDarkBorder,
  },
  tfBtnSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: colors.primary,
  },
  tfText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textDarkSecondary,
  },
  tfTextSelected: {
    color: colors.primaryLight,
  },
  enumBox: {
    backgroundColor: colors.cardDark,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardDarkBorder,
  },
  enumHint: {
    fontSize: 12,
    color: colors.textDarkSecondary,
    marginBottom: 8,
  },
  enumInput: {
    backgroundColor: colors.bgDark,
    padding: 14,
    borderRadius: 10,
    color: colors.textDarkPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.cardDarkBorder,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.cardDark,
    borderTopWidth: 1,
    borderTopColor: colors.cardDarkBorder,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.cardDarkBorder,
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDarkPrimary,
    marginLeft: 6,
  },
  mutedText: {
    color: colors.textDarkMuted,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginRight: 6,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
    marginLeft: 6,
  },
});
