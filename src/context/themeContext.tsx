import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../theme';

// type Theme = typeof lightTheme;
type Theme = {
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    divider: string;
    error: string;
  };
  spacing: typeof lightTheme.spacing; // یا مستقیم { xs: number; ... }
  typography: typeof lightTheme.typography;
  shadows: typeof lightTheme.shadows;
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // const systemScheme = useColorScheme();
  const systemScheme = 'light';

  const effectiveScheme = systemScheme === 'light' ? 'light' : 'dark';

  const [mode, setMode] = useState<'light' | 'dark'>(effectiveScheme);

  const theme = mode === 'dark' ? darkTheme : lightTheme;
  const isDark = mode === 'dark';

  const toggleTheme = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(
    () => ({
      theme,
      isDark,
      toggleTheme,
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// export function ThemeProvider({ children }: { children: ReactNode }) {
//   const systemScheme = useColorScheme();
//   const effectiveScheme = systemScheme === 'dark' ? 'dark' : 'light';

//   const [mode, setMode] = useState<'light' | 'dark'>(effectiveScheme);
//   // const [mode, setMode] = useState<'light' | 'dark'>(systemScheme ?? 'light');

//   const theme = mode === 'dark' ? darkTheme : lightTheme;
//   const isDark = mode === 'dark';

//   const value = useMemo(
//     () => ({
//       theme,
//       isDark,
//       toggleTheme: () => setMode(prev => (prev === 'light' ? 'dark' : 'light')),
//     }),
//     [mode, theme],
//   );

//   return (
//     <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
//   );
// }
