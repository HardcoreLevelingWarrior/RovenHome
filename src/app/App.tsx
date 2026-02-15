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
import '../i18n';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

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
