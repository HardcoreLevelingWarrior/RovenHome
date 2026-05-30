// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRoute } from '@react-navigation/native';
// import { useTheme } from '../../context/themeContext';
// import { useApplicationStore } from '../../stores/ApplicationStore';
// import DeviceConnectionService from '../../services/connection/DeviceConnectionService';
// import CustomText from '../../components/customText';
// import Slider from '@react-native-community/slider'; // اگر نیاز به اسلایدر داشته باشه

// type FanSpeed = 'off' | 'low' | 'medium' | 'high';

// interface RouteParams {
//   deviceId: string;
// }

// export default function HoodControlScreen() {
//   const route = useRoute();
//   const { deviceId } = route.params as RouteParams;

//   const { theme } = useTheme();
//   const { colors } = theme;

//   const store = useApplicationStore();
//   const device = store.devices.find(d => d.id === deviceId);
//   const isConnected = store.connectedIds.includes(deviceId);
//   const lastMessage = store.lastMessages[deviceId] || '';

//   const service = DeviceConnectionService.getInstance();

//   // حالت‌های محلی (چیزی که کاربر تنظیم میکنه)
//   const [fanSpeed, setFanSpeed] = useState<FanSpeed>('off');
//   const [isLightOn, setIsLightOn] = useState(false);
//   const [isAutoMode, setIsAutoMode] = useState(false);

//   // مقادیر واقعی دریافتی از دستگاه
//   const [currentFanSpeed, setCurrentFanSpeed] = useState<FanSpeed>('off');
//   const [currentLightStatus, setCurrentLightStatus] = useState(false);
//   const [currentAutoMode, setCurrentAutoMode] = useState(false);
//   const [airQuality, setAirQuality] = useState<number | null>(null); // کیفیت هوا برای حالت خودکار

//   // اتصال خودکار
//   useEffect(() => {
//     if (!isConnected && device) {
//       service.connect(device).catch(() => {
//         Alert.alert('اتصال ناموفق', 'نمی‌توان به هود متصل شد');
//       });
//     }
//   }, [deviceId, isConnected, device, service]);

//   // Parse پیام دریافتی از هود
//   useEffect(() => {
//     if (!lastMessage) return;

//     console.log('[Hood RX]:', lastMessage);

//     try {
//       const parts = lastMessage.split('|');
//       parts.forEach(p => {
//         const [key, val] = p.split(':').map(s => s.trim());
//         if (key === 'FAN') {
//           const speed = val.toLowerCase() as FanSpeed;
//           if (['off', 'low', 'medium', 'high'].includes(speed)) {
//             setCurrentFanSpeed(speed);
//             setFanSpeed(speed);
//           }
//         }
//         if (key === 'LIGHT') setCurrentLightStatus(val === 'ON');
//         if (key === 'AUTO') setCurrentAutoMode(val === 'ON');
//         if (key === 'AIR') setAirQuality(Number(val));
//       });
//     } catch (e) {
//       console.warn('Parse error:', e);
//     }
//   }, [lastMessage]);

//   // ارسال فرمان به هود
//   const send = (cmd: string) => {
//     if (!isConnected) {
//       Alert.alert('خطا', 'هود متصل نیست');
//       return false;
//     }
//     return service.send(deviceId, cmd);
//   };

//   // اعمال تنظیمات فن
//   const applyFanSpeed = (speed: FanSpeed) => {
//     setFanSpeed(speed);
//     send(`FAN:${speed.toUpperCase()}`);
//   };

//   // تغییر وضعیت چراغ
//   const toggleLight = () => {
//     const newState = !isLightOn;
//     setIsLightOn(newState);
//     send(`LIGHT:${newState ? 'ON' : 'OFF'}`);
//   };

//   // تغییر حالت خودکار
//   const toggleAutoMode = () => {
//     const newState = !isAutoMode;
//     setIsAutoMode(newState);
//     send(`AUTO:${newState ? 'ON' : 'OFF'}`);

