import { Platform } from 'react-native';

export const colors = {
  bg: '#FAF6F0',
  card: '#FFFFFF',
  surface: '#F1EADF',
  tint: '#F1E7D8',
  ink: '#1E2623',
  accent: '#A9742F',
  muted: '#8B857B',
  line: '#E8E0D3',
  sale: '#C2412D',
  heart: '#D9452B',
  star: '#E8A317',
};
export const fonts = { serif: Platform.select({ ios: 'Georgia', android: 'serif' }) };
export const shadow = {
  shadowColor: '#5B4630', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3,
};
