/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Text,
  Image,
  View,
  useColorScheme,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../context/themeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nManager } from 'react-native';
import MainNavigation from '../navigation/MainNavigation';
import { usePersistedLanguage } from '../hooks/usePersistedLanguage';
import '../i18n';

function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const { currentLanguage, isLanguageReady } = usePersistedLanguage();

  // کنترل لودینگ: حداقل ۵ ثانیه + منتظر آماده شدن زبان
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    if (!isLanguageReady) return;

    const isRTL = currentLanguage.startsWith('fa');

    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(isRTL);
      // ری‌استارت معمولاً لازم نیست (اکثر کامپوننت‌ها خودکار هماهنگ می‌شن)
      // اگر layout واقعاً به‌هم ریخت، این خط رو فعال کن:
      // setTimeout(() => RNRestart.Restart(), 300);
    }

    // حداقل ۵ ثانیه صبر (حتی اگر زبان زودتر آماده شد)
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLanguageReady, currentLanguage]);

  // صفحه لودینگ ساده (بدون نیاز به ThemeProvider)
  if (!isAppReady || !isLanguageReady) {
    return (
      <SafeAreaProvider>
        <LoadingScreen isDarkMode={isDarkMode} />
      </SafeAreaProvider>
    );
  }

  // اپلیکیشن اصلی
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        <NavigationContainer>
          <MainNavigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

// کامپوننت لودینگ جداگانه (بدون وابستگی به theme)
function LoadingScreen({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <View
      style={[
        styles.loadingContainer,
        { backgroundColor: isDarkMode ? '#333' : '#fff' },
      ]}
    >
      <Image
        source={require('../assets/images/brands/roven.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator
        size="large"
        color="#6366f1" // رنگ ثابت یا می‌تونی از تم اصلی بگیری
        style={{ marginTop: 40 }}
      />
    </View>
  );
}

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

//**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import { useState, useEffect } from 'react';
// import { ActivityIndicator, Text, Image } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { NewAppScreen } from '@react-native/new-app-screen';
// import MainNavigation from '../navigation/MainNavigation.tsx';
// import { ThemeProvider } from '../context/themeContext.tsx';
// import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
// import { I18nManager } from 'react-native';
// import RNRestart from 'react-native-restart';
// import { usePersistedLanguage } from '../hooks/usePersistedLanguage.ts';
// import '../i18n';
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';

// function App() {
//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === 'dark';
//   const { currentLanguage, isLanguageReady } = usePersistedLanguage();
//   const [isAppReady, setIsAppReady] = useState(false);

//   useEffect(() => {
//     if (!isLanguageReady) return;

//     const isRTL = currentLanguage.startsWith('fa');

//     if (I18nManager.isRTL !== isRTL) {
//       I18nManager.allowRTL(true);
//       I18nManager.forceRTL(isRTL);
//       // ری‌استارت برای اعمال کامل layout
//       setTimeout(() => {
//         RNRestart.Restart();
//       }, 300);
//     }

//     const minDelayTimer = setTimeout(() => {
//       setIsAppReady(true);
//     }, 5000);

//     return () => clearTimeout(minDelayTimer);
//   }, [currentLanguage, isLanguageReady]);

//   // تا وقتی زبان لود نشده، چیزی نشون نده یا لودینگ بذار
//   // if (!isLanguageReady) {
//   //   return null; // یا <LoadingScreen />
//   // }
//   if (!isAppReady || !isLanguageReady) {
//     return <LoadingScreen isDarkMode={isDarkMode} />;
//   }

//   return (
//     <ThemeProvider>
//       <SafeAreaProvider>
//         <StatusBar
//           barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//           backgroundColor="transparent"
//           translucent
//         />
//         <NavigationContainer>
//           <MainNavigation />
//         </NavigationContainer>
//       </SafeAreaProvider>
//     </ThemeProvider>
//   );
// }

// function LoadingScreen({ isDarkMode }: { isDarkMode: boolean }) {
//   return (
//     <View
//       style={[
//         styles.loadingContainer,
//         { backgroundColor: isDarkMode ? '#000' : '#fff' },
//       ]}
//     >
//       <Image
//         source={require('../assets/images/brands/roven.png')}
//         style={styles.logo}
//         resizeMode="contain"
//       />
//       <ActivityIndicator
//         size="large"
//         color="#6366f1"
//         style={{ marginTop: 40 }}
//       />
//       <Text
//         style={[styles.loadingText, { color: isDarkMode ? '#fff' : '#000' }]}
//       >
//         در حال بارگذاری...
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//   },
//   logo: {
//     width: '60%', // یا مقدار ثابت مثل 220
//     height: '30%', // یا 140
//     marginBottom: 40,
//   },
//   loadingText: {
//     marginTop: 24,
//     fontSize: 18,
//     fontWeight: '500',
//   },
// });
