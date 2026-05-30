import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  AlertType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../context/themeContext';
import { useTranslation } from 'react-i18next';

import { useApplicationStore } from '../../stores/ApplicationStore';
import DeviceConnectionService from '../../services/connection/DeviceConnectionService';
import CustomText from '../../components/customText';
import { DeviceInfo } from '../../stores/types';

import CustomAlert from '../../components/CustomAlert';
import OvenHeader from './components/OvenHeader';
import OvenStatusCard from './components/OvenStatusCard';
import OvenPowerControl from './components/OvenPowerControl';
import OvenModeSelector from './components/OvenModeSelector';
import OvenTemperatureControl from './components/OvenTemperatureControl';

export type OvenMode =
  | 'off'
  | 'bake'
  | 'grill'
  | 'convection'
  | 'roast'
  | 'pizza'
  | 'pasta'
  | 'cake'
  | 'pasty'
  | 'frozen'
  | 'fish'
  | 'redmeat'
  | 'chicken'
  | 'redmeatchop'
  | 'chickenchop'
  | 'fishchop';

export default function OvenControlScreen() {
  const route = useRoute();
  const { device } = route.params as { device: DeviceInfo };
  const { theme } = useTheme();
  const { colors } = theme;
  const { t } = useTranslation();
  const service = DeviceConnectionService.getInstance();
  const { connectedIds, lastMessages } = useApplicationStore();

  const isConnected = connectedIds.includes(device.id);
  const lastMessage = lastMessages[device.id] || '';

  //state
  const [isOn, setIsOn] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [childLock, setChildLock] = useState(false);
  const [mode, setMode] = useState<OvenMode>('bake');
  const [targetTemp, setTargetTemp] = useState(180);
  const [timerMin, setTimerMin] = useState(45);
  const [startTime, setStartTime] = useState('00:00');

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info' as any,
    confirmText: 'ok',
    cancelText: 'cancel',
    singleButton: true,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showAlert = (config: Partial<typeof alertConfig>) => {
    setAlertConfig(prev => ({ ...prev, visible: true, ...config }));
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    if (isConnected) {
      service.send(device.id, 'GET_STATUS');
    }
  }, [isConnected, device.id]);

  useEffect(() => {
    if (!isConnected && device) {
      service.connect(device).catch(() => {
        // Alert.alert('خطا', 'اتصال به فر برقرار نشد');
        showAlert({
          title: 'error',
          message: 'connection to the oven failed.',
          type: 'error',
          singleButton: true,
        });
        return false;
      });
    }
  }, [device.id, isConnected]);

  const sendCommand = (command: string) => {
    if (!isConnected) {
      showAlert({
        title: 'error',
        message: 'device is not connected!',
        type: 'error',
        singleButton: true,
      });
      return false;
    }
    return service.send(device.id, command);
  };

  const applyAllSettings = () => {
    if (mode === 'off') {
      showAlert({
        title: 'error',
        message: 'Please select the cooking mode',
        type: 'warning',
      });
      return;
    }

    const payload = `SET:MODE=${mode},TEMP=${targetTemp},TIME=${timerMin},START=${startTime}`;
    sendCommand(payload);

    showAlert({
      title: 'success',
      message: 'settings has been sent successfully',
      type: 'success',
    });
  };
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <OvenHeader device={device} isConnected={isConnected} />

        <OvenStatusCard lastMessage={lastMessage} />

        <OvenPowerControl
          isOn={isOn}
          setIsOn={setIsOn}
          sendCommand={sendCommand}
        />

        <OvenModeSelector mode={mode} setMode={setMode} />

        <OvenTemperatureControl temp={targetTemp} setTemp={setTargetTemp} />

        {/* <OvenTimerControl time={timerMin} setTime={setTimerMin} /> */}

        {/* <OvenStartTimeControl
          startTime={startTime}
          setStartTime={setStartTime}
        /> */}

        {/* <OvenActionButtons
          onApply={sendCommand}
          onStop={() => sendCommand('STOP')}
        /> */}
      </ScrollView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        singleButton={alertConfig.singleButton}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
        onClose={hideAlert}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 120 },
  // header: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginBottom: 24,
  // },
  // title: { fontSize: 26, fontWeight: 'bold' },
  // statusBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  // statusCard: {
  //   borderRadius: 20,
  //   padding: 20,
  //   marginBottom: 28,
  //   shadowOpacity: 0.1,
  //   elevation: 4,
  // },
  // statusGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  // statusItem: { alignItems: 'center' },
  // label: { fontSize: 14, opacity: 0.7, marginBottom: 4 },
  // bigValue: { fontSize: 28, fontWeight: '700' },
  // sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  // modeGrid: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   justifyContent: 'space-between',
  //   marginBottom: 32,
  // },
  // modeCard: {
  //   width: '48%',
  //   paddingVertical: 24,
  //   borderWidth: 1.5,
  //   borderRadius: 18,
  //   alignItems: 'center',
  //   marginBottom: 12,
  //   backgroundColor: 'rgba(255,255,255,0.05)',
  // },
  // modeCardSelected: {
  //   borderColor: '#3b82f6',
  //   backgroundColor: 'rgba(59,130,246,0.1)',
  // },
  // modeIcon: { fontSize: 42, marginBottom: 10 },
  // modeLabel: { fontSize: 15, fontWeight: '500' },
  // sliderContainer: { marginBottom: 32 },
  // sliderValue: {
  //   fontSize: 24,
  //   fontWeight: '700',
  //   textAlign: 'center',
  //   marginBottom: 12,
  // },
  // slider: { width: '100%', height: 40 },
  // actionBar: {
  //   flexDirection: 'row',
  //   position: 'absolute',
  //   bottom: 24,
  //   left: 16,
  //   right: 16,
  //   gap: 12,
  // },
  // actionButton: {
  //   flex: 1,
  //   paddingVertical: 18,
  //   borderRadius: 16,
  //   alignItems: 'center',
  // },
  // startButton: { backgroundColor: '#10b981' },
  // stopButton: { backgroundColor: '#ef4444' },
  // actionButtonText: { color: 'white', fontSize: 17, fontWeight: '700' },
});

