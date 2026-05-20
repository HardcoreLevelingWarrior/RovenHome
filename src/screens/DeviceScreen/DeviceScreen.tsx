import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/themeContext';
import { useNavigation } from '@react-navigation/native';

import CustomText from '../../components/customText';
import DeviceCard from './components/DeviceCard';
import { useApplicationStore } from '../../stores/ApplicationStore';
import DeviceConnectionService from '../../services/connection/DeviceConnectionService';
import { DeviceInfo } from '../../stores/types';
import { Routes } from '../../navigation/Routes';
import TcpSocket from 'react-native-tcp-socket';

const { width } = Dimensions.get('window');

function DeviceScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { colors, typography } = theme;
  const navigation = useNavigation<any>();

  const { devices, connectedIds, connectionStatus } = useApplicationStore();
  const connectionService = DeviceConnectionService.getInstance();

  // تابع چک واقعی وضعیت دستگاه (مستقل از connect دائمی)
  const checkDeviceReachable = useCallback(
    async (device: DeviceInfo): Promise<boolean> => {
      return new Promise(resolve => {
        const tempClient = TcpSocket.createConnection(
          {
            host: device.ip,
            port: device.port,
            connectTimeout: 5000, // کوتاه برای چک سریع
          },
          () => {
            tempClient.destroy();
            resolve(true);
          },
        );

        tempClient.on('error', () => resolve(false));
        tempClient.on('close', () => resolve(false));

        // timeout دستی برای اطمینان
        setTimeout(() => {
          if (!tempClient.destroyed) {
            tempClient.destroy();
            resolve(false);
          }
        }, 6000);
      });
    },
    [],
  );

  // بروزرسانی وضعیت همه دستگاه‌ها
  const handleRefreshAll = useCallback(async () => {
    if (devices.length === 0) {
      Alert.alert(t('توجه'), t('هیچ دستگاهی وجود ندارد'));
      return;
    }

    // Alert.alert(t('در حال بررسی'), t('وضعیت دستگاه‌ها بررسی می‌شود...'));

    const promises = devices.map(async device => {
      const isReachable = await checkDeviceReachable(device);

      // آپدیت وضعیت اصلی
      useApplicationStore
        .getState()
        .updateDeviceStatus(device.id, isReachable ? 'online' : 'offline');

      // اگر واقعاً در دسترس بود اما هنوز وصل نیست → connect دائمی بزن
      if (isReachable && !connectedIds.includes(device.id)) {
        try {
          await connectionService.connect(device);
        } catch (err) {
          console.warn('Auto connect failed:', err);
        }
      }
    });

    await Promise.all(promises);
    Alert.alert(t('تمام شد'), t('وضعیت همه دستگاه‌ها بروز شد'));
  }, [devices, connectedIds, checkDeviceReachable]);

  // کلیک روی کارت → رفتن به صفحه کنترل
  const handleDevicePress = useCallback(
    (device: DeviceInfo) => {
      if (device.type === 'oven') {
        navigation.navigate(Routes.OvenControlScreen, { deviceId: device.id });
      }
      // می‌تونی بقیه typeها رو اینجا اضافه کنی
    },
    [navigation],
  );

  const renderDevice = ({ item }: { item: DeviceInfo }) => {
    return <DeviceCard device={item} onPress={() => handleDevicePress(item)} />;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* عنوان صفحه */}
      <CustomText
        style={{
          color: colors.textPrimary,
          fontSize: typography.fontSize.xxxl,
          marginHorizontal: 16,
          marginTop: 16,
          marginBottom: 8,
          fontWeight: 'bold',
        }}
      >
        {t('همه دستگاه‌ها')}
      </CustomText>

      {/* دکمه بروزرسانی */}
      <TouchableOpacity
        style={[
          styles.refreshButton,
          {
            backgroundColor: colors.primary,
            marginHorizontal: 16,
            marginBottom: 16,
          },
        ]}
        onPress={handleRefreshAll}
      >
        <Text
          style={{
            color: colors.textOnPrimary,
            fontWeight: '600',
            fontSize: 16,
          }}
        >
          {t('بروزرسانی وضعیت')}
        </Text>
      </TouchableOpacity>

      {devices.length === 0 ? (
        <Text
          style={{
            textAlign: 'center',
            color: colors.textSecondary,
            marginTop: 40,
          }}
        >
          {t('هیچ دستگاهی اضافه نشده است')}
        </Text>
      ) : (
        <FlatList
          data={devices}
          renderItem={renderDevice}
          keyExtractor={item => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  refreshButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
});

export default DeviceScreen;

// import React, { useCallback } from 'react';
// import {
//   View,
//   FlatList,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Dimensions,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useTranslation } from 'react-i18next';
// import { useTheme } from '../../context/themeContext';
// import { useNavigation } from '@react-navigation/native';

// import CustomText from '../../components/customText';
// import DeviceCard from './components/DeviceCard';
// import { useApplicationStore } from '../../stores/ApplicationStore';
// import DeviceConnectionService from '../../services/connection/DeviceConnectionService';
// import { DeviceInfo } from '../../stores/types';
// import { Routes } from '../../navigation/Routes';

// const { width } = Dimensions.get('window');

// function DeviceScreen() {
//   const { t } = useTranslation();
//   const { theme } = useTheme();
//   const { colors, typography } = theme;
//   const navigation = useNavigation<any>();

//   const { devices } = useApplicationStore();
//   const connectionService = DeviceConnectionService.getInstance();

//   // دکمه بروزرسانی همه دستگاه‌ها
//   const handleRefreshAll = useCallback(async () => {
//     if (devices.length === 0) {
//       Alert.alert(t('توجه'), t('هیچ دستگاهی وجود ندارد'));
//       return;
//     }

//     Alert.alert(t('در حال بررسی'), t('وضعیت دستگاه‌ها بررسی می‌شود...'));

//     const promises = devices.map(async device => {
//       try {
//         const success = await connectionService.connect(device);
//         useApplicationStore
//           .getState()
//           .updateDeviceStatus(device.id, success ? 'online' : 'offline');
//       } catch {
//         useApplicationStore.getState().updateDeviceStatus(device.id, 'offline');
//       }
//     });

//     await Promise.all(promises);
//     Alert.alert(t('تمام شد'), t('وضعیت همه دستگاه‌ها بروز شد'));
//   }, [devices, connectionService]);

//   // کلیک روی کارت → رفتن به صفحه جزئیات
//   // const handleDevicePress = useCallback((device: DeviceInfo) => {
//   //   navigation.navigate('DeviceDetail', { deviceId: device.id, device });
//   // }, [navigation]);

//   const renderDevice = ({ item }: { item: DeviceInfo }) => {
//     return <DeviceCard device={item} onPress={() => handleDevicePress(item)} />;
//   };

//   const handleDevicePress = (device: DeviceInfo) => {
//     if (device.type === 'oven') {
//       navigation.navigate(Routes.OvenControlScreen, { deviceId: device.id });
//       //   } else if (device.type === 'hood') {
//       //     navigation.navigate('HoodControl', { deviceId: device.id });
//       //   } else if (device.type === 'fridge') {
//       //     navigation.navigate('FridgeControl', { deviceId: device.id });
//       //   } else {
//       //     navigation.navigate('DeviceDetail', { deviceId: device.id });
//       //   }
//     }
//   };

//   return (
//     <SafeAreaView
//       style={[styles.container, { backgroundColor: colors.background }]}
//     >
//       <Text>{JSON.stringify(devices)}</Text>
//       {/* عنوان صفحه */}
//       <CustomText
//         style={{
//           color: colors.textPrimary,
//           fontSize: typography.fontSize.xxxl,
//           marginHorizontal: 16,
//           marginTop: 16,
//           marginBottom: 8,
//           fontWeight: 'bold',
//         }}
//       >
//         {t('همه دستگاه‌ها')}
//       </CustomText>

//       {/* دکمه بروزرسانی */}
//       <TouchableOpacity
//         style={[
//           styles.refreshButton,
//           {
//             backgroundColor: colors.primary,
//             marginHorizontal: 16,
//             marginBottom: 16,
//           },
//         ]}
//         onPress={handleRefreshAll}
//       >
//         <Text
//           style={{
//             color: colors.textOnPrimary,
//             fontWeight: '600',
//             fontSize: 16,
//           }}
//         >
//           {t('بروزرسانی وضعیت')}
//         </Text>
//       </TouchableOpacity>

//       {devices.length === 0 ? (
//         <Text
//           style={{
//             textAlign: 'center',
//             color: colors.textSecondary,
//             marginTop: 40,
//           }}
//         >
//           {t('هیچ دستگاهی اضافه نشده است')}
//         </Text>
//       ) : (
//         <FlatList
//           data={devices}
//           renderItem={renderDevice}
//           keyExtractor={item => item.id}
//           numColumns={2} // ← دو ستونه
//           showsVerticalScrollIndicator={true}
//           contentContainerStyle={styles.listContent}
//           columnWrapperStyle={styles.columnWrapper} // فاصله بین ردیف‌ها
//           ItemSeparatorComponent={() => <View style={{ height: 16 }} />} // فاصله عمودی بین کارت‌ها
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   refreshButton: {
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   listContent: {
//     paddingHorizontal: 12,
//     paddingBottom: 20,
//   },
//   columnWrapper: {
//     justifyContent: 'space-between', // کارت‌ها رو دو طرف پخش می‌کنه
//     paddingHorizontal: 4,
//   },
// });

// export default DeviceScreen;
