// src/components/Settings/ThemeToggleButton.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Switch,
} from 'react-native';
import { useTheme } from '../../../context/themeContext';
import { useTranslation } from 'react-i18next';
import CustomText from '../../../components/customText';


export default function ThemeToggleButton() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { colors, spacing } = theme;

  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  

  return (
    <>
      <TouchableOpacity
        style={[styles.row, { borderBottomColor: colors.divider }]}
        onPress={() => setModalVisible(true)}
      >
        <CustomText
          style={[styles.label, { color: colors.textPrimary }]}
          children={t('Theme')}
        ></CustomText>

        <CustomText
          style={[styles.value, { color: colors.textSecondary }]}
          children={isDark ? t('Dark') : t('Light')}
        ></CustomText>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <CustomText
              style={[styles.modalTitle, { color: colors.textPrimary }]}
              children={t('Choose your theme')}
            ></CustomText>

            <View style={styles.switchContainer}>
              <CustomText
                style={{ color: colors.textPrimary, fontSize: 16 }}
                children={t('Dark mode')}
              ></CustomText>

              <Switch
                value={isDark}
                onValueChange={() => {
                  toggleTheme();
                  // اگر می‌خوای بعد از تغییر بسته بشه:
                  // setModalVisible(false);
                }}
                trackColor={{ false: colors.divider, true: colors.primary }}
                thumbColor={isDark ? colors.primaryLight : '#f4f3f4'}
              />
            </View>

            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: colors.primary }]}
              onPress={() => setModalVisible(false)}
            >
              <CustomText
                style={{ color: colors.textPrimary, fontWeight: '600' }}
                children={t('Close')}
              ></CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '82%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 28,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
  },
  closeBtn: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
});
