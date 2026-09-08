import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const achievementsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 90,
  },
  tierHeroCard: {
    backgroundColor: colors.cardDark,
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.cardDarkBorder,
    marginBottom: 20,
  },
  crownIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  tierTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  levelText: {
    fontSize: 14,
    color: colors.textDarkSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  xpRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.cardDarkBorder,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 10,
  },
  xpFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  xpSubtext: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textDarkPrimary,
    marginBottom: 12,
  },
  tierFilterRow: {
    flexDirection: 'row',
    backgroundColor: colors.cardDark,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.cardDarkBorder,
    marginBottom: 16,
  },
  tierFilterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tierFilterBtnActive: {
    backgroundColor: colors.primary,
  },
  tierFilterText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textDarkSecondary,
  },
  tierFilterTextActive: {
    color: '#FFF',
  },
});
