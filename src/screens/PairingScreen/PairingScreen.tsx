// PairingScreen.tsx;
// PairingScreen.tsx;
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/themeContext';
import { useTranslation } from 'react-i18next';
import CustomText from '../../components/customText';
import PairingService from '../../services/pairing/PairingService';
import AlertModal from './components/AlertModal';
import { useApplicationStore } from '../../stores/ApplicationStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Routes } from '../../navigation/Routes';
import { Devices } from '../../constant/devices';

export default function PairingScreen() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const device = route.params?.device as Devices;

  const { wifiList, status, error, setError } = useApplicationStore();
  const [selectedSsid, setSelectedSsid] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // State برای modal پسورد
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const pairing = PairingService.getInstance();

  // بررسی وضعیت اتصال هنگام ورود
  useEffect(() => {
    let isMounted = true;

    const checkAndScan = async () => {
      if (pairing.isConnected()) {
        setIsLoading(true);
        pairing.sendScanWifi();
      } else {
        setError(t('Connection lost. Please try again.'));
        setShowErrorModal(true);
        setIsLoading(false);
      }
    };

    checkAndScan();

    return () => {
      isMounted = false;
    };
  }, []);

  // وقتی wifiList اومد، لودینگ رو بردار
  useEffect(() => {
    if (wifiList.length > 0) {
      setIsLoading(false);
    }
  }, [wifiList]);

  // وقتی خطایی توی store ثبت شد
  useEffect(() => {
    if (error) {
      setShowErrorModal(true);
      setIsLoading(false);
    }
  }, [error]);

  // وقتی وضعیت success شد
  useEffect(() => {
    if (status === 'success') {
      setShowSuccessModal(true);
    }
  }, [status]);

  const handleScanAgain = () => {
    setSelectedSsid(null);
    setPassword('');
    setIsLoading(true);
    pairing.sendScanWifi();
  };

  const handleSelectNetwork = (ssid: string) => {
    setSelectedSsid(ssid);
    setPassword('');
    setShowPasswordModal(true); // باز کردن مودال پسورد
  };

  const handleSendCredentials = () => {
    if (!password) {
      setError(t('pairing_screen.please_enter_wi-Fi_password'));
      setShowErrorModal(true);
      return;
    }

    setShowPasswordModal(false);
    setIsLoading(true);
    pairing.sendWifiCredentials(selectedSsid!, password);
  };

  const renderWifiItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.wifiItem,
        {
          backgroundColor:
            selectedSsid === item.ssid ? `${colors.primary}20` : colors.surface,
          borderColor:
            selectedSsid === item.ssid ? colors.primary : colors.divider,
        },
      ]}
      onPress={() => handleSelectNetwork(item.ssid)}
    >
      <CustomText
        style={{ color: colors.textPrimary, flex: 1 }}
        weight={selectedSsid === item.ssid ? 'bold' : 'regular'}
      >
        {item.ssid}
      </CustomText>
      {selectedSsid === item.ssid && (
        <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
          <CustomText style={{ color: '#fff' }}>✓</CustomText>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <View style={[styles.container, { padding: spacing.lg }]}>
        {/* Header */}
        <View style={styles.header}>
          <CustomText
            style={[styles.title, { color: colors.textPrimary }]}
            weight="bold"
          >
            {t('pairing_screen.connect')}{' '}
            {device?.name ? t(`device.${[device.name]}`) : t('device')}
          </CustomText>
          <CustomText
            style={[styles.subtitle, { color: colors.textSecondary }]}
          >
            {t('pairing_screen.select_your_wi-Fi_network')}
          </CustomText>
        </View>

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                status === 'connected'
                  ? `${colors.success || '#4CAF50'}20`
                  : status === 'failed'
                  ? `${colors.error || '#F44336'}20`
                  : `${colors.textSecondary}20`,
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  status === 'connected'
                    ? colors.success || '#4CAF50'
                    : status === 'failed'
                    ? colors.error || '#F44336'
                    : colors.textSecondary,
              },
            ]}
          />
          <CustomText
            style={[
              styles.statusText,
              {
                color:
                  status === 'connected'
                    ? colors.success || '#4CAF50'
                    : status === 'failed'
                    ? colors.error || '#F44336'
                    : colors.textSecondary,
              },
            ]}
          >
            {status === 'connected'
              ? t('pairing_screen.connected_to_device')
              : status === 'scanning'
              ? t('pairing_screen.scanning')
              : status === 'sendingCredentials'
              ? t('pairing_screen.sending_credentials')
              : status === 'failed'
              ? t('pairing_screen.connection_failed')
              : t('Ready')}
          </CustomText>
        </View>

        {/* Wifi List */}
        {!isLoading && (
          <>
            <View style={styles.wifiHeader}>
              <CustomText
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
                weight="bold"
              >
                {t('pairing_screen.available_networks')}
              </CustomText>
              <TouchableOpacity onPress={handleScanAgain}>
                <CustomText style={{ color: colors.primary }}>
                  {t('pairing_screen.refresh')}
                </CustomText>
              </TouchableOpacity>
            </View>

            <FlatList
              data={wifiList}
              renderItem={renderWifiItem}
              keyExtractor={item => item.ssid}
              contentContainerStyle={styles.wifiList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <CustomText
                    style={{ color: colors.textSecondary, textAlign: 'center' }}
                  >
                    {t('pairing_screen.no_wiFi_networks_found')}
                  </CustomText>
                  <TouchableOpacity
                    style={[
                      styles.scanButton,
                      {
                        backgroundColor: colors.primary,
                        marginTop: spacing.md,
                      },
                    ]}
                    onPress={handleScanAgain}
                  >
                    <CustomText style={{ color: '#fff' }} weight="bold">
                      {t('pairing_screen.scan_for_networks')}
                    </CustomText>
                  </TouchableOpacity>
                </View>
              }
            />
          </>
        )}

        {/* Loading */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <CustomText
              style={{ color: colors.textSecondary, marginTop: spacing.md }}
            >
              {status === 'scanning'
                ? t('pairing_screen.scanning_for_networks')
                : status === 'sendingCredentials'
                ? t('pairing_screen.sending_credentials')
                : t('pairing_screen.please_wait')}
            </CustomText>
          </View>
        )}
      </View>

      {/* Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={[
                styles.modalOverlay,
                { backgroundColor: 'rgba(0,0,0,0.5)' },
              ]}
            >
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: colors.surface || colors.background },
                ]}
              >
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <CustomText
                    style={[styles.modalTitle, { color: colors.textPrimary }]}
                    weight="bold"
                  >
                    {t('pairing_screen.wifi_password')}
                  </CustomText>
                  <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                    <CustomText
                      style={{ color: colors.textSecondary, fontSize: 20 }}
                    >
                      ✕
                    </CustomText>
                  </TouchableOpacity>
                </View>

                {/* Network Name */}
                <View
                  style={[
                    styles.networkInfo,
                    {
                      backgroundColor: `${colors.primary}10`,
                      borderColor: colors.divider,
                    },
                  ]}
                >
                  <CustomText style={{ color: colors.textSecondary }}>
                    {t('pairing_screen.network')}:
                  </CustomText>
                  <CustomText
                    style={[styles.networkName, { color: colors.primary }]}
                    weight="bold"
                  >
                    {selectedSsid}
                  </CustomText>
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <CustomText
                    style={{ color: colors.textSecondary, marginBottom: 8 }}
                  >
                    {t('pairing_screen.password')}
                  </CustomText>
                  <View
                    style={[
                      styles.passwordWrapper,
                      {
                        borderColor: colors.divider,
                        backgroundColor: colors.background,
                      },
                    ]}
                  >
                    <TextInput
                      style={[
                        styles.passwordInput,
                        { color: colors.textPrimary },
                      ]}
                      value={password}
                      onChangeText={setPassword}
                      placeholder={t('pairing_screen.enter_password')}
                      placeholderTextColor={colors.textSecondary}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoFocus={true}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      <CustomText style={{ color: colors.primary }}>
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </CustomText>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Buttons */}
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      styles.cancelButton,
                      { borderColor: colors.divider },
                    ]}
                    onPress={() => setShowPasswordModal(false)}
                  >
                    <CustomText style={{ color: colors.textSecondary }}>
                      {t('pairing_screen.cancel')}
                    </CustomText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      styles.confirmButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={handleSendCredentials}
                  >
                    <CustomText style={{ color: '#fff' }} weight="bold">
                      {t('pairing_screen.connect')}
                    </CustomText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Error Modal */}
      <AlertModal
        alertVisible={showErrorModal}
        setAlertVisible={setShowErrorModal}
        message={error || t('pairing_screen.connection_failed')}
        onConfirm={() => {
          setShowErrorModal(false);
          setError(null);
          if (!pairing.isConnected()) {
            navigation.goBack();
          }
        }}
        confirmText={t('pairing_screen.ok')}
      />

      {/* Success Modal */}
      <AlertModal
        alertVisible={showSuccessModal}
        setAlertVisible={setShowSuccessModal}
        message={t('device_connected_successfully')}
        onConfirm={() => {
          setShowSuccessModal(false);
          navigation.navigate('MainTab', { screen: Routes.HomeScreen });
        }}
        confirmText={t('done')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1 },
  header: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center' },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  wifiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18 },
  wifiList: { paddingBottom: 20 },
  wifiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  scanButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
  },
  networkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  networkName: {
    fontSize: 16,
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 24,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  eyeButton: {
    padding: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    marginLeft: 12,
  },
});
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useTheme } from '../../context/themeContext';
// import { useTranslation } from 'react-i18next';
// import CustomText from '../../components/customText';
// import PairingService from '../../services/pairing/PairingService';
// import AlertModal from './components/AlertModal';
// import { useApplicationStore } from '../../stores/ApplicationStore';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { Routes } from '../../navigation/Routes';
// import { Devices } from '../../constant/devices';

