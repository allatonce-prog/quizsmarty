import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { useQuiz } from '../context/QuizContext';
import { QuestionType, DifficultyLevel } from '../types/quiz';
import { quizStyles as styles } from './QuizScreen.styles';
import { Sparkles, CheckSquare, Square, Minus, Plus } from 'lucide-react-native';

export const QuizGeneratorScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { rawText = '', documentName = 'Study Document' } = route.params || {};
  const { generateQuiz, setActiveQuiz, isGenerating } = useQuiz();

  const [title, setTitle] = useState<string>(documentName ? `Quiz: ${documentName.replace(/\.[^/.]+$/, '')}` : 'My Study Quiz');
  const [subject, setSubject] = useState<string>('General Education');
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(['multiple_choice', 'true_false']);

  const toggleType = (type: QuestionType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length === 1) {
        Alert.alert('Required', 'At least one question type must be selected.');
        return;
      }
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleAdjustCount = (delta: number) => {
    setNumQuestions((prev) => Math.max(5, Math.min(50, prev + delta)));
  };

  const handleGenerate = async () => {
    try {
      const generatedQuiz = await generateQuiz({
        title,
        subject,
        numQuestions,
        types: selectedTypes,
        difficulty,
        documentName,
        rawText: rawText || 'General study principles and concepts.',
      });

      setActiveQuiz(generatedQuiz);
      navigation.navigate('QuizPlayer');
    } catch (e: any) {
      Alert.alert('Generation Error', e.message || 'Could not generate quiz.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Quiz Customization</Text>
        <Text style={styles.headerSub}>Configure Gemini AI to build your tailored practice assessment.</Text>

        {/* Title & Subject */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Quiz Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Chapter 3 Overview"
            placeholderTextColor={colors.textDarkMuted}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Subject / Discipline</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholder="e.g. Computer Science, History, Biology"
            placeholderTextColor={colors.textDarkMuted}
          />
        </View>

        {/* Question Item Count (5 to 50 items) */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Number of Questions (5 to 50 items)</Text>
          <View style={styles.counterRow}>
            <TouchableOpacity style={styles.counterBtn} onPress={() => handleAdjustCount(-5)}>
              <Minus size={18} color={colors.textDarkPrimary} />
            </TouchableOpacity>
            <Text style={styles.counterValue}>{numQuestions} Questions</Text>
            <TouchableOpacity style={styles.counterBtn} onPress={() => handleAdjustCount(5)}>
              <Plus size={18} color={colors.textDarkPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Question Types */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Question Types</Text>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => toggleType('multiple_choice')}
            activeOpacity={0.8}
          >
            {selectedTypes.includes('multiple_choice') ? (
              <CheckSquare size={20} color={colors.primary} />
            ) : (
              <Square size={20} color={colors.textDarkMuted} />
            )}
            <Text style={styles.checkboxLabel}>Multiple Choice Questions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => toggleType('true_false')}
            activeOpacity={0.8}
          >
            {selectedTypes.includes('true_false') ? (
              <CheckSquare size={20} color={colors.primary} />
            ) : (
              <Square size={20} color={colors.textDarkMuted} />
            )}
            <Text style={styles.checkboxLabel}>True / False Questions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => toggleType('enumeration')}
            activeOpacity={0.8}
          >
            {selectedTypes.includes('enumeration') ? (
              <CheckSquare size={20} color={colors.primary} />
            ) : (
              <Square size={20} color={colors.textDarkMuted} />
            )}
            <Text style={styles.checkboxLabel}>Enumeration / Identification</Text>
          </TouchableOpacity>
        </View>

        {/* Difficulty Selector */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Difficulty Level</Text>
          <View style={styles.difficultySegment}>
            {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.segmentBtn,
                  difficulty === level && { backgroundColor: colors.primary },
                ]}
                onPress={() => setDifficulty(level)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    difficulty === level && styles.segmentTextActive,
                  ]}
                >
                  {level.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.generateBtn}
          onPress={handleGenerate}
          disabled={isGenerating}
          activeOpacity={0.85}
        >
          {isGenerating ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Sparkles size={20} color="#FFF" />
              <Text style={styles.generateBtnText}>Generate Quiz with Gemini AI</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
