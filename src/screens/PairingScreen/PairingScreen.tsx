import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Appearance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/themeContext';
import { useTranslation } from 'react-i18next';
import CustomText from '../../components/customText';
import PairingService from '../../services/pairing/PairingService';
import AlertModal from './components/AlertModal';
import { useApplicationStore } from '../../stores/ApplicationStore';
import { WifiNetwork } from '../../stores/types';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigation/Routes';
import { useFocusEffect } from '@react-navigation/native';

const IP_ADDRESS = '192.168.4.1';
const PORT = 5000;

export default function PairingScreen() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const {
    status,
    wifiList,
    error: storeError,
    setError,
  } = useApplicationStore();
  const [selectedSsid, setSelectedSsid] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showNoWifiModal, setShowNoWifiModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorText, setModalErrorText] = useState('');

  const pairing = PairingService.getInstance();

  // useEffect(() => {
  //   let isMounted = true;

  //   const initialize = async () => {
  //     if (!isMounted) return;
  //     setIsLoading(true);
  //     setError(null);

  //     try {
  //       const connected = await pairing.startPairing(IP_ADDRESS, PORT);
  //       if (connected && isMounted) {
  //         pairing.sendScanWifi();
  //         setIsLoading(true);
  //       }
  //     } catch (err: any) {
  //       const msg = err?.message || t('Failed to connect to device');
  //       if (isMounted) {
  //         setError(msg);
  //         setModalErrorText(msg);
  //         setShowErrorModal(true);
  //       }
  //     } finally {
  //       if (isMounted) setIsLoading(false);
  //     }
  //   };

  //   initialize();

  //   return () => {
  //     isMounted = false;
  //     pairing.disconnect();
  //   };
  //   // }, []);
  // }, [pairing, t, setError]);

  // فقط این useEffect رو جایگزین کن

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const initialize = async () => {
        if (!isMounted) return;

        // ریست state برای ورود تازه
        setIsLoading(true);
        setError(null);
        setSelectedSsid(null);
        setPassword('');
        // اختیاری: setWifiList([]) اگر store setter داره

        try {
          const connected = await pairing.startPairing(IP_ADDRESS, PORT);
          if (connected && isMounted) {
            pairing.sendScanWifi();
          }
        } catch (err: any) {
          const msg = err?.message || t('Failed to connect to device');
          if (isMounted) {
            setError(msg);
            setModalErrorText(msg);
            setShowErrorModal(true);
          }
        } finally {
          if (isMounted) setIsLoading(false);
        }
      };

      initialize();

      return () => {
        isMounted = false;
        pairing.disconnect();
      };
    }, [pairing, t]),
  );

  useEffect(() => {
    if (storeError) {
      setModalErrorText(storeError);
      setShowErrorModal(true);
      setIsLoading(false);
    }
  }, [storeError]);

  useEffect(() => {
    if (status === 'success') {
      setShowSuccessModal(true);
    }
  }, [status]);

  const handleRetryScan = useCallback(() => {
    setError(null);
    setSelectedSsid(null);
    setPassword('');
    if (pairing.isConnected()) {
      pairing.sendScanWifi();
      setIsLoading(true);
    } else {
      pairing
        .startPairing(IP_ADDRESS, PORT)
        .then(success => {
          if (success) {
            pairing.sendScanWifi();
            setIsLoading(true);
          }
        })
        .catch(() => {
          setModalErrorText(t('Cannot reconnect to device'));
          setShowErrorModal(true);
        });
    }
  }, [pairing, t]);

  const handleSendCredentials = useCallback(() => {
    if (!selectedSsid) {
      setModalErrorText(t('Please select a Wi-Fi network'));
      setShowErrorModal(true);
      return;
    }
    if (!pairing.isConnected()) {
      setModalErrorText(t('Connection lost. Please try scanning again.'));
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);
    pairing.sendWifiCredentials(selectedSsid, password.trim());
  }, [selectedSsid, password, pairing, t]);

  const renderWifiItem = ({ item }: { item: WifiNetwork }) => {
    const isSelected = item.ssid === selectedSsid;

    return (
      <TouchableOpacity
        style={[
          styles.wifiItem,
          {
            backgroundColor: isSelected
              ? `${colors.primary}15`
              : colors.surface,
            borderColor: isSelected ? colors.primary : colors.divider,
          },
        ]}
        onPress={() => setSelectedSsid(item.ssid)}
        activeOpacity={1}
      >
        <CustomText
          style={{
            color:
              colors.textPrimary ||
              (Appearance.getColorScheme() === 'dark' ? '#ffffff' : '#000000'),
            fontSize: typography.fontSize.base,
            flex: 1,
          }}
          weight={isSelected ? 'bold' : 'regular'}
        >
          {item.ssid}
        </CustomText>

        <CustomText
          style={{
            color:
              colors.textSecondary ||
              (Appearance.getColorScheme() === 'dark' ? '#ffffff' : '#000000'),
            fontSize: typography.fontSize.sm,
          }}
        >
          {item.security || 'Open'} • {item.rssi ? `${item.rssi} dBm` : ''}
        </CustomText>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.screen,
        { backgroundColor: colors.background || '#ffffff' },
      ]}
    >
      <View
        style={[
          styles.container,
          { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <CustomText
            style={{
              color:
                colors.textPrimary ||
                (Appearance.getColorScheme() === 'dark'
                  ? '#ffffff'
                  : '#000000'),
              fontSize: typography.fontSize.xxxl,
              textAlign: 'center',
            }}
            weight="bold"
          >
            {t('Connect new device')}
          </CustomText>
          <CustomText
            style={{
              color: colors.textSecondary,
              fontSize: typography.fontSize.base,
              marginTop: spacing.sm,
              textAlign: 'center',
            }}
          >
            {t('Select Wi-Fi network and enter password to configure device')}
          </CustomText>
        </View>

        {isLoading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <CustomText
              style={{ color: colors.textSecondary, marginTop: spacing.md }}
            >
              {t('Scanning...')}
            </CustomText>
          </View>
        )}

        {!isLoading && storeError && (
          <View style={[styles.errorBanner, { borderColor: colors.error }]}>
            <CustomText style={{ color: colors.error }}>
              {storeError}
            </CustomText>
          </View>
        )}

        {!isLoading && (
          <>
            {status === 'connected' && wifiList.length === 0 && (
              <View style={styles.emptyState}>
                <CustomText
                  style={{
                    color:
                      colors.textPrimary ||
                      (Appearance.getColorScheme() === 'dark'
                        ? '#ffffff'
                        : '#000000'),
                    fontSize: typography.fontSize.xl,
                  }}
                  weight="bold"
                >
                  {t('Device connected – ready to scan')}
                </CustomText>
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleRetryScan}
                >
                  <CustomText style={{ color: '#ffffff' }} weight="bold">
                    {t('Scan Wi-Fi networks')}
                  </CustomText>
                </TouchableOpacity>
              </View>
            )}

            {wifiList.length > 0 && (
              <>
                <CustomText
                  style={{
                    color:
                      colors.textPrimary ||
                      (Appearance.getColorScheme() === 'dark'
                        ? '#ffffff'
                        : '#000000'),
                    fontSize: typography.fontSize.xl,
                    marginVertical: spacing.md,
                  }}
                  weight="bold"
                >
                  {t('Available networks')}
                </CustomText>

                <FlatList
                  data={wifiList}
                  renderItem={renderWifiItem}
                  keyExtractor={item => item.ssid}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: spacing.xl }}
                />

                {selectedSsid && (
                  <View
                    style={[
                      styles.credentialsBox,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <CustomText
                      style={{
                        color:
                          colors.textPrimary ||
                          (Appearance.getColorScheme() === 'dark'
                            ? '#ffffff'
                            : '#000000'),
                        fontSize: typography.fontSize.lg,
                        marginBottom: spacing.sm,
                      }}
                      weight="bold"
                    >
                      {t('Password for')} "{selectedSsid}"
                    </CustomText>

                    <TextInput
                      style={[
                        styles.input,
                        {
                          borderColor: colors.divider,
                          color: colors.textPrimary,
                          backgroundColor: colors.background,
                        },
                      ]}
                      value={password}
                      onChangeText={setPassword}
                      placeholder={t('Enter password')}
                      placeholderTextColor={`${colors.textSecondary}80`}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                    />

                    <TouchableOpacity
                      style={[
                        styles.primaryButton,
                        {
                          backgroundColor: colors.primary,
                          marginTop: spacing.md,
                        },
                      ]}
                      onPress={handleSendCredentials}
                    >
                      <CustomText style={{ color: '#ffffff' }} weight="bold">
                        {t('Connect device')}
                      </CustomText>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}

            <CustomText
              style={{
                color: colors.textSecondary,
                textAlign: 'center',
                marginTop: spacing.xl,
                fontSize: typography.fontSize.sm,
              }}
            >
              Status: {status}
            </CustomText>
          </>
        )}
      </View>

      {/* Modals */}
      <AlertModal
        alertVisible={showNoWifiModal}
        setAlertVisible={setShowNoWifiModal}
        message={t(
          'No Wi-Fi networks were detected. Make sure the device is in pairing mode.',
        )}
        onConfirm={() => {
          setShowNoWifiModal(false);
          handleRetryScan();
        }}
        confirmText={t('Retry Scan')}
      />

      <AlertModal
        alertVisible={showSuccessModal}
        setAlertVisible={setShowSuccessModal}
        message={t('Device configured successfully!')}
        onConfirm={() => {
          setShowSuccessModal(false);
          navigation.navigate('MainTab', { screen: Routes.HomeScreen });
        }}
        confirmText={t('Done')}
      />

      <AlertModal
        alertVisible={showErrorModal}
        setAlertVisible={setShowErrorModal}
        title={t('Error')}
        message={modalErrorText || t('An unknown error occurred')}
        onConfirm={() => setShowErrorModal(false)}
        confirmText={t('OK')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1 },
  header: { alignItems: 'center', marginBottom: 32 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorBanner: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  credentialsBox: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  wifiItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
