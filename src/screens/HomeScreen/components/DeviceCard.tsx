import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../../context/themeContext'; // فرض بر وجود context تم
import { DeviceInfo } from '../../../stores/types'; // یا مسیر درست
const { width } = Dimensions.get('window');
import { useApplicationStore } from '../../../stores/ApplicationStore';

interface DeviceCardProps {
  device: DeviceInfo;
  onPress?: () => void; // اختیاری - برای کلیک و رفتن به صفحه جزئیات
}

export default function DeviceCard({ device, onPress }: DeviceCardProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  const isOnline = device.status === 'online';
  const statusColor = isOnline ? colors.success : colors.error;
  // const statusText = isOnline
  //   ? 'آنلاین'
  //   : device.status === 'connecting'
  //   ? 'در حال اتصال...'
  //   : 'آفلاین';

  //   const lastMsg = device.lastMessage || 'هیچ پیامی دریافت نشده';

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
      </View>

      {/* اطلاعات اصلی */}
      <View style={styles.infoContainer}>
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
    width: width * 0.6,
    height: width * 0.45,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
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

// // components/DeviceCard.tsx
// import React from 'react';
// import { View, Text, StyleSheet, Dimensions } from 'react-native';
// import { useTheme } from '../../../context/themeContext';
// import { useApplicationStore } from '../../../stores/ApplicationStore';
// import { DeviceInfo } from '../../../stores/types';
// const { width } = Dimensions.get('window');

// interface DeviceCardProps {
//   device: DeviceInfo;
// }

// export default function DeviceCard({ device }: DeviceCardProps) {
//   const { theme } = useTheme();
//   const { colors } = theme;

//   const { connectedIds, lastMessages, connectionStatus } =
//     useApplicationStore();

//   const isConnected = connectedIds.includes(device.id);
//   const status = connectionStatus[device.id] || 'disconnected';
//   const lastMsg = lastMessages[device.id] || 'هیچ پیامی دریافت نشده';

//   return (
//     <View
//       style={[
//         styles.card,
//         {
//           backgroundColor: colors.card,
//           borderColor: colors.border,
//           ...theme.shadows.medium,
//         },
//       ]}
//     >
//       <View style={styles.header}>
//         <Text style={[styles.name, { color: colors.textPrimary }]}>
//           {device.name}
//         </Text>
//         <Text style={[styles.ip, { color: colors.textSecondary }]}>
//           {device.ip}:{device.port}
//         </Text>
//       </View>

//       <View style={styles.statusRow}>
//         <Text
//           style={[
//             styles.statusText,
//             { color: isConnected ? colors.success : colors.error },
//           ]}
//         >
//           {isConnected ? '🟢 آنلاین' : '🔴 آفلاین'}
//         </Text>

//         <Text style={[styles.statusDetail, { color: colors.textSecondary }]}>
//           {status}
//         </Text>
//       </View>

//       <Text style={[styles.lastMessage, { color: colors.textPrimary }]}>
//         آخرین پیام: {lastMsg}
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     width: width * 0.4,
//     height: width * 0.5,
//     borderRadius: 16,
//     padding: 5,
//     marginHorizontal: 8, // فاصله بین کارت‌ها
//     borderWidth: 1,
//   },

//   header: {
//     marginBottom: 12,
//   },

//   name: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 4,
//   },

//   ip: {
//     fontSize: 13,
//   },

//   statusRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },

//   statusText: {
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   statusDetail: {
//     fontSize: 13,
//     fontStyle: 'italic',
//   },

//   lastMessage: {
//     fontSize: 14,
//     lineHeight: 20,
//   },
// });
