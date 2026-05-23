// src/screens/PairingScreen/components/AlertModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/themeContext'; // مسیر theme خودت رو درست کن

const { width } = Dimensions.get('window');

interface AlertModalProps {
  alertVisible: boolean;
  setAlertVisible: (visible: boolean) => void;
  title?: string;
  message?: string;
  confirmText?: string;
  onConfirm?: () => void;
  cancelText?: string;
  onCancel?: () => void;
  children?: React.ReactNode; // برای سازگاری با نسخه قبلی که children می‌گرفت
}

export default function AlertModal({
  alertVisible,
  setAlertVisible,
  title = 'notofication',
  message,
  confirmText = 'confirm',
  onConfirm,
  cancelText,
  onCancel,
  children,
}: AlertModalProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    setAlertVisible(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    setAlertVisible(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={alertVisible}
      onRequestClose={() => setAlertVisible(false)}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.background || '#fff',
              borderColor: colors.surface,
            },
          ]}
        >
          {/* عنوان */}
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>

          {/* محتوا - یا message یا children */}
          {children ? (
            <View style={styles.childrenContainer}>{children}</View>
          ) : message ? (
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              {message}
            </Text>
          ) : null}

          {/* دکمه‌ها */}
          <View style={styles.buttonContainer}>
            {/* دکمه Cancel (اختیاری) */}
            {cancelText && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  // { borderColor: colors.border },
                ]}
                onPress={handleCancel}
              >
                <Text
                  style={[styles.buttonText, { color: colors.textSecondary }]}
                >
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}

            {/* دکمه Confirm */}
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleConfirm}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: colors.textPrimary || '#fff' },
                ]}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.82,
    maxWidth: 360,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  childrenContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    // backgroundColor در props ست میشه
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
// import { useTranslation } from 'react-i18next';
// import CustomText from '../../../components/customText';
// import { useTheme } from '../../../context/themeContext';

// interface Props {
//   alertVisible: boolean;
//   setAlertVisible: (val: boolean) => void;
//   children: React.ReactNode;
// }

// export default function AlertModal({
//   alertVisible,
//   setAlertVisible,
//   children,
// }: Props) {
//   const { theme, isDark, toggleTheme } = useTheme();
//   const { colors, spacing } = theme;
//   const { t } = useTranslation();

//   return (
//     <Modal
//       animationType="fade"
//       transparent={true}
//       visible={alertVisible}
//       onRequestClose={() => setAlertVisible(false)}
//     >
//       <View style={styles.modalOverlay}>
//         <View
//           style={[styles.modalContent, { backgroundColor: colors.surface }]}
//         >
//           <CustomText
//             style={[styles.modalTitle, { color: colors.textPrimary }]}
//             children={children}
//           ></CustomText>

//           <TouchableOpacity
//             style={[styles.closeBtn, { backgroundColor: colors.primary }]}
//             onPress={() => setAlertVisible(false)}
//           >
//             <CustomText
//               style={{ color: colors.textPrimary, fontWeight: '600' }}
//               children={t('Close')}
//             ></CustomText>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '82%',
//     padding: 24,
//     borderRadius: 16,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 28,
//   },
//   switchContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     marginBottom: 32,
//   },
//   closeBtn: {
//     paddingVertical: 14,
//     paddingHorizontal: 48,
//     borderRadius: 12,
//   },
// });