// export default function OvenControlScreen() {
//   const route = useRoute();
//   const { device } = route.params as { device: DeviceInfo };

//   const { theme } = useTheme();
//   const { colors } = theme;
//   const store = useApplicationStore();
//   // const device = store.devices.find(d => d.id === device.id);
//   const isConnected = store.connectedIds.includes(device.id);
//   const lastMessage = store.lastMessages[device.id] || '';

//   const service = DeviceConnectionService.getInstance();

//   const [mode, setMode] = useState<OvenMode>('off');
//   const [targetTemp, setTargetTemp] = useState(180);
//   const [timerMin, setTimerMin] = useState(30);

//   const [currentTemp, setCurrentTemp] = useState<number | null>(null);
//   const [remainingSec, setRemainingSec] = useState<number | null>(null);
//   const [currentMode, setCurrentMode] = useState<OvenMode>('off');

//   // Parse داده‌های دریافتی
//   useEffect(() => {
//     if (!lastMessage) return;
//     try {
//       const parts = lastMessage.split('|');
//       parts.forEach(p => {
//         const [key, val] = p.split(':').map(s => s.trim());
//         if (key === 'TEMP') setCurrentTemp(Number(val));
//         if (key === 'TIMER') setRemainingSec(Number(val));
//         if (key === 'MODE') {
//           const m = val.toLowerCase() as OvenMode;
//           if (['off', 'bake', 'grill', 'convection', 'roast'].includes(m)) {
//             setCurrentMode(m);
//             setMode(m);
//           }
//         }
//       });
//     } catch (e) {
//       console.warn('Parse error:', e);
//     }
//   }, [lastMessage]);

//   const send = (cmd: string) => {
//     if (!isConnected) {
//       Alert.alert('خطا', 'دستگاه متصل نیست');
//       return;
//     }
//     service.send(device.id, cmd);
//   };

//   const applyAllSettings = () => {
//     if (mode === 'off') {
//       Alert.alert('خطا', 'لطفاً حالت پخت را انتخاب کنید');
//       return;
//     }

//     const payload = JSON.stringify({
//       mode: mode.toUpperCase(),
//       temperature: targetTemp,
//       timer_seconds: timerMin * 60,
//     });

//     send(payload);
//     Alert.alert('موفق', 'تنظیمات ارسال شد');
//   };

//   const stopOven = () => {
//     Alert.alert('توقف فر', 'آیا مطمئن هستید؟', [
//       { text: 'خیر', style: 'cancel' },
//       { text: 'بله، توقف', style: 'destructive', onPress: () => send('STOP') },
//     ]);
//   };