// export default function PairingScreen() {
//   const { theme } = useTheme();
//   const { colors, spacing, typography } = theme;
//   const { t } = useTranslation();
//   const navigation = useNavigation<any>();
//   const route = useRoute<any>();
//   const device = route.params?.device as Devices;

//   const { wifiList, status, error, setError } = useApplicationStore();
//   const [selectedSsid, setSelectedSsid] = useState<string | null>(null);
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);

//   const pairing = PairingService.getInstance();

//   // بررسی وضعیت اتصال هنگام ورود
//   useEffect(() => {
//     let isMounted = true;

//     const checkAndScan = async () => {
//       // بررسی کن ببین قبلاً وصل شدیم یا نه
//       if (pairing.isConnected()) {
//         // قبلاً وصل بودیم، فقط اسکن کن
//         setIsLoading(true);
//         pairing.sendScanWifi();
//       } else {
//         // اگه وصل نبودیم، خطا بده و برگرد به صفحه قبل
//         setError(t('Connection lost. Please try again.'));
//         setShowErrorModal(true);
//         setIsLoading(false);
//       }
//     };

//     checkAndScan();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // وقتی wifiList اومد، لودینگ رو بردار
//   useEffect(() => {
//     if (wifiList.length > 0) {
//       setIsLoading(false);
//     }
//   }, [wifiList]);

