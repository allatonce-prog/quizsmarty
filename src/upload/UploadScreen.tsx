import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { documentService, PickedDocument } from '../services/documentService';
import { uploadStyles as styles } from './UploadScreen.styles';
import { FileUp, FileText, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react-native';

export const UploadScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [doc, setDoc] = useState<PickedDocument | null>(null);

  const handlePickDocument = async () => {
    setLoading(true);
    try {
      const picked = await documentService.pickDocument();
      if (picked) {
        setDoc(picked);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to read selected document file.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToGenerator = () => {
    if (!doc) return;
    navigation.navigate('QuizGenerator', {
      rawText: doc.extractedText,
      documentName: doc.name,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Upload Document</Text>
        <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
          Select a PDF or PowerPoint (.ppt, .pptx) file to generate AI questions.
        </Text>

        {/* Drop / Pick Box */}
        <TouchableOpacity
          style={[
            styles.dropZone,
            {
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            },
          ]}
          onPress={handlePickDocument}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="large" color={theme.primary} />
          ) : (
            <>
              <View style={[styles.iconCircle, { backgroundColor: theme.primaryBg }]}>
                <FileUp size={36} color={theme.primary} />
              </View>
              <Text style={[styles.dropTitle, { color: theme.textPrimary }]}>Tap to Browse Files</Text>
              <Text style={[styles.dropFormats, { color: theme.textMuted }]}>Supports PDF, PPT, PPTX and TXT</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Picked File Preview Card */}
        {doc && (
          <View style={[styles.previewCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.docHeader}>
              <FileText size={24} color={theme.primary} />
              <View style={styles.docInfo}>
                <Text style={[styles.docName, { color: theme.textPrimary }]} numberOfLines={1}>{doc.name}</Text>
                <Text style={[styles.docMeta, { color: theme.textSecondary }]}>
                  {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : 'Ready for text extraction'}
                </Text>
              </View>
              <CheckCircle2 size={22} color={theme.success} />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />

            <Text style={[styles.previewHeading, { color: theme.primary }]}>EXTRACTED TEXT PREVIEW</Text>
            <View style={[styles.textPreviewBox, { backgroundColor: theme.inputBg }]}>
              <Text style={[styles.previewText, { color: theme.textSecondary }]} numberOfLines={6}>
                {doc.extractedText}
              </Text>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.repickBtn, { backgroundColor: theme.inputBg }]}
                onPress={handlePickDocument}
              >
                <RefreshCw size={16} color={theme.textSecondary} />
                <Text style={[styles.repickText, { color: theme.textSecondary }]}>Change File</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.proceedBtn, { backgroundColor: theme.primary }]}
                onPress={handleProceedToGenerator}
              >
                <Text style={styles.proceedText}>Configure Quiz</Text>
                <ArrowRight size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
