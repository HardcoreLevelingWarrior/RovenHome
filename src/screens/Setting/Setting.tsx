// src/screens/Setting/Setting.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Switch,
} from 'react-native';
import { useTheme } from '../../context/themeContext';
import { useTranslation } from 'react-i18next';
import LanguageToggleButton from './components/languageToggleButton';
import ThemeToggleButton from './components/themeToggleButton';
import CustomText from '../../components/customText';

export default function Setting() {
  const { theme } = useTheme();
  const { colors, typography } = theme;
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomText
        style={[
          styles.title,
          {
            color: colors.textPrimary,
            fontSize: typography.fontSize.xxxl,
          },
        ]}
        children={t('settings.setting')}
        weight="bold"
      ></CustomText>

      <ThemeToggleButton></ThemeToggleButton>
      <LanguageToggleButton></LanguageToggleButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 15,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
});

// import { Text, View, Image } from 'react-native';

// function Setting() {
//   return (
//     <View>
//       <Text>Setting</Text>
//     </View>
//   );
// }
// export default Setting;
