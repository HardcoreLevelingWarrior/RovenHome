// // SetupGuideScreen - نسخه نهایی (فقط راهنما)
// SetupGuideScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/themeContext';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RouteProps';
import CustomText from '../../components/customText';
import { Devices } from '../../constant/devices';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Routes } from '../../navigation/Routes';
import PairingService from '../../services/pairing/PairingService';
import AlertModal from '../PairingScreen/components/AlertModal';
import { TextWithImage } from '../../components/TextWithImage';

type SetupGuideRouteProp = RouteProp<RootStackParamList, 'SetupGuideScreen'>;

// آیپی دستگاه در حالت اکسس پوینت
const DEVICE_AP_IP = '192.168.4.1';
const DEVICE_PORT = 5000;

export default function SetupGuideScreen() {
  const { theme } = useTheme();
  const { colors, typography } = theme;
  const { t } = useTranslation();
  const route = useRoute<SetupGuideRouteProp>();
  const navigation = useNavigation<any>();

  const device = route.params?.device as Devices | undefined;

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const pairing = PairingService.getInstance();

  // const handleConnect = async () => {
  //   if (!device) return;

  //   // ریست کامل قبل از هر تلاش جدید
  //   pairing.disconnect(); // ← اضافه کن

  //   setIsConnecting(true);
  //   setConnectionError(null);

  //   try {
  //     // اتصال به دستگاه
  //     const connected = await pairing.startPairing(DEVICE_AP_IP, DEVICE_PORT);

  //     if (connected) {
  //       // اگه اتصال موفق بود، برو به صفحه بعد
  //       navigation.navigate(Routes.PairingScreen, { device });
  //     } else {
  //       throw new Error(t('setup_guide_screen.failed_to_connect_to_device'));
  //     }
  //   } catch (error: any) {
  //     // اگه اتصال ناموفق بود، خطا نشون بده و توهمین صفحه بمون
  //     const errorMsg = error?.message || t('Cannot connect to device');
  //     setConnectionError(errorMsg);
  //     setShowErrorModal(true);
  //   } finally {
  //     setIsConnecting(false);
  //   }
  // };

  const handleConnect = async () => {
    if (!device) return;

    setIsConnecting(true);
    setConnectionError(null);

    try {
      // همیشه قبل از اتصال جدید، سرویس رو کامل ریست کن
      pairing.disconnect();

      const connected = await pairing.startPairing(DEVICE_AP_IP, DEVICE_PORT);

      if (connected) {
        navigation.navigate(Routes.PairingScreen, { device });
      } else {
        throw new Error(t('setup_guide_screen.failed_to_connect_to_device'));
      }
    } catch (error: any) {
      const errorMsg = error?.message || t('Cannot connect to device');
      console.error('Connection failed:', errorMsg); // برای دیباگ
      setConnectionError(errorMsg);
      setShowErrorModal(true);
    } finally {
      setIsConnecting(false);
    }
  };

  // فیلتر کردن steps های undefined
  const validSteps =
    device?.setupGuide?.filter(step => step !== undefined && step !== null) ||
    [];

  if (!device) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <CustomText style={{ color: colors.error, fontSize: 18 }} weight="bold">
          {t('No device selected')}
        </CustomText>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CustomText
          style={[
            styles.screenHeader,
            { fontSize: typography.fontSize.xxl, color: colors.textPrimary },
          ]}
          weight="bold"
        >
          {t('setup_guide_screen.setup_guide_for')}{' '}
          {t(`device.${[device.name]}`)}
        </CustomText>

        <CustomText
          style={[styles.subtitle, { color: colors.textSecondary }]}
          weight="regular"
        >
          {t('model')}: {device.model} • {device.connectionType.toUpperCase()}
        </CustomText>

        {validSteps.length > 0 ? (
          validSteps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              {/* <View
                style={[
                  styles.stepNumberContainer,
                  { backgroundColor: colors.primary },
                ]}
              >
                <CustomText style={styles.stepNumber} weight="bold">
                  {index + 1}
                </CustomText>
              </View> */}

              <View style={styles.stepContent}>
                {/* <Image
                  source={require('../../assets/icons/exclamationMark.png')}
                  style={[
                    styles.stepIcon,
                    { tintColor: colors.warning || '#FF9500' },
                  ]}
                />
                <CustomText
                  style={[styles.stepText, { color: colors.textPrimary }]}
                >
                  {t(`setup_guide_screen.${[step]}`)}
                </CustomText> */}
                <TextWithImage
                  imageSource={require('../../assets/icons/exclamationMark.png')}
                  text={t(`setup_guide_screen.${[step]}`)}
                ></TextWithImage>
              </View>
            </View>
          ))
        ) : (
          <CustomText
            style={[styles.noGuideText, { color: colors.textSecondary }]}
          >
            {t('No setup guide available for this device')}
          </CustomText>
        )}
      </ScrollView>

      {/* دکمه اتصال */}
      <TouchableOpacity
        style={[styles.connectBtn, { backgroundColor: colors.primary }]}
        onPress={handleConnect}
        disabled={isConnecting}
        activeOpacity={0.8}
      >
        {isConnecting ? (
          <>
            <ActivityIndicator
              color={colors.textPrimary || '#fff'}
              size="small"
            />
            <CustomText
              style={{ color: colors.textPrimary, marginLeft: 10 }}
              weight="bold"
            >
              {t('Connecting...')}
            </CustomText>
          </>
        ) : (
          <CustomText
            style={{ color: colors.textPrimary, fontWeight: '600' }}
            weight="bold"
          >
            {t('setup_guide_screen.connect_to_device')}
          </CustomText>
        )}
      </TouchableOpacity>

      {/* خطا مودال */}
      <AlertModal
        alertVisible={showErrorModal}
        setAlertVisible={setShowErrorModal}
        message={`${t('Connection Failed')}: ${
          connectionError || t('Unknown error')
        }`}
        onConfirm={() => {
          setShowErrorModal(false);
          setConnectionError(null);
        }}
        confirmText={t('Try Again')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  screenHeader: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 14,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 28,
    alignItems: 'flex-start',
    width: '90%',
  },
  stepNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumber: {
    color: 'white',
    fontSize: 18,
  },
  stepContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    marginTop: 3,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
  },
  noGuideText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  connectBtn: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 14,
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});
// import React from 'react';
// import {
//   View,
//   Image,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import { useTheme } from '../../context/themeContext';
// import { useTranslation } from 'react-i18next';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { RouteProp } from '@react-navigation/native';
// import { RootStackParamList } from '../../navigation/RouteProps';
// import CustomText from '../../components/customText';
// import { Devices } from '../../constant/devices';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Routes } from '../../navigation/Routes';

