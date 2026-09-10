import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useQuiz } from '../context/QuizContext';
import { colors } from '../theme/colors';
import { flashcardStyles as styles } from './FlashcardsScreen.styles';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react-native';

export interface Flashcard {
  id: string;
  deck: string;
  subject: string;
  front: string;
  back: string;
  explanation?: string;
  difficulty?: 'easy' | 'good' | 'hard';
}

const SAMPLE_DECKS: Record<string, Flashcard[]> = {
  'Mistakes Vault': [],
  'Computer Science': [
    {
      id: 'cs-1',
      deck: 'Computer Science',
      subject: 'Data Structures',
      front: 'What is the time complexity of lookup in a Hash Table on average?',
      back: 'O(1) - Constant Time',
      explanation: 'Hash tables use key hashing to map directly to memory indices, giving average O(1) performance.',
    },
    {
      id: 'cs-2',
      deck: 'Computer Science',
      subject: 'Algorithms',
      front: 'What is the difference between BFS and DFS?',
      back: 'BFS uses a Queue (Level-by-Level). DFS uses a Stack/Recursion (Deepest Path First).',
      explanation: 'Breadth-First Search finds the shortest path in unweighted graphs, while Depth-First Search explores exhaustively.',
    },
    {
      id: 'cs-3',
      deck: 'Computer Science',
      subject: 'Operating Systems',
      front: 'What is a Deadlock in OS?',
      back: 'A state where a set of processes are blocked because each holds a resource and waits for another.',
      explanation: 'Four necessary conditions for Deadlock: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.',
    },
  ],
  'Organic Chemistry': [
    {
      id: 'chem-1',
      deck: 'Organic Chemistry',
      subject: 'Reactions',
      front: 'What is an SN2 Reaction mechanism?',
      back: 'Bimolecular Nucleophilic Substitution occurring in a single concerted step with inversion of stereochemistry.',
      explanation: 'SN2 involves a backside attack by a strong nucleophile on a primary or secondary alkyl halide.',
    },
    {
      id: 'chem-2',
      deck: 'Organic Chemistry',
      subject: 'Functional Groups',
      front: 'What functional group contains a C=O double bond attached to an OH?',
      back: 'Carboxylic Acid (-COOH)',
      explanation: 'Carboxylic acids are weak organic acids common in biological molecules like amino acids.',
    },
  ],
  'World History': [
    {
      id: 'hist-1',
      deck: 'World History',
      subject: 'Ancient Empires',
      front: 'What treaty ended World War I in 1919?',
      back: 'Treaty of Versailles',
      explanation: 'Signed in June 1919, imposing severe financial reparations and military restrictions on Germany.',
    },
  ],
};