//   // وقتی خطایی توی store ثبت شد
//   useEffect(() => {
//     if (error) {
//       setShowErrorModal(true);
//       setIsLoading(false);
//     }
//   }, [error]);

//   // وقتی وضعیت success شد
//   useEffect(() => {
//     if (status === 'success') {
//       setShowSuccessModal(true);
//     }
//   }, [status]);

//   const handleScanAgain = () => {
//     setSelectedSsid(null);
//     setPassword('');
//     setIsLoading(true);
//     pairing.sendScanWifi();
//   };

//   const handleConnectDevice = () => {
//     if (!selectedSsid) {
//       setError(t('Please select a Wi-Fi network'));
//       setShowErrorModal(true);
//       return;
//     }

//     if (!password) {
//       setError(t('Please enter Wi-Fi password'));
//       setShowErrorModal(true);
//       return;
//     }

//     setIsLoading(true);
//     pairing.sendWifiCredentials(selectedSsid, password);
//   };

//   const renderWifiItem = ({ item }: { item: any }) => (
//     <TouchableOpacity
//       style={[
//         styles.wifiItem,
//         {
//           backgroundColor:
//             selectedSsid === item.ssid ? `${colors.primary}20` : colors.surface,
//           borderColor:
//             selectedSsid === item.ssid ? colors.primary : colors.divider,
//         },
//       ]}
//       onPress={() => setSelectedSsid(item.ssid)}
//     >
//       <CustomText
//         style={{ color: colors.textPrimary, flex: 1 }}
//         weight={selectedSsid === item.ssid ? 'bold' : 'regular'}
//       >
//         {item.ssid}
//       </CustomText>
//       {selectedSsid === item.ssid && (
//         <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
//           <CustomText style={{ color: '#fff' }}>✓</CustomText>
//         </View>
//       )}
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView
//       style={[styles.screen, { backgroundColor: colors.background }]}
//     >
//       <View style={[styles.container, { padding: spacing.lg }]}>
//         {/* Header */}
//         <View style={styles.header}>
//           <CustomText
//             style={[styles.title, { color: colors.textPrimary }]}
//             weight="bold"
//           >
//             {t('Connect')} {device?.name ? t(device.name) : t('Device')}
//           </CustomText>
//           <CustomText
//             style={[styles.subtitle, { color: colors.textSecondary }]}
//           >
//             {t('Select your Wi-Fi network')}
//           </CustomText>
//         </View>

