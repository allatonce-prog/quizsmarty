import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { colors } from '../theme/colors';
import { documentService, PickedDocument } from '../services/documentService';
import { uploadStyles as styles } from './UploadScreen.styles';
import { FileUp, FileText, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react-native';

export const UploadScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Upload Document</Text>
        <Text style={styles.headerSub}>Select a PDF or PowerPoint (.ppt, .pptx) file to generate AI questions.</Text>

        {/* Drop / Pick Box */}
        <TouchableOpacity
          style={styles.dropZone}
          onPress={handlePickDocument}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <View style={styles.iconCircle}>
                <FileUp size={36} color={colors.primaryLight} />
              </View>
              <Text style={styles.dropTitle}>Tap to Browse Files</Text>
              <Text style={styles.dropFormats}>Supports PDF, PPT, PPTX and TXT</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Picked File Preview Card */}
        {doc && (
          <View style={styles.previewCard}>
            <View style={styles.docHeader}>
              <FileText size={24} color={colors.primary} />
              <View style={styles.docInfo}>
                <Text style={styles.docName} numberOfLines={1}>{doc.name}</Text>
                <Text style={styles.docMeta}>
                  {doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : 'Ready for text extraction'}
                </Text>
              </View>
              <CheckCircle2 size={22} color={colors.success} />
            </View>

            <View style={styles.divider} />

            <Text style={styles.previewHeading}>EXTRACTED TEXT PREVIEW</Text>
            <View style={styles.textPreviewBox}>
              <Text style={styles.previewText} numberOfLines={6}>
                {doc.extractedText}
              </Text>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.repickBtn} onPress={handlePickDocument}>
                <RefreshCw size={16} color={colors.textDarkSecondary} />
                <Text style={styles.repickText}>Change File</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.proceedBtn} onPress={handleProceedToGenerator}>
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
