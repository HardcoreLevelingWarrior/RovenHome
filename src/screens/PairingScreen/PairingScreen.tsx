// src/screens/PairingScreen.tsx
// src/screens/PairingScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/themeContext';
import { useTranslation } from 'react-i18next';
import CustomText from '../../components/customText';
import PairingService, {
  WifiNetwork,
  PairingStatus,
  DeviceInfo,
} from '../../services/pairing/PairingService';
import AlertModal from './components/AlertModal'; // مسیر AlertModal خودت رو درست کن

const IP_ADDRESS = '192.168.4.1';
const PORT = 5000;

export default function PairingScreen() {
  const { theme } = useTheme();
  const { colors, typography } = theme;
  const { t } = useTranslation();

  const [status, setStatus] = useState<PairingStatus>('idle');
  const [wifiList, setWifiList] = useState<WifiNetwork[]>([]);
  const [selectedSsid, setSelectedSsid] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // برای مدیریت مودال‌ها
  const [showNoWifiModal, setShowNoWifiModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorText, setModalErrorText] = useState('');

  // const pairing = PairingService.getInstance();

  // ─── Lifecycle ───────────────────────────────────────────────
  // useEffect(() => {
  //   let isMounted = true;

  //   const initialize = async () => {
  //     if (!isMounted) return;
  //     setIsLoading(true);
  //     setErrorMessage(null);

  //     try {
  //       const connected = await pairing.startPairing(IP_ADDRESS, PORT);
  //       if (connected && isMounted) {
  //         // خودکار اسکن کنیم بعد از اتصال موفق
  //         pairing.sendScanWifi();
  //         setIsLoading(true); // منتظر لیست وای‌فای
  //       }
  //     } catch (err: any) {
  //       const msg = err?.message || t('Failed to connect to device');
  //       if (isMounted) {
  //         setErrorMessage(msg);
  //         setModalErrorText(msg);
  //         setShowErrorModal(true);
  //       }
  //     } finally {
  //       if (isMounted) setIsLoading(false);
  //     }
  //   };

  //   initialize();

    // Listenerها
    const subscriptions = [
      pairing.addListener('statusChanged', (newStatus: PairingStatus) => {
        if (isMounted) setStatus(newStatus);
      }),
      pairing.addListener('wifiListReceived', (list: WifiNetwork[]) => {
        if (isMounted) {
          setWifiList(list);
          setIsLoading(false);
          if (list.length === 0) {
            setShowNoWifiModal(true);
          }
        }
      }),
      pairing.addListener('pairingSuccess', (device: DeviceInfo) => {
        if (isMounted) {
          setShowSuccessModal(true);
          // اینجا می‌تونی navigation به صفحه اصلی یا devices بذاری
          // مثلاً: navigation.navigate('Devices');
        }
      }),
      pairing.addListener('pairingError', (msg: string) => {
        if (isMounted) {
          setErrorMessage(msg);
          setModalErrorText(msg);
          setShowErrorModal(true);
          setIsLoading(false);
        }
      }),
    ];

    // Cleanup مهم
    return () => {
      isMounted = false;
      subscriptions.forEach(sub => sub.remove());
      pairing.removeAllListeners();
      pairing.disconnect();
    };
  }, []); // فقط یک بار موقع mount

  // ─── Handlers ────────────────────────────────────────────────
  const handleRetryScan = useCallback(() => {
    setErrorMessage(null);
    setWifiList([]);
    setSelectedSsid(null);
    setPassword('');
    if (pairing.isConnected()) {
      pairing.sendScanWifi();
      setIsLoading(true);
    } else {
      // اگر اتصال قطع شده، دوباره شروع کنیم
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
  }, []);

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
    const success = pairing.sendWifiCredentials(selectedSsid, password.trim());
    if (!success) {
      setIsLoading(false);
    }
  }, [selectedSsid, password, pairing]);

  const resetForm = useCallback(() => {
    setWifiList([]);
    setSelectedSsid(null);
    setPassword('');
    setErrorMessage(null);
    setIsLoading(false);
  }, []);

  // ─── Render Item ─────────────────────────────────────────────
  const renderWifiItem = ({ item }: { item: WifiNetwork }) => (
    <TouchableOpacity
      style={[
        styles.wifiRow,
        // { borderColor: colors.border },
        item.ssid === selectedSsid && {
          backgroundColor: colors.primary + '1A',
        },
      ]}
      onPress={() => setSelectedSsid(item.ssid)}
    >
      <CustomText style={[styles.ssidText, { color: colors.textPrimary }]}>
        {item.ssid}
        {item.rssi !== undefined && `  (${item.rssi} dBm)`}
        {'  •  '}
        {item.security}
      </CustomText>
    </TouchableOpacity>
  );

  // ─── UI ──────────────────────────────────────────────────────
  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <View style={[styles.container, { padding: 24 }]}>
        <CustomText
          style={[
            styles.title,
            { color: colors.textPrimary, fontSize: typography.fontSize.xxl },
          ]}
          weight="bold"
        >
          {t('Connect new device')}
        </CustomText>

        {/* دکمه اسکن وقتی متصل هستیم و هنوز لیست نداریم */}
        {status === 'connected' && wifiList.length === 0 && !isLoading && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleRetryScan}
            disabled={isLoading}
          >
            <CustomText style={{ color: colors.textPrimary }} weight="bold">
              {t('Scan Wi-Fi networks')}
            </CustomText>
          </TouchableOpacity>
        )}

        {/* لیست شبکه‌ها */}
        {wifiList.length > 0 && (
          <>
            <CustomText
              style={[styles.sectionTitle, { color: colors.textPrimary }]}
              weight="bold"
            >
              {t('Available networks')}:
            </CustomText>

            <FlatList
              data={wifiList}
              renderItem={renderWifiItem}
              keyExtractor={item => item.ssid}
              style={styles.list}
              ListEmptyComponent={
                <CustomText
                  style={{
                    color: colors.textSecondary,
                    textAlign: 'center',
                    marginTop: 20,
                  }}
                >
                  {t('No networks found')}
                </CustomText>
              }
            />

            {selectedSsid && (
              <>
                <CustomText
                  style={[
                    styles.label,
                    { color: colors.textSecondary, marginTop: 24 },
                  ]}
                >
                  {t('Password for')} "{selectedSsid}":
                </CustomText>

                <TextInput
                  style={[
                    styles.input,
                    {
                      // borderColor: colors.border,
                      // backgroundColor: colors.card,
                      // color: colors.textPrimary,
                    },
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t('Enter password (optional for open networks)')}
                  placeholderTextColor={colors.textSecondary + '80'}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleSendCredentials}
                  disabled={isLoading}
                >
                  <CustomText
                    style={{ color: colors.textPrimary }}
                    weight="bold"
                  >
                    {t('Connect device to Wi-Fi')}
                  </CustomText>
                </TouchableOpacity>
              </>
            )}
          </>
        )}

        {isLoading && (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        )}

        <CustomText
          style={[styles.statusText, { color: colors.textSecondary }]}
        >
          {t('Status')}: {status}
        </CustomText>

        {errorMessage && (
          <CustomText style={[styles.errorText, { color: colors.error }]}>
            {t('Error')}: {errorMessage}
          </CustomText>
        )}
      </View>

      {/* مودال‌ها */}
      <AlertModal
        alertVisible={showNoWifiModal}
        setAlertVisible={setShowNoWifiModal}
        // title={t('No networks found')}
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
        // title={t('Success')}
        message={t('Device configured successfully!')}
        onConfirm={() => {
          setShowSuccessModal(false);
          resetForm();
          // navigation.navigate('...') ← اینجا بذار اگر نیاز داری
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
  title: { textAlign: 'center', marginBottom: 32 },
  sectionTitle: { marginTop: 8, marginBottom: 12, fontSize: 18 },
  label: { marginBottom: 8, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 24,
  },
  list: { maxHeight: 360, marginBottom: 16 },
  wifiRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  ssidText: { fontSize: 16 },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 12,
  },
  loader: { marginVertical: 48 },
  statusText: { marginTop: 32, textAlign: 'center', fontSize: 15 },
  errorText: { marginTop: 12, textAlign: 'center', fontSize: 15 },
});

