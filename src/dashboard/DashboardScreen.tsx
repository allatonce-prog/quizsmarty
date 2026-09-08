import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { StatCard } from '../components/StatCard';
import { MasteryBar } from '../components/MasteryBar';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { dashboardStyles as styles } from './DashboardScreen.styles';
import { FileUp, BookOpen, AlertCircle, CheckCircle, Sparkles, ShieldAlert, ArrowRight, Play } from 'lucide-react-native';

export const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { quizzes, mistakes, weakTopics, subjectMasteries, setActiveQuiz } = useQuiz();
  const stats = user?.stats;

  const unmasteredMistakesCount = mistakes.filter((m) => !m.mastered).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Educational Hero Card */}
        <View style={[styles.welcomeCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.welcomeHeaderRow}>
            <View style={styles.welcomeTextSection}>
              <View style={[styles.tagBadge, { backgroundColor: theme.primaryBg }]}>
                <Sparkles size={12} color={theme.primary} />
                <Text style={[styles.welcomeTag, { color: theme.primary }]}>AI STUDY ASSISTANT</Text>
              </View>
              <Text style={[styles.welcomeTitle, { color: theme.textPrimary }]}>Ready to Learn?</Text>
              <Text style={[styles.welcomeSub, { color: theme.textSecondary }]}>
                Upload course notes or slides to generate an instant practice quiz.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.uploadCtaBtn, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('Upload')}
            activeOpacity={0.85}
          >
            <FileUp size={18} color="#FFF" />
            <Text style={styles.uploadCtaText}>Upload Study Document</Text>
          </TouchableOpacity>
        </View>

        {/* Study Progress Overview */}
        <Text style={[styles.sectionHeader, { color: theme.textPrimary }]}>Overview & Progress</Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="Quizzes Taken"
            value={stats?.totalQuizzesTaken || 0}
            icon={<BookOpen size={20} color={theme.primary} />}
            color={theme.primary}
          />
          <StatCard
            label="Accuracy Rate"
            value={`${stats?.accuracyRate || 0}%`}
            icon={<CheckCircle size={20} color={theme.success} />}
            color={theme.success}
          />
        </View>
        <View style={styles.statsGrid}>
          <StatCard
            label="Mistake Bank"
            value={unmasteredMistakesCount}
            icon={<ShieldAlert size={20} color={theme.warning} />}
            color={theme.warning}
            subtitle={unmasteredMistakesCount > 0 ? 'Items to review' : 'All clear!'}
          />
          <StatCard
            label="Experience XP"
            value={stats?.xp || 0}
            icon={<Sparkles size={20} color={theme.secondary} />}
            color={theme.secondary}
            subtitle={`Level ${stats?.level || 1}`}
          />
        </View>

        {/* Weak Topic Alert Banner */}
        {weakTopics.length > 0 && (
          <TouchableOpacity
            style={[styles.weakAlertCard, { backgroundColor: theme.dangerBg, borderColor: `${theme.danger}40` }]}
            onPress={() => navigation.navigate('Analytics')}
            activeOpacity={0.9}
          >
            <View style={styles.weakAlertIcon}>
              <AlertCircle size={22} color={theme.danger} />
            </View>
            <View style={styles.weakAlertContent}>
              <Text style={[styles.weakAlertTitle, { color: theme.danger }]}>Needs Attention</Text>
              <Text style={[styles.weakAlertSub, { color: theme.textSecondary }]}>
                "{weakTopics[0].topic}" accuracy is low ({weakTopics[0].accuracy}%).
              </Text>
            </View>
            <ArrowRight size={18} color={theme.danger} />
          </TouchableOpacity>
        )}

        {/* Quick Action Tiles */}
        <Text style={[styles.sectionHeader, { color: theme.textPrimary }]}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1 }]}
            onPress={() => navigation.navigate('Upload')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: theme.primaryBg }]}>
              <FileUp size={20} color={theme.primary} />
            </View>
            <Text style={[styles.actionBtnText, { color: theme.textPrimary }]}>Create Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1 }]}
            onPress={() => navigation.navigate('MistakeBank')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIconBox, { backgroundColor: theme.warningBg }]}>
              <ShieldAlert size={20} color={theme.warning} />
            </View>
            <Text style={[styles.actionBtnText, { color: theme.textPrimary }]}>Mistake Bank</Text>
          </TouchableOpacity>
        </View>

        {/* Subject Mastery Progress */}
        {subjectMasteries.length > 0 && (
          <View style={[styles.masterySection, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionHeader, { color: theme.textPrimary, marginBottom: 12 }]}>Subject Mastery</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Analytics')}>
                <Text style={[styles.seeAllText, { color: theme.primaryLight }]}>Analytics →</Text>
              </TouchableOpacity>
            </View>
            {subjectMasteries.slice(0, 3).map((item, idx) => (
              <MasteryBar
                key={idx}
                label={item.subject}
                percentage={item.masteryPercentage}
                quizzesCount={item.quizzesTaken}
              />
            ))}
          </View>
        )}

        {/* Recent Quizzes List */}
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionHeader, { color: theme.textPrimary }]}>Recent Quizzes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Upload')}>
            <Text style={[styles.seeAllText, { color: theme.primaryLight }]}>+ Create New</Text>
          </TouchableOpacity>
        </View>

        {quizzes.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <BookOpen size={32} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No Quizzes Yet</Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>Upload a document to generate your first AI powered quiz.</Text>
          </View>
        ) : (
          quizzes.slice(0, 4).map((quiz) => (
            <TouchableOpacity
              key={quiz.id}
              style={[styles.quizCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              onPress={() => {
                setActiveQuiz(quiz);
                navigation.navigate('QuizPlayer');
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.quizIconBox, { backgroundColor: theme.primaryBg }]}>
                <BookOpen size={20} color={theme.primary} />
              </View>
              <View style={styles.quizInfo}>
                <Text style={[styles.quizTitle, { color: theme.textPrimary }]} numberOfLines={1}>{quiz.title}</Text>
                <Text style={[styles.quizMeta, { color: theme.textSecondary }]}>
                  {quiz.subject} • {quiz.questions.length} Items • {quiz.difficulty.toUpperCase()}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.startBtn, { backgroundColor: theme.primary }]}
                onPress={() => {
                  setActiveQuiz(quiz);
                  navigation.navigate('QuizPlayer');
                }}
                activeOpacity={0.8}
              >
                <Play size={12} color="#FFF" />
                <Text style={styles.startBtnText}>Start</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};
