import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
    justifyContent: 'center',
    padding: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  appName: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textDarkPrimary,
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 14,
    color: colors.textDarkSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.cardDark,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.cardDarkBorder,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDarkSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.bgDark,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.textDarkPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.cardDarkBorder,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cardDarkBorder,
  },
  dividerText: {
    fontSize: 11,
    color: colors.textDarkMuted,
    marginHorizontal: 10,
    fontWeight: '600',
  },
  guestBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardDarkBorder,
  },
  guestBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDarkPrimary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchText: {
    fontSize: 13,
    color: colors.textDarkSecondary,
  },
  switchLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryLight,
    marginLeft: 4,
  },
});
