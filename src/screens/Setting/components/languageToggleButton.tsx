// src/components/Settings/LanguageToggleButton.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/themeContext';

const LANGUAGES = [
  { code: 'fa', label: 'Persian' },
  { code: 'en', label: 'English' },
  // اگر انگلیسی هم داری: { code: 'en', label: 'English' }
];

export default function LanguageToggleButton() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { i18n, t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setModalVisible(false);
    // اگر می‌خوای ذخیره بشه:
    // AsyncStorage.setItem('userLanguage', lng);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.row, { borderBottomColor: colors.divider }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {t('language')}
        </Text>
        <Text style={[styles.value, { color: colors.textSecondary }]}>
          {t('current_language')} {/* یا مستقیم نام زبان فعلی */}
        </Text>
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
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              {t('Choose your language')}
            </Text>

            {LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langOption,
                  {
                    borderColor:
                      i18n.language === lang.code
                        ? colors.primary
                        : colors.divider,
                  },
                ]}
                onPress={() => changeLanguage(lang.code)}
              >
                <Text
                  style={{
                    color:
                      i18n.language === lang.code
                        ? colors.primary
                        : colors.textPrimary,
                    fontWeight: i18n.language === lang.code ? '600' : '400',
                  }}
                >
                  {t(lang.label)}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: colors.primary }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>
                {t('Close')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // تقریباً همان استایل‌های قبلی + چند مورد جدید
  langOption: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
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
  // بقیه استایل‌ها مشابه ThemeToggleButton
});