//     if (newState) {
//       Alert.alert(
//         'حالت خودکار فعال شد',
//         'سرعت پنکه بر اساس دود و بخار تنظیم میشود',
//       );
//     }
//   };

//   if (!device) {
//     return (
//       <SafeAreaView
//         style={[styles.container, { backgroundColor: colors.background }]}
//       >
//         <CustomText style={[styles.errorText, { color: colors.textPrimary }]}>
//           دستگاه یافت نشد
//         </CustomText>
//       </SafeAreaView>
//     );
//   }

//   const fanSpeedLabels = {
//     off: 'خاموش',
//     low: 'کند',
//     medium: 'متوسط',
//     high: 'تیز',
//   };

//   const fanSpeedIcons = {
//     off: '⏻',
//     low: '🌀',
//     medium: '🌪️',
//     high: '💨',
//   };

//   return (
//     <SafeAreaView
//       style={[styles.container, { backgroundColor: colors.background }]}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* هدر */}
//         <View style={styles.header}>
//           <CustomText style={[styles.title, { color: colors.textPrimary }]}>
//             {device.name || 'هود هوشمند'}
//           </CustomText>
//           <View
//             style={[
//               styles.connectionIndicator,
//               {
//                 backgroundColor: isConnected ? colors.success : colors.warning,
//               },
//             ]}
//           >
//             <CustomText style={styles.connectionText}>
//               {isConnected ? 'متصل' : 'قطع'}
//             </CustomText>
//           </View>
//         </View>

//         {/* کارت وضعیت لحظه‌ای */}
//         <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
//           <View style={styles.statusGrid}>
//             <View style={styles.statusItem}>
//               <CustomText style={styles.statusLabel}>سرعت پنکه</CustomText>
//               <View style={styles.statusIconRow}>
//                 <Text style={styles.statusIcon}>
//                   {fanSpeedIcons[currentFanSpeed]}
//                 </Text>
//                 <CustomText
//                   style={[styles.statusBigValue, { color: colors.primary }]}
//                 >
//                   {fanSpeedLabels[currentFanSpeed]}
//                 </CustomText>
//               </View>
//             </View>

//             <View style={styles.statusItem}>
//               <CustomText style={styles.statusLabel}>چراغ</CustomText>
//               <CustomText
//                 style={[styles.statusBigValue, { color: colors.primary }]}
//               >
//                 {currentLightStatus ? '💡 روشن' : '⚫ خاموش'}
//               </CustomText>
//             </View>

//             <View style={styles.statusItem}>
//               <CustomText style={styles.statusLabel}>حالت خودکار</CustomText>
//               <CustomText
//                 style={[styles.statusBigValue, { color: colors.primary }]}
//               >
//                 {currentAutoMode ? '✅ فعال' : '❌ غیرفعال'}
//               </CustomText>
//             </View>
//           </View>

//           {airQuality !== null && currentAutoMode && (
//             <View style={styles.airQualityContainer}>
//               <CustomText style={styles.airQualityLabel}>کیفیت هوا:</CustomText>
//               <View style={styles.airQualityBar}>
//                 <View
//                   style={[
//                     styles.airQualityFill,
//                     {
//                       width: `${(airQuality / 500) * 100}%`,
//                       backgroundColor:
//                         airQuality > 300
//                           ? colors.error
//                           : airQuality > 150
//                           ? colors.warning
//                           : colors.success,
//                     },
//                   ]}
//                 />
//               </View>
//               <CustomText style={styles.airQualityValue}>
//                 {airQuality} ppm
//               </CustomText>
//             </View>
//           )}
//         </View>

