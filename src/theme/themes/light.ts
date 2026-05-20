import { palette, spacing, typography, shadows } from '../';

export const lightTheme = {
  colors: {
    primary: palette.primary.main,
    primaryLight: palette.primary.light,
    primaryDark: palette.primary.dark,
    background: palette.background.default,
    surface: palette.background.paper,
    textPrimary: palette.text.primary,
    textSecondary: palette.text.secondary,
    divider: palette.divider,
    error: palette.error.main,
    card: '#ffffff',
    border: palette.divider,
    textOnPrimary: '#ffffff',
    success: palette.success.main, // ← سبز موفق
    warning: palette.warning.main, // ← اگر بعداً نیاز داشتی
  },
  spacing,
  typography,
  shadows,
} as const;
