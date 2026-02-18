/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { NewAppScreen } from '@react-native/new-app-screen';
import MainNavigation from '../navigation/MainNavigation.tsx';
import { ThemeProvider } from '../context/themeContext.tsx';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart';
import { useEffect } from 'react';
import { usePersistedLanguage } from '../hooks/usePersistedLanguage.ts';
import '../i18n';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { currentLanguage, isLanguageReady } = usePersistedLanguage();

  useEffect(() => {
    if (!isLanguageReady) return;

    const isRTL = currentLanguage.startsWith('fa');

    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(isRTL);
      // ری‌استارت برای اعمال کامل layout
      setTimeout(() => {
        RNRestart.Restart();
      }, 300);
    }
  }, [currentLanguage, isLanguageReady]);

  // تا وقتی زبان لود نشده، چیزی نشون نده یا لودینگ بذار
  if (!isLanguageReady) {
    return null; // یا <LoadingScreen />
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <MainNavigation></MainNavigation>
      </NavigationContainer>
    </ThemeProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
