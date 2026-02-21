import { useState } from 'react';
import { StyleSheet, TouchableOpacity, Modal, View } from 'react-native';
import CustomText from '../../../components/customText';
import { useTheme } from '../../../context/themeContext';
import { useTranslation } from 'react-i18next';
import { typography } from '../../../theme';

function ScanWifi() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.scanWifiBtn, { backgroundColor: colors.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <CustomText
          style={{
            color: colors.textPrimary,
            fontWeight: '600',
            fontSize: typography.fontSize.xl,
          }}
          children={t('Scan Wifi')}
          weight="bold"
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
              children={t('Choose Wifi')}
            ></CustomText>

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
  scanWifiBtn: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '85%',
    marginHorizontal: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
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
  closeBtn: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
});

export default ScanWifi;