//         {/* Status Badge */}
//         <View
//           style={[
//             styles.statusBadge,
//             {
//               backgroundColor:
//                 status === 'connected'
//                   ? `${colors.success || '#4CAF50'}20`
//                   : status === 'failed'
//                   ? `${colors.error || '#F44336'}20`
//                   : `${colors.textSecondary}20`,
//             },
//           ]}
//         >
//           <View
//             style={[
//               styles.statusDot,
//               {
//                 backgroundColor:
//                   status === 'connected'
//                     ? colors.success || '#4CAF50'
//                     : status === 'failed'
//                     ? colors.error || '#F44336'
//                     : colors.textSecondary,
//               },
//             ]}
//           />
//           <CustomText
//             style={[
//               styles.statusText,
//               {
//                 color:
//                   status === 'connected'
//                     ? colors.success || '#4CAF50'
//                     : status === 'failed'
//                     ? colors.error || '#F44336'
//                     : colors.textSecondary,
//               },
//             ]}
//           >
//             {status === 'connected'
//               ? t('Connected to device')
//               : status === 'scanning'
//               ? t('Scanning...')
//               : status === 'sendingCredentials'
//               ? t('Sending credentials...')
//               : status === 'failed'
//               ? t('Connection failed')
//               : t('Ready')}
//           </CustomText>
//         </View>

//         {/* Wifi List */}
//         {!isLoading && (
//           <>
//             <View style={styles.wifiHeader}>
//               <CustomText
//                 style={[styles.sectionTitle, { color: colors.textPrimary }]}
//                 weight="bold"
//               >
//                 {t('Available Networks')}
//               </CustomText>
//               <TouchableOpacity onPress={handleScanAgain}>
//                 <CustomText style={{ color: colors.primary }}>
//                   {t('Refresh')}
//                 </CustomText>
//               </TouchableOpacity>
//             </View>

