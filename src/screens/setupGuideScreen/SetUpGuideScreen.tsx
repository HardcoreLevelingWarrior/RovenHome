// src/screens/SetupGuideScreen/SetupGuideScreen.tsx
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
import PairingService from '../../services/pairing/PairingService'; // مسیر درست کن
import AlertModal from '../PairingScreen/components/AlertModal'; // یا هر جا که هست

type SetupGuideRouteProp = RouteProp<RootStackParamList, 'SetupGuideScreen'>;

const IP_ADDRESS = '192.168.4.1';
const PORT = 5000;

export default function SetupGuideScreen() {
  const { theme } = useTheme();
  const { colors, typography } = theme;
  const { t } = useTranslation();
  const route = useRoute<SetupGuideRouteProp>();
  const navigation = useNavigation<any>();
  const device = route.params?.device as Devices | undefined;

  // const [isConnecting, setIsConnecting] = useState(false);
  // const [connectionError, setConnectionError] = useState<string | null>(null);
  // const [showErrorModal, setShowErrorModal] = useState(false);

  // const pairing = PairingService.getInstance();

  const handleStartConnection = async () => {
    if (!device) return;

    // setIsConnecting(true);
    // setConnectionError(null);
    // setShowErrorModal(false);

    navigation.navigate(Routes.PairingScreen, { device });
  };

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
        <CustomText
          style={{ color: colors.error, fontSize: 18, textAlign: 'center' }}
          weight="bold"
        >
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
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        <CustomText
          style={[styles.screenHeader, { fontSize: typography.fontSize.xxl }]}
          weight="bold"
        >
          {t('Setup Guide for')} {device.name}
        </CustomText>

        <CustomText
          style={[styles.subtitle, { color: colors.textSecondary }]}
          weight="bold"
        >
          Model: {device.model} • {device.connectionType.toUpperCase()}
        </CustomText>

        {device.setupGuide && device.setupGuide.length > 0 ? (
          device.setupGuide.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepNumberContainer}>
                <CustomText style={styles.stepNumber} weight="bold">
                  {index + 1}
                </CustomText>
              </View>
              <View style={styles.stepContent}>
                <Image
                  source={require('../../assets/icons/exclamationMark.png')}
                  style={styles.stepIcon}
                />
                <CustomText style={styles.stepText}>{step}</CustomText>
              </View>
            </View>
          ))
        ) : (
          <CustomText
            style={{
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: 40,
            }}
          >
            {t('No setup guide available for this device')}
          </CustomText>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.startConfigBtn, { backgroundColor: colors.primary }]}
        onPress={handleStartConnection}
        // disabled={isConnecting}
      >
        {/* {isConnecting ? (
          <ActivityIndicator color={colors.textPrimary || '#fff'} />
        ) : (
          <CustomText
            style={{ color: colors.textPrimary, fontWeight: '600' }}
            weight="bold"
          >
            {t('Start connection')}
          </CustomText>
        )} */}
        <CustomText
          style={{ color: colors.textPrimary, fontWeight: '600' }}
          weight="bold"
        >
          {t('Start connection')}
        </CustomText>
      </TouchableOpacity>

      {/* Alert در صورت شکست اتصال */}
      {/* <AlertModal
        alertVisible={showErrorModal}
        setAlertVisible={setShowErrorModal}
        children={`${t('Connection failed')}: ${
          connectionError || t('Unknown error')
        }`}
      /> */}
    </SafeAreaView>
  );
}

