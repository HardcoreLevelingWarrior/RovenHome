import { palette, spacing, typography, shadows } from '../';

export const darkTheme = {
  colors: {
    primary: palette.primary.light,
    primaryLight: palette.primary.main,
    primaryDark: palette.primary.dark,
    background: '#121212',
    surface: '#1e1e1e',
    textPrimary: '#ffffff',
    textSecondary: '#bbbbbb',
    divider: '#444444',
    error: '#ef5350',
  },
  spacing,
  typography,
  shadows,
} as const;
