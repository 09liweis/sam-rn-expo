import { StyleSheet } from 'react-native';

export const theme = {
  bg: '#F6F7FB',
  surface: '#FFFFFF',
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primarySoft: '#EEF0FE',
  ink: '#111827',
  text: '#1F2937',
  textSoft: '#6B7280',
  textFaint: '#9CA3AF',
  border: '#E5E7EB',
  borderSoft: '#F3F4F6',
  green: '#10B981',
  greenSoft: '#ECFDF5',
  red: '#EF4444',
  redSoft: '#FEF2F2',
  amber: '#F59E0B',
  amberSoft: '#FFFBEB',
  violet: '#8B5CF6',
  track: '#EEF0F5',
  radius: { sm: 8, md: 12, lg: 16, xl: 22 },
  font: {
    hero: 26,
    title: 19,
    body: 15,
    caption: 13,
    micro: 11,
  },
} as const;

/** Shared subtle card shadow (works on web + native) */
export const cardShadow = StyleSheet.create({
  shadow: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});
