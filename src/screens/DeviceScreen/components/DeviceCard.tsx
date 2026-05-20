import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useTheme } from '../../../context/themeContext'; // فرض بر وجود context تم
import { DeviceInfo } from '../../../stores/types'; // یا مسیر درست
import { useApplicationStore } from '../../../stores/ApplicationStore';

const { width } = Dimensions.get('window');

interface DeviceCardProps {
  device: DeviceInfo;
  onPress?: () => void; // اختیاری - برای کلیک و رفتن به صفحه جزئیات
}

export default function DeviceCard({ device, onPress }: DeviceCardProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  const isOnline = device.status === 'online';
  const statusColor = isOnline ? colors.success : colors.error;

  const connStatus = useApplicationStore(
    s => s.connectionStatus[device.id] || 'disconnected',
  );
  const isTcpConnected = useApplicationStore(s =>
    s.connectedIds.includes(device.id),
  );

  let statusText = 'آفلاین';
  let dotColor = colors.error;

  if (isTcpConnected) {
    statusText = 'متصل';
    dotColor = colors.success;
  } else if (connStatus === 'connecting') {
    statusText = 'در حال اتصال...';
    dotColor = colors.warning;
  } else if (device.status === 'online') {
    statusText = 'آنلاین';
    dotColor = colors.success || '#4ade80';
  } else {
    statusText = 'آفلاین';
    dotColor = colors.error;
  }

  //   const lastMsg = device.lastMessage || 'هیچ پیامی دریافت نشده';

  const cardContent = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
          elevation: 5,
        },
      ]}
    >
      {/* هدر - نام و آیکون وضعیت */}

      <View style={styles.header}>
        <View style={styles.statusDotContainer}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        </View>
        <Text style={[styles.name, { color: colors.textPrimary }]}>
          {device.name}
        </Text>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'حذف دستگاه',
              `مطمئن هستید که می‌خواهید ${device.name} حذف شود؟`,
              [
                { text: 'خیر' },
                {
                  text: 'بله، حذف',
                  style: 'destructive',
                  onPress: () =>
                    useApplicationStore.getState().removeDevice(device.id),
                },
              ],
            );
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={{ fontSize: 20, color: colors.error, marginLeft: 8 }}>
            🗑️
          </Text>
          {/* یا از آیکون vector استفاده کن: <Icon name="trash" size={20} color={colors.error} /> */}
        </TouchableOpacity>
      </View>

      {/* اطلاعات اصلی */}
      <View style={styles.infoContainer}>
        <Text style={[styles.ipText, { color: colors.textSecondary }]}>
          {device.type}
        </Text>
        <Text style={[styles.ipText, { color: colors.textSecondary }]}>
          {device.ip}:{device.port}
        </Text>

        <Text style={[styles.statusText, { color: statusColor }]}>
          {statusText}
        </Text>

        {/* <Text
          style={[styles.lastMessageText, { color: colors.textSecondary }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {lastMsg}
        </Text> */}
      </View>
    </View>
  );

  // اگر onPress داشته باشیم، کارت رو clickable می‌کنیم
  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={styles.touchable}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 16,
    overflow: 'hidden', // برای اینکه shadow کارت بیرون نزنه
  },
  card: {
    flex: 1, // مهم: باعث می‌شه کارت عرض ستون رو پر کنه
    maxWidth: (width - 48) / 2, // عرض صفحه - paddingها تقسیم بر ۲
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    marginVertical: 8,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  top: {
    flex: 1,
    flexDirection: 'row',
  },
  statusDotContainer: {
    marginRight: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  infoContainer: {
    gap: 6,
  },
  ipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
  },
  lastMessageText: {
    fontSize: 13,
    opacity: 0.85,
  },
});
