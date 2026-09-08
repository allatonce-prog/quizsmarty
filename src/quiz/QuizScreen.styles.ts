import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const quizStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  scrollContent: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textDarkPrimary,
  },
  headerSub: {
    fontSize: 14,
    color: colors.textDarkSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDarkSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.cardDark,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardDarkBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textDarkPrimary,
    fontSize: 15,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardDark,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.cardDarkBorder,
  },
  counterBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.cardDarkBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDarkPrimary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardDark,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.cardDarkBorder,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDarkPrimary,
    marginLeft: 12,
  },
  difficultySegment: {
    flexDirection: 'row',
    backgroundColor: colors.cardDark,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.cardDarkBorder,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDarkSecondary,
  },
  segmentTextActive: {
    color: '#FFF',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    marginLeft: 8,
  },
});
