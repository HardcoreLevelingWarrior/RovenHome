import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../context/themeContext';
import { useApplicationStore } from '../../stores/ApplicationStore';
import DeviceConnectionService from '../../services/connection/DeviceConnectionService';
import CustomText from '../../components/customText';
import AlertModal from '../../components/AlertModal'

type OvenMode = 'off' | 'bake' | 'grill' | 'convection' | 'roast';

const MODE_ICONS = {
  bake: '🔥',
  grill: '🫕',
  convection: '♨️',
  roast: '🍖',
  off: '⏻',
};

interface RouteParams {
  deviceId: string;
}

export default function OvenControlScreen() {
  const route = useRoute();
  const { deviceId } = route.params as RouteParams;

  const { theme } = useTheme();
  const { colors } = theme;

  const store = useApplicationStore();
  const device = store.devices.find(d => d.id === deviceId);
  const isConnected = store.connectedIds.includes(deviceId);
  const lastMessage = store.lastMessages[deviceId] || '';

  const service = DeviceConnectionService.getInstance();

  // حالت‌های محلی
  const [mode, setMode] = useState<OvenMode>('off');
  const [targetTemp, setTargetTemp] = useState(180);
  const [timerMin, setTimerMin] = useState(30);

  // مقادیر واقعی دریافتی
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [remainingSec, setRemainingSec] = useState<number | null>(null);
  const [currentMode, setCurrentMode] = useState<OvenMode>('off');

  // اتصال خودکار
  useEffect(() => {
    if (!isConnected && device) {
      service.connect(device).catch(() => {
        Alert.alert('اتصال ناموفق', 'نمی‌توان به فر متصل شد');
        
       
      });
    }
  }, [deviceId, isConnected, device, service]);

  // Parse پیام دریافتی
  useEffect(() => {
    if (!lastMessage) return;

    console.log('[Oven RX]:', lastMessage);

    try {
      const parts = lastMessage.split('|');
      parts.forEach(p => {
        const [key, val] = p.split(':').map(s => s.trim());
        if (key === 'TEMP') setCurrentTemp(Number(val));
        if (key === 'TIMER') setRemainingSec(Number(val));
        if (key === 'MODE') {
          const m = val.toLowerCase() as OvenMode;
          if (['off', 'bake', 'grill', 'convection', 'roast'].includes(m)) {
            setCurrentMode(m);
            setMode(m);
          }
        }
      });
    } catch (e) {
      console.warn('Parse error:', e);
    }
  }, [lastMessage]);

  const send = (cmd: string) => {
    if (!isConnected) {
      Alert.alert('خطا', 'فر متصل نیست');
      return false;
    }
    return service.send(deviceId, cmd);
  };

  const applyAllSettings = () => {
    if (mode === 'off') {
      Alert.alert('انتخاب حالت', 'لطفاً یک حالت پخت انتخاب کنید');
      return;
    }

    const payload = JSON.stringify({
      mode: mode.toUpperCase(),
      temperature: targetTemp,
      timer_seconds: timerMin * 60,
    });

    send(payload);
    Alert.alert('ارسال شد', 'تنظیمات جدید به فر ارسال گردید');
  };

  const stopOven = () => {
    Alert.alert('توقف فر', 'آیا مطمئن هستید که می‌خواهید پخت را متوقف کنید؟', [
      { text: 'خیر', style: 'cancel' },
      {
        text: 'بله، توقف',
        style: 'destructive',
        onPress: () => send('STOP'),
      },
    ]);
  };

  if (!device) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 18,
            textAlign: 'center',
            marginTop: 100,
          }}
        >
          دستگاه یافت نشد
        </Text>
      </SafeAreaView>
    );
  }

  const stopCooking = () => {
    Alert.alert('توقف فر', 'آیا مطمئن هستید که می‌خواهید پخت را متوقف کنید؟', [
      { text: 'خیر', style: 'cancel' },
      {
        text: 'بله، توقف',
        style: 'destructive',
        onPress: () => send('STOP'),
      },
    ]);
  };

  const isActive = currentMode !== 'off' && remainingSec && remainingSec > 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* هدر */}
        <View style={styles.header}>
          <CustomText style={styles.title}>
            {device.name || 'فر برقی هوشمند'}
          </CustomText>
          <View
            style={[
              styles.connectionIndicator,
              {
                backgroundColor: isConnected ? colors.success : colors.warning,
              },
            ]}
          >
            <Text style={styles.connectionText}>
              {isConnected ? 'متصل' : 'قطع'}
            </Text>
          </View>
        </View>

        {/* کارت وضعیت realtime */}
        <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>دمای فعلی</Text>
              <Text
                style={[
                  styles.statusBigValue,
                  currentTemp != null &&
                    currentTemp > 200 && { color: colors.warning },
                ]}
              >
                {currentTemp !== null ? `${currentTemp}°` : '—'}
              </Text>
            </View>

            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>زمان باقی‌مانده</Text>
              <Text style={styles.statusBigValue}>
                {remainingSec !== null
                  ? `${Math.floor(remainingSec / 60)}:${(remainingSec % 60)
                      .toString()
                      .padStart(2, '0')}`
                  : '—'}
              </Text>
            </View>

            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>حالت</Text>
              <Text style={[styles.statusBigValue, { color: colors.primary }]}>
                {currentMode === 'off' ? 'خاموش' : currentMode}
              </Text>
            </View>
          </View>

          {isActive && (
            <Text style={styles.activeNotice}>
              فر در حال پخت است • {currentTemp}°C
            </Text>
          )}
        </View>

        {/* انتخاب حالت پخت */}
        <Text style={styles.sectionTitle}>حالت پخت</Text>
        <View style={styles.modeGrid}>
          {(['bake', 'grill', 'convection', 'roast'] as OvenMode[]).map(m => (
            <TouchableOpacity
              key={m}
              activeOpacity={0.8}
              style={[
                styles.modeCard,
                mode === m && styles.modeCardSelected,
                { borderColor: colors.border },
              ]}
              onPress={() => setMode(m)}
            >
              <Text style={styles.modeIcon}>{MODE_ICONS[m]}</Text>
              <Text
                style={[
                  styles.modeLabel,
                  mode === m && { color: colors.primary, fontWeight: '700' },
                ]}
              >
                {m === 'bake'
                  ? 'پخت معمولی'
                  : m === 'grill'
                  ? 'گریل'
                  : m === 'convection'
                  ? 'با گردش هوا'
                  : 'کباب/روست'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* دمای هدف */}
        <Text style={styles.sectionTitle}>دمای هدف</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderValue}>{targetTemp} °C</Text>
          <Slider
            style={styles.slider}
            minimumValue={50}
            maximumValue={280}
            step={5}
            value={targetTemp}
            onValueChange={setTargetTemp}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
        </View>

        {/* تایمر */}
        <Text style={styles.sectionTitle}>زمان پخت (دقیقه)</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderValue}>{timerMin} دقیقه</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={240}
            step={1}
            value={timerMin}
            onValueChange={setTimerMin}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
        </View>

        {/* دکمه‌های اصلی (پایین صفحه) */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[styles.actionButton, styles.stopButton]}
            onPress={stopCooking}
            disabled={!isActive}
          >
            <Text style={styles.actionButtonText}>توقف</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.startButton]}
            onPress={applyAllSettings}
          >
            <Text style={styles.actionButtonText}>
              {isActive ? 'به‌روزرسانی تنظیمات' : 'شروع پخت'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // فضای کافی برای action bar پایین
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  connectionIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  connectionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 6,
  },
  statusBigValue: {
    fontSize: 26,
    fontWeight: '700',
  },
  activeNotice: {
    textAlign: 'center',
    marginTop: 12,
    color: '#f59e0b',
    fontWeight: '600',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  modeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  modeCard: {
    width: '48%',
    paddingVertical: 20,
    borderWidth: 1.5,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  modeCardSelected: {
    borderWidth: 2.5,
    backgroundColor: 'rgba(59,130,246,0.08)',
  },
  modeIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  modeLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  sliderContainer: {
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  sliderValue: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  actionBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  startButton: {
    backgroundColor: '#10b981',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
});
