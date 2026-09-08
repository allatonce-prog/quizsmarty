import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const analyticsStyles = StyleSheet.create({
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
  sectionCard: {
    backgroundColor: colors.cardDark,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.cardDarkBorder,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDarkPrimary,
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textDarkSecondary,
    fontStyle: 'italic',
  },
  weakItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgDark,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  weakInfo: {
    flex: 1,
  },
  weakName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDarkPrimary,
  },
  weakMeta: {
    fontSize: 11,
    color: colors.textDarkSecondary,
    marginTop: 2,
  },
  weakAccuracyBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  weakAccuracyText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.danger,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardDarkBorder,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDarkPrimary,
  },
  historyMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  historyMeta: {
    fontSize: 11,
    color: colors.textDarkMuted,
    marginLeft: 4,
  },
  scorePill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
  },
});