// type SetupGuideRouteProp = RouteProp<RootStackParamList, 'SetupGuideScreen'>;

// export default function SetupGuideScreen() {
//   const { theme } = useTheme();
//   const { colors, typography } = theme;
//   const { t } = useTranslation();
//   const route = useRoute<SetupGuideRouteProp>();
//   const navigation = useNavigation<any>();

//   const device = route.params?.device as Devices | undefined;

//   const handleNext = () => {
//     if (!device) return;
//     navigation.navigate(Routes.PairingScreen, { device });
//   };

//   if (!device) {
//     return (
//       <View
//         style={[
//           styles.container,
//           {
//             backgroundColor: colors.background,
//             justifyContent: 'center',
//             alignItems: 'center',
//           },
//         ]}
//       >
//         <CustomText style={{ color: colors.error, fontSize: 18 }} weight="bold">
//           {t('No device selected')}
//         </CustomText>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView
//       style={[styles.screen, { backgroundColor: colors.background }]}
//     >
//       <ScrollView
//         style={styles.container}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <CustomText
//           style={[
//             styles.screenHeader,
//             { fontSize: typography.fontSize.xxl, color: colors.textPrimary },
//           ]}
//           weight="bold"
//         >
//           {t('Setup Guide for')} {t(device.name)}
//         </CustomText>

//         <CustomText
//           style={[styles.subtitle, { color: colors.textSecondary }]}
//           weight="regular"
//         >
//           {t('Model')}: {device.model} • {device.connectionType.toUpperCase()}
//         </CustomText>

//         {device.setupGuide && device.setupGuide.length > 0 ? (
//           device.setupGuide.map((step, index) => (
//             <View key={index} style={styles.stepContainer}>
//               <View
//                 style={[
//                   styles.stepNumberContainer,
//                   { backgroundColor: colors.primary },
//                 ]}
//               >
//                 <CustomText style={styles.stepNumber} weight="bold">
//                   {index + 1}
//                 </CustomText>
//               </View>

//               <View style={styles.stepContent}>
//                 <Image
//                   source={require('../../assets/icons/exclamationMark.png')}
//                   style={[
//                     styles.stepIcon,
//                     { tintColor: colors.warning || '#FF9500' },
//                   ]}
//                 />
//                 <CustomText
//                   style={[styles.stepText, { color: colors.textPrimary }]}
//                 >
//                   {step}
//                 </CustomText>
//               </View>
//             </View>
//           ))
//         ) : (
//           <CustomText
//             style={[styles.noGuideText, { color: colors.textSecondary }]}
//           >
//             {t('No setup guide available for this device')}
//           </CustomText>
//         )}
//       </ScrollView>

//       <TouchableOpacity
//         style={[styles.nextBtn, { backgroundColor: colors.primary }]}
//         onPress={handleNext}
//         activeOpacity={0.8}
//       >
//         <CustomText
//           style={{ color: colors.textPrimary, fontWeight: '600' }}
//           weight="bold"
//         >
//           {t('Next')}
//         </CustomText>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1 },
//   container: { flex: 1 },
//   scrollContent: {
//     padding: 24,
//     paddingBottom: 100,
//   },
//   screenHeader: {
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   subtitle: {
//     textAlign: 'center',
//     marginBottom: 32,
//     fontSize: 14,
//   },
//   stepContainer: {
//     flexDirection: 'row',
//     marginBottom: 28,
//     alignItems: 'flex-start',
//   },
//   stepNumberContainer: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//     marginTop: 2,
//   },
//   stepNumber: {
//     color: 'white',
//     fontSize: 18,
//   },
//   stepContent: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   stepIcon: {
//     width: 24,
//     height: 24,
//     marginRight: 12,
//     marginTop: 3,
//   },
//   stepText: {
//     flex: 1,
//     fontSize: 16,
//     lineHeight: 26,
//   },
//   noGuideText: {
//     textAlign: 'center',
//     marginTop: 50,
//     fontSize: 16,
//   },
//   nextBtn: {
//     position: 'absolute',
//     bottom: 30,
//     alignSelf: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 60,
//     borderRadius: 14,
//     width: '85%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//   },
// });
