// components/OvenHeader.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '../../../components/customText';
import type { DeviceInfo } from '../../../stores/types';
import { useTranslation } from 'react-i18next';
import OvenControlScreen from '../OvenControlScreen';

interface OvenHeaderProps {
  device: DeviceInfo;
  isConnected: boolean;
}

export default function OvenHeader({ device, isConnected }: OvenHeaderProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <View>
        <CustomText style={styles.deviceName}>{device.name}</CustomText>
        <CustomText style={styles.deviceModel}>{device.type}</CustomText>
      </View>

      <View
        style={[
          styles.connectionStatus,
          { backgroundColor: isConnected ? '#10b98120' : '#ef444420' },
        ]}
      >
        <CustomText
          style={{
            color: isConnected ? '#10b981' : '#ef4444',
            fontWeight: '600',
            fontSize: 14,
          }}
        >
          {isConnected
            ? `${t('oven-control-screen.connected')} ✅ `
            : `${t('oven-control-screen.disconnected')} ❌`}
        </CustomText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  deviceName: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  deviceModel: {
    fontSize: 15,
    color: '#666',
    marginTop: 2,
  },
  connectionStatus: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
});
