/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// import { useState, useEffect } from 'react';
// import {
//   ActivityIndicator,
//   Text,
//   Image,
//   View,
//   useColorScheme,
//   StatusBar,
//   StyleSheet,
// } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { ThemeProvider } from '../context/themeContext';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { I18nManager } from 'react-native';
// import MainNavigation from '../navigation/MainNavigation';
// import { usePersistedLanguage } from '../hooks/usePersistedLanguage';
// import '../i18n';
import RNRestart from 'react-native-restart';

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Image,
  View,
  useColorScheme,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../context/themeContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { I18nManager } from 'react-native';
import MainNavigation from '../navigation/MainNavigation';
import { usePersistedLanguage } from '../hooks/usePersistedLanguage';
import '../i18n';

function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const { currentLanguage, isLanguageReady } = usePersistedLanguage();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    if (!isLanguageReady) return;

    I18nManager.allowRTL(true);
    // I18nManager.forceRTL(false);   // فقط در صورت نیاز یک بار فعال کن

    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isLanguageReady]);

  if (!isAppReady || !isLanguageReady) {
    return (
      <SafeAreaProvider>
        <LoadingScreen isDarkMode={isDarkMode} />
      </SafeAreaProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: isDarkMode ? '#121212' : '#ffffff',
          }}
        >
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor="transparent"
            translucent
          />
          <NavigationContainer>
            <MainNavigation />
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

// ==================== کامپوننت لودینگ ====================
function LoadingScreen({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <View
      style={[
        styles.loadingContainer,
        { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' },
      ]}
    >
      <Image
        source={require('../assets/images/brands/roven.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator
        size="large"
        color="#6366f1"
        style={{ marginTop: 40 }}
      />
    </View>
  );
}

// }

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    width: '50%', // اندازه ثابت بهتره (یا maxWidth: '70%')
    height: '50%',
    marginBottom: 40,
  },
  loadingText: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: '500',
  },
});

export default App;
