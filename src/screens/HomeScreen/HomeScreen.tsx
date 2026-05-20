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

import Header from '../../components/Header';
import AddDeviceButton from '../../components/AddDeviceButton';
import CustomText from '../../components/customText';
import { useEffect } from 'react';
import { useApplicationStore } from '../../stores/ApplicationStore';
import TcpSocket from 'react-native-tcp-socket';

import DeviceConnectionService from '../../services/connection/DeviceConnectionService';
import { DeviceInfo } from '../../stores/types';

import DeviceCard from './components/DeviceCard';

const { width } = Dimensions.get('window');

function HomeScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { colors, typography } = theme;
  const { devices, connectedIds, lastMessages, connectionStatus } =
    useApplicationStore();

  const connectionService = DeviceConnectionService.getInstance();

  const handleConnect = async (device: DeviceInfo) => {
    try {
      const success = await connectionService.connect(device);
      if (success) {
        Alert.alert('موفقیت', `اتصال به ${device.name} برقرار شد`);
      } else {
        Alert.alert('خطا', 'نتوانستیم اتصال برقرار کنیم');
      }
    } catch (err: any) {
      Alert.alert('خطا', `مشکلی پیش آمد: ${err.message}`);
    }
  };

  const checkDeviceReachable = useCallback(
    async (device: DeviceInfo): Promise<boolean> => {
      return new Promise(resolve => {
        const tempClient = TcpSocket.createConnection(
          {
            host: device.ip,
            port: device.port,
            connectTimeout: 5000, // ۵ ثانیه کافیه برای چک
          },
          () => {
            tempClient.destroy();
            resolve(true);
          },
        );

        tempClient.on('error', () => resolve(false));
        tempClient.on('close', () => resolve(false));

        // timeout دستی برای اطمینان بیشتر
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

  // const checkAllDevicesStatus = useCallback(async () => {
  //   if (devices.length === 0) {
  //     Alert.alert(t('توجه'), t('هیچ دستگاهی وجود ندارد'));
  //     return;
  //   }

  //   Alert.alert(t('در حال بررسی'), t('وضعیت دستگاه‌ها بررسی می‌شود...'));

  //   // همه دستگاه‌ها رو همزمان چک می‌کنیم (می‌تونی Promise.all هم استفاده کنی)
  //   const promises = devices.map(async device => {
  //     try {
  //       const success = await connectionService.connect(device);
  //       if (success) {
  //         // اگر وصل شد → آنلاین
  //         useApplicationStore
  //           .getState()
  //           .updateDeviceStatus(device.id, 'online');
  //       }
  //     } catch {
  //       useApplicationStore.getState().updateDeviceStatus(device.id, 'offline');
  //     }
  //   });

  //   await Promise.all(promises);
  //   Alert.alert(t('تمام شد'), t('وضعیت همه دستگاه‌ها بروز شد'));
  // }, [devices, connectionService]);

  // const renderDevice = ({ item }: { item: DeviceInfo }) => {
  //   return <DeviceCard device={item} />;
  // };

  const checkAllDevicesStatus = useCallback(async () => {
    if (devices.length === 0) {
      Alert.alert(t('توجه'), t('هیچ دستگاهی وجود ندارد'));
      return;
    }

    Alert.alert(t('در حال بررسی'), t('وضعیت دستگاه‌ها بررسی می‌شود...'));

    const promises = devices.map(async device => {
      // اگر قبلاً متصل هست → فرض آنلاین
      if (connectedIds.includes(device.id)) {
        useApplicationStore.getState().updateDeviceStatus(device.id, 'online');
        return;
      }

      // چک سریع
      const isReachable = await checkDeviceReachable(device);

      // آپدیت وضعیت
      useApplicationStore
        .getState()
        .updateDeviceStatus(device.id, isReachable ? 'online' : 'offline');

      // اگر در دسترس بود اما هنوز TCP وصل نیست → اتصال دائمی بزن
      if (isReachable && !connectedIds.includes(device.id)) {
        try {
          await connectionService.connect(device);
        } catch (err) {
          console.warn('اتصال خودکار شکست:', err);
        }
      }
    });

    await Promise.all(promises);
    Alert.alert(t('تمام شد'), t('وضعیت همه دستگاه‌ها بروز شد'));
  }, [devices, connectedIds, checkDeviceReachable]);

  const renderDevice = ({ item }: { item: DeviceInfo }) => {
    return <DeviceCard device={item} />;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header headerText="Home" brandName={t('Roven')}></Header>
      <CustomText
        style={[
          {
            color: 'black',
            fontSize: typography.fontSize.xxxl,
            marginHorizontal: 10,
          },
        ]}
        children={t('Devices')}
      ></CustomText>

      <TouchableOpacity
        style={[
          styles.checkAllButton,
          {
            backgroundColor: colors.primary,
            marginHorizontal: 16,
            marginBottom: 16,
          },
        ]}
        onPress={checkAllDevicesStatus}
      >
        <Text
          style={{
            color: colors.textOnPrimary,
            fontWeight: '600',
            fontSize: 16,
          }}
        >
          {t('بررسی وضعیت همه دستگاه‌ها')}
        </Text>
      </TouchableOpacity>
      <View style={styles.flatListContent}>
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
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            decelerationRate="fast"
            pagingEnabled={false} // اگر می‌خوای snap دقیق به هر کارت داشته باشی true کن
          />
        )}
      </View>
      <AddDeviceButton
        avatar={require('../../assets/images/wifiConfig.png')}
        text={t('Add Device')}
      ></AddDeviceButton>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  flatListContent: {
    height: width * 0.85,
    // paddingHorizontal: 16,
    // paddingVertical: 8,
  },
  checkAllButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
export default HomeScreen;