//         {/* کنترل سرعت پنکه */}
//         <CustomText
//           style={[styles.sectionTitle, { color: colors.textPrimary }]}
//         >
//           سرعت پنکه
//         </CustomText>
//         <View style={styles.speedGrid}>
//           {(['off', 'low', 'medium', 'high'] as FanSpeed[]).map(speed => (
//             <TouchableOpacity
//               key={speed}
//               style={[
//                 styles.speedCard,
//                 fanSpeed === speed && styles.speedCardSelected,
//                 { borderColor: colors.border, backgroundColor: colors.surface },
//               ]}
//               onPress={() => applyFanSpeed(speed)}
//             >
//               <Text style={styles.speedIcon}>{fanSpeedIcons[speed]}</Text>
//               <CustomText
//                 style={[
//                   styles.speedLabel,
//                   { color: colors.textPrimary },
//                   fanSpeed === speed && {
//                     color: colors.primary,
//                     fontWeight: '700',
//                   },
//                 ]}
//               >
//                 {fanSpeedLabels[speed]}
//               </CustomText>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* کنترل چراغ */}
//         <CustomText
//           style={[styles.sectionTitle, { color: colors.textPrimary }]}
//         >
//           چراغ هود
//         </CustomText>
//         <TouchableOpacity
//           style={[
//             styles.lightButton,
//             { backgroundColor: isLightOn ? colors.primary : colors.surface },
//           ]}
//           onPress={toggleLight}
//         >
//           <Text style={styles.lightIcon}>{isLightOn ? '💡' : '⚫'}</Text>
//           <CustomText
//             style={[
//               styles.lightButtonText,
//               { color: isLightOn ? '#fff' : colors.textPrimary },
//             ]}
//           >
//             {isLightOn ? 'خاموش کردن چراغ' : 'روشن کردن چراغ'}
//           </CustomText>
//         </TouchableOpacity>

//         {/* حالت خودکار */}
//         <CustomText
//           style={[styles.sectionTitle, { color: colors.textPrimary }]}
//         >
//           حالت خودکار
//         </CustomText>
//         <TouchableOpacity
//           style={[
//             styles.autoButton,
//             { backgroundColor: isAutoMode ? colors.primary : colors.surface },
//           ]}
//           onPress={toggleAutoMode}
//         >
//           <CustomText
//             style={[
//               styles.autoButtonText,
//               { color: isAutoMode ? '#fff' : colors.textPrimary },
//             ]}
//           >
//             {isAutoMode
//               ? '🔘 غیرفعال کردن حالت خودکار'
//               : '🎯 فعال کردن حالت خودکار'}
//           </CustomText>
//         </TouchableOpacity>

//         {isAutoMode && (
//           <View
//             style={[styles.autoHintCard, { backgroundColor: colors.surface }]}
//           >
//             <CustomText
//               style={[styles.autoHint, { color: colors.textSecondary }]}
//             >
//               💡 در حالت خودکار، سرعت پنکه بر اساس میزان دود و بخار تنظیم می‌شود
//             </CustomText>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   scrollContent: { padding: 16, paddingBottom: 40 },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   title: { fontSize: 28, fontWeight: 'bold' },
//   connectionIndicator: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   connectionText: { color: 'white', fontWeight: '600', fontSize: 14 },
//   statusCard: {
//     borderRadius: 20,
//     padding: 20,
//     marginBottom: 28,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   statusGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     flexWrap: 'wrap',
//     gap: 16,
//   },
//   statusItem: { alignItems: 'center', flex: 1 },
//   statusLabel: { fontSize: 14, opacity: 0.7, marginBottom: 8 },
//   statusIconRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   statusIcon: { fontSize: 24 },
//   statusBigValue: { fontSize: 18, fontWeight: '700' },
//   airQualityContainer: {
//     marginTop: 16,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//   },
//   airQualityLabel: { fontSize: 14, marginBottom: 8, textAlign: 'center' },
//   airQualityBar: {
//     height: 8,
//     backgroundColor: '#ddd',
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   airQualityFill: { height: '100%', borderRadius: 4 },
//   airQualityValue: { fontSize: 12, marginTop: 4, textAlign: 'center' },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//     marginTop: 8,
//   },
//   speedGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 28,
//     gap: 12,
//   },
//   speedCard: {
//     flex: 1,
//     paddingVertical: 16,
//     borderWidth: 1.5,
//     borderRadius: 16,
//     alignItems: 'center',
//   },
//   speedCardSelected: {
//     borderWidth: 2.5,
//     backgroundColor: 'rgba(59,130,246,0.08)',
//   },
//   speedIcon: { fontSize: 28, marginBottom: 8 },
//   speedLabel: { fontSize: 14, fontWeight: '500' },
//   lightButton: {
//     flexDirection: 'row',
//     paddingVertical: 16,
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 12,
//     marginBottom: 28,
//   },
//   lightIcon: { fontSize: 24 },
//   lightButtonText: { fontSize: 16, fontWeight: '600' },
//   autoButton: {
//     paddingVertical: 16,
//     borderRadius: 16,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   autoButtonText: { fontSize: 16, fontWeight: '600' },
//   autoHintCard: { padding: 16, borderRadius: 12, marginTop: 8 },
//   autoHint: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
//   errorText: { fontSize: 18, textAlign: 'center', marginTop: 100 },
// });

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../../context/themeContext';
import { useApplicationStore } from '../../stores/ApplicationStore';
import DeviceConnectionService from '../../services/connection/DeviceConnectionService';
import CustomText from '../../components/customText';