//             <FlatList
//               data={wifiList}
//               renderItem={renderWifiItem}
//               keyExtractor={item => item.ssid}
//               contentContainerStyle={styles.wifiList}
//               showsVerticalScrollIndicator={false}
//               ListEmptyComponent={
//                 <View style={styles.emptyState}>
//                   <CustomText
//                     style={{ color: colors.textSecondary, textAlign: 'center' }}
//                   >
//                     {t('No Wi-Fi networks found')}
//                   </CustomText>
//                   <TouchableOpacity
//                     style={[
//                       styles.scanButton,
//                       {
//                         backgroundColor: colors.primary,
//                         marginTop: spacing.md,
//                       },
//                     ]}
//                     onPress={handleScanAgain}
//                   >
//                     <CustomText style={{ color: '#fff' }} weight="bold">
//                       {t('Scan for Networks')}
//                     </CustomText>
//                   </TouchableOpacity>
//                 </View>
//               }
//             />
//           </>
//         )}

//         {/* Loading */}
//         {isLoading && (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color={colors.primary} />
//             <CustomText
//               style={{ color: colors.textSecondary, marginTop: spacing.md }}
//             >
//               {status === 'scanning'
//                 ? t('Scanning for networks...')
//                 : status === 'sendingCredentials'
//                 ? t('Sending credentials...')
//                 : t('Please wait...')}
//             </CustomText>
//           </View>
//         )}

//         {/* Password Input */}
//         {selectedSsid && !isLoading && (
//           <View
//             style={[
//               styles.passwordBox,
//               { backgroundColor: colors.surface, borderColor: colors.divider },
//             ]}
//           >
//             <CustomText
//               style={{ color: colors.textPrimary, marginBottom: spacing.sm }}
//               weight="bold"
//             >
//               {t('Password for')} "{selectedSsid}"
//             </CustomText>
//             <TextInput
//               style={[
//                 styles.input,
//                 {
//                   borderColor: colors.divider,
//                   color: colors.textPrimary,
//                   backgroundColor: colors.background,
//                 },
//               ]}
//               value={password}
//               onChangeText={setPassword}
//               placeholder={t('Enter password')}
//               placeholderTextColor={colors.textSecondary}
//               secureTextEntry
//               autoCapitalize="none"
//               autoCorrect={false}
//             />
//             <TouchableOpacity
//               style={[styles.button, { backgroundColor: colors.primary }]}
//               onPress={handleConnectDevice}
//             >
//               <CustomText style={{ color: '#fff' }} weight="bold">
//                 {t('Connect Device')}
//               </CustomText>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       {/* Error Modal */}
//       <AlertModal
//         alertVisible={showErrorModal}
//         setAlertVisible={setShowErrorModal}
//         message={error || t('Connection failed')}
//         onConfirm={() => {
//           setShowErrorModal(false);
//           setError(null);
//           // اگه خطا مربوط به قطع اتصال بود، برگرد به صفحه قبل
//           if (!pairing.isConnected()) {
//             navigation.goBack();
//           }
//         }}
//         confirmText={t('OK')}
//       />

//       {/* Success Modal */}
//       <AlertModal
//         alertVisible={showSuccessModal}
//         setAlertVisible={setShowSuccessModal}
//         message={t('Device connected successfully!')}
//         onConfirm={() => {
//           setShowSuccessModal(false);
//           navigation.navigate('MainTab', { screen: Routes.HomeScreen });
//         }}
//         confirmText={t('Done')}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1 },
//   container: { flex: 1 },
//   header: { alignItems: 'center', marginBottom: 24 },
//   title: { fontSize: 28, textAlign: 'center', marginBottom: 8 },
//   subtitle: { fontSize: 14, textAlign: 'center' },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     marginBottom: 24,
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: 8,
//   },
//   statusText: {
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   wifiHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: { fontSize: 18 },
//   wifiList: { paddingBottom: 20 },
//   wifiItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     borderWidth: 1,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   checkmark: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   passwordBox: {
//     marginTop: 24,
//     padding: 20,
//     borderRadius: 16,
//     borderWidth: 1,
//   },
//   input: {
//     borderWidth: 1,
//     borderRadius: 12,
//     padding: 14,
//     fontSize: 16,
//     marginBottom: 16,
//   },
//   button: {
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 60,
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 60,
//   },
//   scanButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 12,
//   },
// });
