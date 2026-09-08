import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const uploadStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 90,
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
  dropZone: {
    backgroundColor: colors.cardDark,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.cardDarkBorder,
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dropTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDarkPrimary,
  },
  dropFormats: {
    fontSize: 12,
    color: colors.textDarkMuted,
    marginTop: 4,
  },
  previewCard: {
    backgroundColor: colors.cardDark,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardDarkBorder,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docInfo: {
    flex: 1,
    marginLeft: 12,
  },
  docName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDarkPrimary,
  },
  docMeta: {
    fontSize: 12,
    color: colors.textDarkSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardDarkBorder,
    marginVertical: 14,
  },
  previewHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryLight,
    letterSpacing: 1,
    marginBottom: 8,
  },
  textPreviewBox: {
    backgroundColor: colors.bgDark,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  previewText: {
    fontSize: 12,
    color: colors.textDarkSecondary,
    lineHeight: 18,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  repickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.cardDarkBorder,
  },
  repickText: {
    fontSize: 13,
    color: colors.textDarkSecondary,
    marginLeft: 6,
  },
  proceedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  proceedText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
    marginRight: 6,
  },
});
