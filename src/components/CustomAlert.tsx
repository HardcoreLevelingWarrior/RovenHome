// components/CustomAlert.tsx
import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../context/themeContext';
import CustomText from './customText';
import { useTranslation } from 'react-i18next';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message: string;
  type?: AlertType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  singleButton?: boolean;
  onClose?: () => void;
}

export default function CustomAlert({
  visible,
  title,
  message,
  type = 'info',
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  singleButton = true,
  onClose,
}: CustomAlertProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;
  const { t } = useTranslation();

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return colors.success || '#4CAF50';
      case 'error':
        return colors.error || '#F44336';
      case 'warning':
        return colors.warning || '#FF9800';
      case 'info':
        return colors.primary || '#2196F3';
      default:
        return colors.primary;
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.alertContainer,
                {
                  backgroundColor: colors.surface || colors.background,
                  shadowColor: '#000',
                },
              ]}
            >
              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getTypeColor() + '20' },
                ]}
              >
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: getTypeColor() },
                  ]}
                >
                  <CustomText style={styles.iconText} weight="bold">
                    {getIcon()}
                  </CustomText>
                </View>
              </View>

              {/* Title */}
              {title && (
                <CustomText
                  style={[
                    styles.title,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.fontSize.xl,
                    },
                  ]}
                  weight="bold"
                >
                  {title}
                </CustomText>
              )}

              {/* Message */}
              <CustomText
                style={[
                  styles.message,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.fontSize.base,
                  },
                ]}
              >
                {message}
              </CustomText>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                {!singleButton && (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.cancelButton,
                      { borderColor: colors.divider },
                    ]}
                    onPress={handleCancel}
                  >
                    <CustomText
                      style={{ color: colors.textSecondary }}
                      weight="regular"
                    >
                      {cancelText || t('Cancel')}
                    </CustomText>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.confirmButton,
                    { backgroundColor: getTypeColor() },
                    singleButton && styles.singleButton,
                  ]}
                  onPress={handleConfirm}
                >
                  <CustomText style={{ color: '#fff' }} weight="bold">
                    {confirmText || (singleButton ? t('OK') : t('Confirm'))}
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
  alertContainer: {
    width: '85%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 28,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    marginLeft: 0,
  },
  cancelButton: {
    borderWidth: 1,
  },
  singleButton: {
    flex: 1,
  },
});
