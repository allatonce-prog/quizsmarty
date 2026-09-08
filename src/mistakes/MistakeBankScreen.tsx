import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { useQuiz } from '../context/QuizContext';
import { mistakeStyles as styles } from './MistakeBankScreen.styles';
import { ShieldAlert, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react-native';

export const MistakeBankScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { mistakes, resolveMistake, retakeMistakesAsQuiz, setActiveQuiz } = useQuiz();
  const [filter, setFilter] = useState<'all' | 'unmastered' | 'mastered'>('unmastered');

  const filteredMistakes = mistakes.filter((m) => {
    if (filter === 'unmastered') return !m.mastered;
    if (filter === 'mastered') return m.mastered;
    return true;
  });

  const unmasteredList = mistakes.filter((m) => !m.mastered);

  const handleRetakeAll = () => {
    if (unmasteredList.length === 0) {
      Alert.alert('All Clear', 'No unmastered mistakes to retake!');
      return;
    }
    const practiceQuiz = retakeMistakesAsQuiz(unmasteredList);
    setActiveQuiz(practiceQuiz);
    navigation.navigate('QuizPlayer');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerHeader}>
            <ShieldAlert size={28} color={colors.warning} />
            <Text style={styles.bannerTitle}>Mistake Bank</Text>
          </View>
          <Text style={styles.bannerSub}>
            Targeted review for missed questions. Science shows re-testing weak questions dramatically boosts retention!
          </Text>

          {unmasteredList.length > 0 && (
            <TouchableOpacity style={styles.practiceBtn} onPress={handleRetakeAll} activeOpacity={0.85}>
              <RotateCcw size={18} color="#FFF" />
              <Text style={styles.practiceText}>
                Practice All {unmasteredList.length} Mistakes
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Segment */}
        <View style={styles.filterSegment}>
          {(['unmastered', 'mastered', 'all'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterBtn, filter === tab && styles.filterBtnActive]}
              onPress={() => setFilter(tab)}
            >
              <Text style={[styles.filterText, filter === tab && styles.filterTextActive]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        {filteredMistakes.length === 0 ? (
          <View style={styles.emptyCard}>
            <CheckCircle2 size={36} color={colors.success} />
            <Text style={styles.emptyTitle}>No Mistakes in this View</Text>
            <Text style={styles.emptySub}>Keep taking quizzes to practice and log missed questions.</Text>
          </View>
        ) : (
          filteredMistakes.map((item) => (
            <View key={item.id} style={styles.mistakeCard}>
              <View style={styles.cardHeader}>
                <View style={styles.subjectTag}>
                  <Text style={styles.subjectText}>{item.subject}</Text>
                </View>
                <Text style={styles.topicText}>{item.question.topicTag}</Text>
              </View>

              <Text style={styles.questionText}>{item.question.text}</Text>

              <View style={styles.answerBox}>
                <Text style={styles.ansLine}>
                  <Text style={styles.ansLabel}>Your Previous Answer: </Text>
                  <Text style={{ color: colors.danger }}>{item.userAnswer}</Text>
                </Text>
                <Text style={styles.ansLine}>
                  <Text style={styles.ansLabel}>Correct Answer: </Text>
                  <Text style={{ color: colors.success }}>{item.question.correctAnswer}</Text>
                </Text>
              </View>

              <View style={styles.explanationBox}>
                <View style={styles.expHeader}>
                  <HelpCircle size={14} color={colors.primaryLight} />
                  <Text style={styles.expTitle}>Explanation:</Text>
                </View>
                <Text style={styles.expText}>{item.question.explanation}</Text>
              </View>

              {!item.mastered ? (
                <TouchableOpacity
                  style={styles.masterBtn}
                  onPress={() => resolveMistake(item.id)}
                >
                  <CheckCircle2 size={16} color={colors.success} />
                  <Text style={styles.masterText}>Mark as Mastered</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.masteredBadge}>
                  <CheckCircle2 size={14} color={colors.success} />
                  <Text style={styles.masteredText}>MASTERED</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};