type FanSpeed = 'off' | 'low' | 'medium' | 'high';

export default function HoodControlScreen() {
  const route = useRoute();
  const { deviceId } = route.params as { deviceId?: string }; // اختیاری برای حالت تست

  const { theme } = useTheme();
  const { colors } = theme;

  const store = useApplicationStore();
  const service = DeviceConnectionService.getInstance();

  // اگر deviceId وجود داشت از store بگیریم، иначе حالت تست
  const device = deviceId
    ? store.devices.find(d => d.id === deviceId)
    : { id: 'test-hood', name: 'هود تست', type: 'hood' as const };

  const isConnected = store.connectedIds.includes(device?.id || '');
  const lastMessage = store.lastMessages[device?.id || ''] || '';

  // حالت‌های محلی
  const [fanSpeed, setFanSpeed] = useState<FanSpeed>('off');
  const [isLightOn, setIsLightOn] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);

  // مقادیر واقعی دریافتی
  const [currentFanSpeed, setCurrentFanSpeed] = useState<FanSpeed>('off');
  const [currentLightStatus, setCurrentLightStatus] = useState(false);
  const [currentAutoMode, setCurrentAutoMode] = useState(false);
  const [airQuality, setAirQuality] = useState<number | null>(null);

  // اتصال خودکار (فقط برای دستگاه واقعی)
  // useEffect(() => {
  //   if (deviceId && device && !isConnected) {
  //     service.connect(device).catch(() => {
  //       Alert.alert('اتصال ناموفق', 'نمی‌توان به هود متصل شد');
  //     });
  //   }
  // }, [deviceId, isConnected, device, service]);

  // Parse پیام دریافتی
  useEffect(() => {
    if (!lastMessage) return;

    console.log('[Hood RX]:', lastMessage);

    try {
      const parts = lastMessage.split('|');
      parts.forEach(p => {
        const [key, val] = p.split(':').map(s => s.trim());
        if (key === 'FAN') {
          const speed = val.toLowerCase() as FanSpeed;
          if (['off', 'low', 'medium', 'high'].includes(speed)) {
            setCurrentFanSpeed(speed);
            setFanSpeed(speed);
          }
        }
        if (key === 'LIGHT') setCurrentLightStatus(val === 'ON');
        if (key === 'AUTO') setCurrentAutoMode(val === 'ON');
        if (key === 'AIR') setAirQuality(Number(val));
      });
    } catch (e) {
      console.warn('Parse error:', e);
    }
  }, [lastMessage]);

  const send = (cmd: string) => {
    if (!isConnected) {
      Alert.alert('خطا', 'هود متصل نیست');
      return false;
    }
    return service.send(device?.id || '', cmd);
  };

  const applyFanSpeed = (speed: FanSpeed) => {
    setFanSpeed(speed);
    send(`FAN:${speed.toUpperCase()}`);
  };

  const toggleLight = () => {
    const newState = !isLightOn;
    setIsLightOn(newState);
    send(`LIGHT:${newState ? 'ON' : 'OFF'}`);
  };

  const toggleAutoMode = () => {
    const newState = !isAutoMode;
    setIsAutoMode(newState);
    send(`AUTO:${newState ? 'ON' : 'OFF'}`);

    if (newState) {
      Alert.alert(
        'حالت خودکار فعال شد',
        'سرعت پنکه بر اساس کیفیت هوا تنظیم می‌شود',
      );
    }
  };

  if (!device) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <CustomText style={styles.errorText}>دستگاه یافت نشد</CustomText>
      </SafeAreaView>
    );
  }

  const fanSpeedLabels = {
    off: 'خاموش',
    low: 'کند',
    medium: 'متوسط',
    high: 'تیز',
  };

  const fanSpeedIcons = {
    off: '⏻',
    low: '🌀',
    medium: '🌪️',
    high: '💨',
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* هدر */}
        <View style={styles.header}>
          <CustomText style={[styles.title, { color: colors.textPrimary }]}>
            {device.name || 'هود هوشمند'}
          </CustomText>
          <View
            style={[
              styles.connectionIndicator,
              {
                backgroundColor: isConnected ? colors.success : colors.warning,
              },
            ]}
          >
            <CustomText style={styles.connectionText}>
              {isConnected ? 'متصل' : 'قطع'}
            </CustomText>
          </View>
        </View>

        {/* کارت وضعیت */}
        <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <CustomText style={styles.statusLabel}>سرعت پنکه</CustomText>
              <View style={styles.statusIconRow}>
                <Text style={styles.statusIcon}>
                  {fanSpeedIcons[currentFanSpeed]}
                </Text>
                <CustomText
                  style={[styles.statusBigValue, { color: colors.primary }]}
                >
                  {fanSpeedLabels[currentFanSpeed]}
                </CustomText>
              </View>
            </View>

            <View style={styles.statusItem}>
              <CustomText style={styles.statusLabel}>چراغ</CustomText>
              <CustomText
                style={[styles.statusBigValue, { color: colors.primary }]}
              >
                {currentLightStatus ? '💡 روشن' : '⚫ خاموش'}
              </CustomText>
            </View>

            <View style={styles.statusItem}>
              <CustomText style={styles.statusLabel}>حالت خودکار</CustomText>
              <CustomText
                style={[styles.statusBigValue, { color: colors.primary }]}
              >
                {currentAutoMode ? '✅ فعال' : '❌ غیرفعال'}
              </CustomText>
            </View>
          </View>

          {airQuality !== null && currentAutoMode && (
            <View style={styles.airQualityContainer}>
              <CustomText style={styles.airQualityLabel}>کیفیت هوا:</CustomText>
              <View style={styles.airQualityBar}>
                <View
                  style={[
                    styles.airQualityFill,
                    {
                      width: `${Math.min((airQuality / 500) * 100, 100)}%`,
                      backgroundColor:
                        airQuality > 300
                          ? colors.error
                          : airQuality > 150
                          ? colors.warning
                          : colors.success,
                    },
                  ]}
                />
              </View>
              <CustomText style={styles.airQualityValue}>
                {airQuality} ppm
              </CustomText>
            </View>
          )}
        </View>

        {/* کنترل سرعت پنکه */}
        <CustomText
          style={[styles.sectionTitle, { color: colors.textPrimary }]}
        >
          سرعت پنکه
        </CustomText>
        <View style={styles.speedGrid}>
          {(['off', 'low', 'medium', 'high'] as FanSpeed[]).map(speed => (
            <TouchableOpacity
              key={speed}
              style={[
                styles.speedCard,
                fanSpeed === speed && styles.speedCardSelected,
                { borderColor: colors.border, backgroundColor: colors.surface },
              ]}
              onPress={() => applyFanSpeed(speed)}
            >
              <Text style={styles.speedIcon}>{fanSpeedIcons[speed]}</Text>
              <CustomText
                style={[
                  styles.speedLabel,
                  { color: colors.textPrimary },
                  fanSpeed === speed && {
                    color: colors.primary,
                    fontWeight: '700',
                  },
                ]}
              >
                {fanSpeedLabels[speed]}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>

        {/* کنترل چراغ */}
        <CustomText
          style={[styles.sectionTitle, { color: colors.textPrimary }]}
        >
          چراغ هود
        </CustomText>
        <TouchableOpacity
          style={[
            styles.lightButton,
            { backgroundColor: isLightOn ? colors.primary : colors.surface },
          ]}
          onPress={toggleLight}
        >
          <Text style={styles.lightIcon}>{isLightOn ? '💡' : '⚫'}</Text>
          <CustomText
            style={[
              styles.lightButtonText,
              { color: isLightOn ? '#fff' : colors.textPrimary },
            ]}
          >
            {isLightOn ? 'خاموش کردن چراغ' : 'روشن کردن چراغ'}
          </CustomText>
        </TouchableOpacity>

        {/* حالت خودکار */}
        <CustomText
          style={[styles.sectionTitle, { color: colors.textPrimary }]}
        >
          حالت خودکار
        </CustomText>
        <TouchableOpacity
          style={[
            styles.autoButton,
            { backgroundColor: isAutoMode ? colors.primary : colors.surface },
          ]}
          onPress={toggleAutoMode}
        >
          <CustomText
            style={[
              styles.autoButtonText,
              { color: isAutoMode ? '#fff' : colors.textPrimary },
            ]}
          >
            {isAutoMode
              ? '🔘 غیرفعال کردن حالت خودکار'
              : '🎯 فعال کردن حالت خودکار'}
          </CustomText>
        </TouchableOpacity>

        {isAutoMode && (
          <View
            style={[styles.autoHintCard, { backgroundColor: colors.surface }]}
          >
            <CustomText
              style={[styles.autoHint, { color: colors.textSecondary }]}
            >
              💡 در حالت خودکار، سرعت پنکه بر اساس میزان دود و بخار تنظیم می‌شود
            </CustomText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: { fontSize: 28, fontWeight: 'bold' },
  connectionIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  connectionText: { color: 'white', fontWeight: '600', fontSize: 14 },
  statusCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 16,
  },
  statusItem: { alignItems: 'center', flex: 1 },
  statusLabel: { fontSize: 14, opacity: 0.7, marginBottom: 8 },
  statusIconRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusIcon: { fontSize: 24 },
  statusBigValue: { fontSize: 18, fontWeight: '700' },
  airQualityContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  airQualityLabel: { fontSize: 14, marginBottom: 8, textAlign: 'center' },
  airQualityBar: {
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  airQualityFill: { height: '100%', borderRadius: 4 },
  airQualityValue: { fontSize: 12, marginTop: 4, textAlign: 'center' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  speedGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 12,
  },
  speedCard: {
    flex: 1,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderRadius: 16,
    alignItems: 'center',
  },
  speedCardSelected: {
    borderWidth: 2.5,
    backgroundColor: 'rgba(59,130,246,0.08)',
  },
  speedIcon: { fontSize: 28, marginBottom: 8 },
  speedLabel: { fontSize: 14, fontWeight: '500' },
  lightButton: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 28,
  },
  lightIcon: { fontSize: 24 },
  lightButtonText: { fontSize: 16, fontWeight: '600' },
  autoButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  autoButtonText: { fontSize: 16, fontWeight: '600' },
  autoHintCard: { padding: 16, borderRadius: 12, marginTop: 8 },
  autoHint: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  errorText: { fontSize: 18, textAlign: 'center', marginTop: 100 },
});