export const FlashcardsScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { mistakes } = useQuiz();

  // Combine Mistakes into a dynamic deck
  const mistakeCards: Flashcard[] = mistakes.map((m, idx) => ({
    id: `mistake-${m.id}`,
    deck: 'Mistakes Vault',
    subject: m.subject || 'Mistake Review',
    front: m.question.text,
    back: `Correct Answer: ${m.question.correctAnswer}`,
    explanation: m.question.explanation,
  }));

  const allDecks: Record<string, Flashcard[]> = {
    'Mistakes Vault': mistakeCards.length > 0 ? mistakeCards : [
      {
        id: 'm-empty',
        deck: 'Mistakes Vault',
        subject: 'All Clear',
        front: 'No mistakes logged yet!',
        back: 'Take quizzes and missed questions will automatically appear here as active recall flashcards.',
        explanation: 'The Mistake Vault automatically syncs with your quiz history.',
      },
    ],
    ...SAMPLE_DECKS,
  };

  const deckKeys = Object.keys(allDecks);
  const [selectedDeck, setSelectedDeck] = useState<string>(deckKeys[0]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const flipAnim = useRef(new Animated.Value(0)).current;

  const currentCards = allDecks[selectedDeck] || [];
  const activeCard = currentCards[currentIndex] || currentCards[0];

  const handleFlip = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (isFlipped) handleFlip();
    setCurrentIndex((prev) => (prev + 1) % currentCards.length);
  };

  const handlePrev = () => {
    if (isFlipped) handleFlip();
    setCurrentIndex((prev) => (prev - 1 + currentCards.length) % currentCards.length);
  };

  const handleSelectDeck = (deck: string) => {
    if (isFlipped) handleFlip();
    setSelectedDeck(deck);
    setCurrentIndex(0);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 89, 90, 180],
    outputRange: [1, 1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 89, 90, 180],
    outputRange: [0, 0, 1, 1],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Deck Chips Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.deckSelectorScroll}
        >
          {deckKeys.map((deck) => {
            const isActive = selectedDeck === deck;
            const cardCount = allDecks[deck].length;
            return (
              <TouchableOpacity
                key={deck}
                style={[
                  styles.deckChip,
                  {
                    backgroundColor: isActive
                      ? theme.skyBlueBg
                      : theme.card,
                    borderColor: isActive ? theme.skyBlue : theme.cardBorder,
                  },
                ]}
                onPress={() => handleSelectDeck(deck)}
                activeOpacity={0.8}
              >
                <Layers
                  size={14}
                  color={isActive ? theme.skyBlue : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.deckChipText,
                    {
                      color: isActive ? theme.skyBlue : theme.textSecondary,
                    },
                  ]}
                >
                  {deck} ({cardCount})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Progress Info */}
        <View style={styles.progressRow}>
          <Text style={[styles.progressText, { color: theme.textPrimary }]}>
            {selectedDeck.toUpperCase()}
          </Text>
          <Text style={[styles.countText, { color: theme.textSecondary }]}>
            Card {currentIndex + 1} of {currentCards.length}
          </Text>
        </View>

        {/* Progress Bar */}
        <View
          style={[
            styles.progressBarTrack,
            { backgroundColor: theme.cardBorder },
          ]}
        >
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${((currentIndex + 1) / currentCards.length) * 100}%`,
                backgroundColor: theme.skyBlue,
              },
            ]}
          />
        </View>

        {/* Flip Card Stage */}
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={handleFlip}
          style={styles.cardContainer}
        >
          {/* Card Front */}
          <Animated.View
            style={[
              styles.cardSurface,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                opacity: frontOpacity,
                transform: [{ rotateY: frontInterpolate }],
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.badgeTag,
                  { backgroundColor: theme.skyBlueBg },
                ]}
              >
                <Text style={[styles.badgeText, { color: theme.skyBlue }]}>
                  {activeCard?.subject || 'Question'}
                </Text>
              </View>
              <View style={styles.flipHint}>
                <RotateCw size={12} color={theme.textMuted} />
                <Text
                  style={[styles.flipHintText, { color: theme.textMuted }]}
                >
                  Tap to flip
                </Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <Text
                style={[styles.questionLabel, { color: theme.skyBlue }]}
              >
                QUESTION / PROMPT
              </Text>
              <Text
                style={[styles.cardTitleText, { color: theme.textPrimary }]}
              >
                {activeCard?.front}
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <Text
                style={[styles.tapToFlipText, { color: theme.textSecondary }]}
              >
                🔄 Tap anywhere on card to reveal answer
              </Text>
            </View>
          </Animated.View>

          {/* Card Back */}
          <Animated.View
            style={[
              styles.cardSurface,
              StyleSheet.absoluteFill,
              {
                backgroundColor: theme.card,
                borderColor: theme.skyBlue,
                opacity: backOpacity,
                transform: [{ rotateY: backInterpolate }],
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.badgeTag,
                  { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
                ]}
              >
                <Text style={[styles.badgeText, { color: colors.success }]}>
                  ANSWER & EXPLANATION
                </Text>
              </View>
              <View style={styles.flipHint}>
                <RotateCw size={12} color={theme.textMuted} />
                <Text
                  style={[styles.flipHintText, { color: theme.textMuted }]}
                >
                  Tap to flip
                </Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <Text
                style={[styles.cardTitleText, { color: theme.textPrimary }]}
              >
                {activeCard?.back}
              </Text>

              {activeCard?.explanation && (
                <View
                  style={[
                    styles.explanationBox,
                    {
                      backgroundColor: theme.skyBlueBg,
                      borderColor: theme.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.explanationText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    💡 {activeCard.explanation}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.cardFooter}>
              <Text
                style={[styles.tapToFlipText, { color: theme.textSecondary }]}
              >
                Rate your recall below to advance
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>

        {/* Confidence Rating Buttons */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[
              styles.ratingBtn,
              {
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                borderColor: colors.danger,
              },
            ]}
            onPress={handleNext}
          >
            <Text style={[styles.ratingText, { color: colors.danger }]}>
              🔴 Hard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.ratingBtn,
              {
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                borderColor: colors.warning,
              },
            ]}
            onPress={handleNext}
          >
            <Text style={[styles.ratingText, { color: colors.warning }]}>
              🟡 Good
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.ratingBtn,
              {
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                borderColor: colors.success,
              },
            ]}
            onPress={handleNext}
          >
            <Text style={[styles.ratingText, { color: colors.success }]}>
              🟢 Easy
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[
              styles.navBtn,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
              },
            ]}
            onPress={handlePrev}
          >
            <ChevronLeft size={18} color={theme.textPrimary} />
            <Text style={[styles.navBtnText, { color: theme.textPrimary }]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navBtn,
              {
                backgroundColor: theme.skyBlue,
                borderColor: theme.skyBlue,
              },
            ]}
            onPress={handleNext}
          >
            <Text style={[styles.navBtnText, { color: '#FFF' }]}>
              Next Card
            </Text>
            <ChevronRight size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
