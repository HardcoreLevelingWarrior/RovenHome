import { palette, spacing, typography, shadows } from '../';

export const darkTheme = {
  colors: {
    primary: palette.primary.light,
    primaryLight: palette.primary.main,
    primaryDark: palette.primary.dark,
    background: '#121212',
    surface: '#2e2d2d',
    textPrimary: '#ffffff',
    textSecondary: '#bbbbbb',
    divider: '#444444',
    error: '#ef5350',
    card: '#1e1e1e',
    border: '#555555',
    textOnPrimary: '#ffffff',
  },
  spacing,
  typography,
  shadows,
} as const;