// styles بدون تغییر
const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { height: '80%' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  screenHeader: { textAlign: 'center', marginBottom: 12 },
  subtitle: { textAlign: 'center', marginBottom: 32, fontSize: 16 },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  stepNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumber: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  stepContent: { flex: 1, flexDirection: 'row', alignItems: 'flex-start' },
  stepIcon: { width: 24, height: 24, marginRight: 12, tintColor: '#FF9500' },
  stepText: { flex: 1, fontSize: 16, lineHeight: 24, color: '#333' },
  startConfigBtn: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '85%',
    marginHorizontal: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
}); // // src / screens / SetupGuideScreen / SetupGuideScreen.tsx;
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
// import { NavigationContainer, useRoute } from '@react-navigation/native';
// import { RouteProp } from '@react-navigation/native';
// import { RootStackParamList } from '../../navigation/RouteProps';
// import CustomText from '../../components/customText';
// import { Devices } from '../../constant/devices';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import { Routes } from '../../navigation/Routes';
// import PairingService from '../../services/pairing/PairingService';

// type SetupGuideRouteProp = RouteProp<RootStackParamList, 'SetupGuideScreen'>;

// export default function SetupGuideScreen() {
//   const { theme } = useTheme();
//   const { colors, typography } = theme;
//   const { t } = useTranslation();
//   const route = useRoute<SetupGuideRouteProp>();
//   const navigation = useNavigation<any>();
//   const device = route.params?.device as Devices | undefined;

//   function startPairing() {
//     //calling pairing connection

//     navigation.navigate(Routes.PairingScreen, {
//       device: device,
//     });
//   }

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
//         <CustomText
//           style={{ color: colors.error, fontSize: 18, textAlign: 'center' }}
//           weight="bold"
//         >
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
//         style={[styles.container, { backgroundColor: colors.background }]}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* عنوان اصلی */}
//         <CustomText
//           style={[styles.screenHeader, { fontSize: typography.fontSize.xxl }]}
//           weight="bold"
//         >
//           {t('Setup Guide for')} {device.name}
//         </CustomText>

//         <CustomText
//           style={[styles.subtitle, { color: colors.textSecondary }]}
//           weight="bold"
//         >
//           Model: {device.model} • {device.connectionType.toUpperCase()}
//         </CustomText>

//         {/* لیست گام‌های راهنما */}
//         {device.setupGuide && device.setupGuide.length > 0 ? (
//           device.setupGuide.map((step, index) => (
//             <View key={index} style={styles.stepContainer}>
//               <View style={styles.stepNumberContainer}>
//                 <CustomText style={styles.stepNumber} weight="bold">
//                   {index + 1}
//                 </CustomText>
//               </View>

//               <View style={styles.stepContent}>
//                 <Image
//                   source={require('../../assets/icons/exclamationMark.png')}
//                   style={styles.stepIcon}
//                 />
//                 <CustomText style={styles.stepText}>{step}</CustomText>
//               </View>
//             </View>
//           ))
//         ) : (
//           <CustomText
//             style={{
//               color: colors.textSecondary,
//               textAlign: 'center',
//               marginTop: 40,
//             }}
//           >
//             {t('No setup guide available for this device')}
//           </CustomText>
//         )}
//       </ScrollView>
//       <TouchableOpacity
//         style={[styles.startConfigBtn, { backgroundColor: colors.primary }]}
//         onPress={() => startPairing()}
//       >
//         <CustomText
//           style={{ color: colors.textPrimary, fontWeight: '600' }}
//           children={t('Start connection')}
//           weight="bold"
//         ></CustomText>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//   },
//   container: {
//     height: '80%',
//   },
//   scrollContent: {
//     padding: 24,
//     paddingBottom: 40,
//   },
//   screenHeader: {
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   subtitle: {
//     textAlign: 'center',
//     marginBottom: 32,
//     fontSize: 16,
//   },
//   stepContainer: {
//     flexDirection: 'row',
//     marginBottom: 24,
//     alignItems: 'flex-start',
//   },
//   stepNumberContainer: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#007AFF', // یا از theme.primary
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   stepNumber: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
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
//     tintColor: '#FF9500', // رنگ هشدار
//   },
//   stepText: {
//     flex: 1,
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#333', // یا از theme.textPrimary
//   },
//   startConfigBtn: {
//     paddingVertical: 14,
//     paddingHorizontal: 48,
//     borderRadius: 12,
//     width: '85%',
//     marginHorizontal: 'auto',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
// });