//   if (!device) {
//     return (
//       <SafeAreaView
//         style={[styles.container, { backgroundColor: colors.background }]}
//       >
//         <CustomText
//           style={{ color: colors.error, textAlign: 'center', marginTop: 100 }}
//         >
//           دستگاه یافت نشد
//         </CustomText>
//       </SafeAreaView>
//     );
//   }

//   const isActive = currentMode !== 'off' && remainingSec && remainingSec > 0;

//   return (
//     <SafeAreaView
//       style={[styles.container, { backgroundColor: colors.background }]}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Header */}
//         <View style={styles.header}>
//           <CustomText style={styles.title}>{device.name}</CustomText>
//           <View
//             style={[
//               styles.statusBadge,
//               { backgroundColor: isConnected ? '#10b98120' : '#ef444420' },
//             ]}
//           >
//             <CustomText
//               style={{
//                 color: isConnected ? '#10b981' : '#ef4444',
//                 fontWeight: '600',
//               }}
//             >
//               {isConnected ? 'متصل' : 'قطع'}
//             </CustomText>
//           </View>
//         </View>

//         {/* Status Card */}
//         <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
//           <View style={styles.statusGrid}>
//             <View style={styles.statusItem}>
//               <CustomText style={styles.label}>دمای فعلی</CustomText>
//               <CustomText style={styles.bigValue}>
//                 {currentTemp ? `${currentTemp}°` : '—'}
//               </CustomText>
//             </View>
//             <View style={styles.statusItem}>
//               <CustomText style={styles.label}>زمان باقی‌مانده</CustomText>
//               <CustomText style={styles.bigValue}>
//                 {remainingSec
//                   ? `${Math.floor(remainingSec / 60)}:${(remainingSec % 60)
//                       .toString()
//                       .padStart(2, '0')}`
//                   : '—'}
//               </CustomText>
//             </View>
//           </View>
//         </View>

//         {/* Mode Selection */}
//         <CustomText style={styles.sectionTitle}>حالت پخت</CustomText>
//         <View style={styles.modeGrid}>
//           {(['bake', 'grill', 'convection', 'roast'] as OvenMode[]).map(m => (
//             <TouchableOpacity
//               key={m}
//               style={[styles.modeCard, mode === m && styles.modeCardSelected]}
//               onPress={() => setMode(m)}
//             >
//               <CustomText style={styles.modeIcon}>{MODE_ICONS[m]}</CustomText>
//               <CustomText style={styles.modeLabel}>
//                 {m === 'bake'
//                   ? 'پخت معمولی'
//                   : m === 'grill'
//                   ? 'گریل'
//                   : m === 'convection'
//                   ? 'گردش هوا'
//                   : 'روست'}
//               </CustomText>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Temperature Slider */}
//         <CustomText style={styles.sectionTitle}>دمای هدف</CustomText>
//         <View style={styles.sliderContainer}>
//           <CustomText style={styles.sliderValue}>{targetTemp} °C</CustomText>
//           <Slider
//             style={styles.slider}
//             minimumValue={50}
//             maximumValue={280}
//             step={5}
//             value={targetTemp}
//             onValueChange={setTargetTemp}
//             minimumTrackTintColor={colors.primary}
//             thumbTintColor={colors.primary}
//           />
//         </View>

//         {/* Timer Slider */}
//         <CustomText style={styles.sectionTitle}>زمان پخت (دقیقه)</CustomText>
//         <View style={styles.sliderContainer}>
//           <CustomText style={styles.sliderValue}>{timerMin} دقیقه</CustomText>
//           <Slider
//             style={styles.slider}
//             minimumValue={1}
//             maximumValue={240}
//             step={1}
//             value={timerMin}
//             onValueChange={setTimerMin}
//             minimumTrackTintColor={colors.primary}
//             thumbTintColor={colors.primary}
//           />
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.actionBar}>
//           <TouchableOpacity
//             style={[styles.actionButton, styles.stopButton]}
//             onPress={stopOven}
//             disabled={!isActive}
//           >
//             <CustomText style={styles.actionButtonText}>توقف پخت</CustomText>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.actionButton, styles.startButton]}
//             onPress={applyAllSettings}
//           >
//             <CustomText style={styles.actionButtonText}>
//               {isActive ? 'به‌روزرسانی' : 'شروع پخت'}
//             </CustomText>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
