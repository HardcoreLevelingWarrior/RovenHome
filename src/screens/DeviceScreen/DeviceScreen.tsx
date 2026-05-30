import React, { useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/themeContext';
import { useNavigation } from '@react-navigation/native';

import CustomText from '../../components/customText';
import DeviceCard from './components/DeviceCard';
import { useApplicationStore } from '../../stores/ApplicationStore';
import DeviceConnectionService from '../../services/connection/DeviceConnectionService';
import { Routes } from '../../navigation/Routes';
import { DeviceInfo } from '../../stores/types';
import TestCard from './components/TestCard';

export default function DeviceScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { colors, typography } = theme;
  const navigation = useNavigation<any>();

  const { devices, addDevice } = useApplicationStore();
  const connectionService = DeviceConnectionService.getInstance();

  const mockOven: DeviceInfo = {
    id: 'test-oven-1',
    name: 'oven-rahavard',
    ip: '10.152.143.240',
    port: 8080,
    status: 'offline',
    type: 'oven',
  };
  useEffect(() => {
    if (!devices.find(d => d.id === mockOven.id)) {
      addDevice(mockOven);
    }
  }, []);
  const handleDevicePress = useCallback(
    async (device: any) => {
      // سعی برای اتصال
      const isConnected = await connectionService.connect(device);

      if (isConnected) {
        if (device.type === 'oven') {
          navigation.navigate(Routes.OvenControlScreen, {
            device: device,
          });
        }
        // بعداً نوع‌های دیگر را اضافه کن
      } else {
        Alert.alert(
          t('خطای اتصال'),
          t(
            'امکان اتصال به دستگاه وجود ندارد. لطفاً از اتصال به شبکه مطمئن شوید.',
          ),
          [{ text: t('باشه') }],
        );
      }
    },
    [navigation],
  );

  const renderDevice = ({ item }: { item: any }) => (
    <DeviceCard device={item} onPress={() => handleDevicePress(item)} />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* <TouchableOpacity
        onPress={() => navigation.navigate(Routes.HoodControlScreen)}
      >
        <Text>hood</Text>
      </TouchableOpacity> */}
      <CustomText
        style={{
          color: colors.textPrimary,
          fontSize: typography.fontSize.xxxl,
          marginHorizontal: 16,
          marginTop: 16,
          marginBottom: 16,
          fontWeight: 'bold',
        }}
      >
        {t('device_screen.devices')}
      </CustomText>
      {devices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <CustomText
            style={{ color: colors.textSecondary, textAlign: 'center' }}
          >
            {t('هیچ دستگاهی اضافه نشده است')}
          </CustomText>
        </View>
      ) : (
        <FlatList
          data={devices}
          renderItem={renderDevice}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingHorizontal: 12, paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between', paddingHorizontal: 4 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
