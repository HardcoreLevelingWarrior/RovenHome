import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../../context/themeContext';
import { useApplicationStore } from '../../stores/ApplicationStore';
import DeviceConnectionService from '../../services/connection/DeviceConnectionService';
import CustomText from '../../components/customText';

const { width } = Dimensions.get('window');

type BurnerPosition = 'frontLeft' | 'frontRight' | 'backLeft' | 'backRight';
type BurnerLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface Burner {
  position: BurnerPosition;
  level: BurnerLevel;
  isOn: boolean;
  timerSeconds: number;
  timerRemaining: number;
  timerActive: boolean;
}

interface RouteParams {
  deviceId: string;
}

const BURNER_NAMES = {
  frontLeft: 'جلو چپ',
  frontRight: 'جلو راست',
  backLeft: 'عقب چپ',
  backRight: 'عقب راست',
};

const BURNER_ICONS = {
  frontLeft: '🟠',
  frontRight: '🔴',
  backLeft: '🟡',
  backRight: '🟢',
};

// تایپ برای setTimeout/clearTimeout به جای NodeJS
type TimerId = ReturnType<typeof setTimeout>;

export default function StoveControlScreen() {
  const route = useRoute();
  const { deviceId } = route.params as RouteParams;

  const { theme } = useTheme();
  const { colors } = theme;

  const store = useApplicationStore();
  const device = store.devices.find(d => d.id === deviceId);
  const isConnected = store.connectedIds.includes(deviceId);
  const lastMessage = store.lastMessages[deviceId] || '';

  const service = DeviceConnectionService.getInstance();

  // State for each burner
  const [burners, setBurners] = useState<Burner[]>([
    {
      position: 'frontLeft',
      level: 0,
      isOn: false,
      timerSeconds: 0,
      timerRemaining: 0,
      timerActive: false,
    },
    {
      position: 'frontRight',
      level: 0,
      isOn: false,
      timerSeconds: 0,
      timerRemaining: 0,
      timerActive: false,
    },
    {
      position: 'backLeft',
      level: 0,
      isOn: false,
      timerSeconds: 0,
      timerRemaining: 0,
      timerActive: false,
    },
    {
      position: 'backRight',
      level: 0,
      isOn: false,
      timerSeconds: 0,
      timerRemaining: 0,
      timerActive: false,
    },
  ]);

  // Custom timer input states
  const [customTimerMinutes, setCustomTimerMinutes] = useState<{
    [key: string]: string;
  }>({});
  const [showCustomInput, setShowCustomInput] = useState<{
    [key: string]: boolean;
  }>({});

  // Timer interval refs - استفاده از number به جای NodeJS.Timeout
  const timerIntervals = useRef<{ [key: string]: number }>({});

  // Auto connect
  useEffect(() => {
    if (!isConnected && device) {
      service.connect(device).catch(() => {
        Alert.alert('اتصال ناموفق', 'نمی‌توان به اجاق گاز متصل شد');
      });
    }
  }, [deviceId, isConnected, device, service]);

  // Parse incoming messages
  useEffect(() => {
    if (!lastMessage) return;

    console.log('[Stove RX]:', lastMessage);

    try {
      const parts = lastMessage.split('|');
      parts.forEach(p => {
        const [key, val] = p.split(':').map(s => s.trim());

        // Format: BURNER_FRONTLEFT:LEVEL:5
        if (key.startsWith('BURNER_')) {
          const burnerKey = key.replace('BURNER_', '').toLowerCase();
          const [position, prop] = burnerKey.split('_');

          const fullPosition =
            position === 'front' && prop === 'left'
              ? 'frontLeft'
              : position === 'front' && prop === 'right'
              ? 'frontRight'
              : position === 'back' && prop === 'left'
              ? 'backLeft'
              : position === 'back' && prop === 'right'
              ? 'backRight'
              : null;

          if (fullPosition) {
            setBurners(prev =>
              prev.map(b =>
                b.position === fullPosition
                  ? {
                      ...b,
                      level: Number(val) as BurnerLevel,
                      isOn: Number(val) > 0,
                    }
                  : b,
              ),
            );
          }
        }

        // Timer status: TIMER_FRONTLEFT:300 (seconds remaining)
        if (key.startsWith('TIMER_')) {
          const timerKey = key.replace('TIMER_', '').toLowerCase();
          const [position, rest] = timerKey.split('_');
          const fullPosition =
            position === 'front' && rest === 'left'
              ? 'frontLeft'
              : position === 'front' && rest === 'right'
              ? 'frontRight'
              : position === 'back' && rest === 'left'
              ? 'backLeft'
              : position === 'back' && rest === 'right'
              ? 'backRight'
              : null;

          if (fullPosition) {
            const remaining = Number(val);
            setBurners(prev =>
              prev.map(b =>
                b.position === fullPosition
                  ? {
                      ...b,
                      timerRemaining: remaining,
                      timerActive: remaining > 0,
                    }
                  : b,
              ),
            );
          }
        }
      });
    } catch (e) {
      console.warn('Parse error:', e);
    }
  }, [lastMessage]);

  // Handle timer countdown
  useEffect(() => {
    burners.forEach(burner => {
      if (burner.timerActive && burner.timerRemaining > 0) {
        if (!timerIntervals.current[burner.position]) {
          const intervalId = setInterval(() => {
            setBurners(prev =>
              prev.map(b => {
                if (b.position === burner.position && b.timerRemaining > 0) {
                  const newRemaining = b.timerRemaining - 1;
                  if (newRemaining <= 0) {
                    // Timer finished - turn off burner
                    if (timerIntervals.current[burner.position]) {
                      clearInterval(timerIntervals.current[burner.position]);
                      delete timerIntervals.current[burner.position];
                    }
                    send(`BURNER_${getBurnerKey(b.position)}:OFF`);
                    return {
                      ...b,
                      level: 0,
                      isOn: false,
                      timerRemaining: 0,
                      timerActive: false,
                    };
                  }
                  return { ...b, timerRemaining: newRemaining };
                }
                return b;
              }),
            );
          }, 1000) as unknown as number;

          timerIntervals.current[burner.position] = intervalId;
        }
      } else if (
        !burner.timerActive &&
        timerIntervals.current[burner.position]
      ) {
        clearInterval(timerIntervals.current[burner.position]);
        delete timerIntervals.current[burner.position];
      }
    });

    return () => {
      Object.values(timerIntervals.current).forEach(clearInterval);
    };
  }, [burners]);

  const getBurnerKey = (position: BurnerPosition): string => {
    switch (position) {
      case 'frontLeft':
        return 'FRONT_LEFT';
      case 'frontRight':
        return 'FRONT_RIGHT';
      case 'backLeft':
        return 'BACK_LEFT';
      case 'backRight':
        return 'BACK_RIGHT';
      default:
        return '';
    }
  };

  const send = (cmd: string) => {
    if (!isConnected) {
      Alert.alert('خطا', 'اجاق گاز متصل نیست');
      return false;
    }
    return service.send(deviceId, cmd);
  };

  const updateBurnerLevel = (position: BurnerPosition, level: BurnerLevel) => {
    const burner = burners.find(b => b.position === position);
    if (!burner) return;

    const newLevel = level;
    const isOn = newLevel > 0;

    setBurners(prev =>
      prev.map(b =>
        b.position === position ? { ...b, level: newLevel, isOn } : b,
      ),
    );

    send(`BURNER_${getBurnerKey(position)}:LEVEL:${newLevel}`);
  };

  const setBurnerTimer = (position: BurnerPosition, seconds: number) => {
    if (seconds <= 0) {
      // Cancel timer
      setBurners(prev =>
        prev.map(b =>
          b.position === position
            ? { ...b, timerSeconds: 0, timerRemaining: 0, timerActive: false }
            : b,
        ),
      );
      send(`TIMER_${getBurnerKey(position)}:0`);
      return;
    }

    setBurners(prev =>
      prev.map(b =>
        b.position === position
          ? {
              ...b,
              timerSeconds: seconds,
              timerRemaining: seconds,
              timerActive: true,
            }
          : b,
      ),
    );

    send(`TIMER_${getBurnerKey(position)}:${seconds}`);
    setShowCustomInput(prev => ({ ...prev, [position]: false }));
  };

  const turnOffBurner = (position: BurnerPosition) => {
    Alert.alert(
      'خاموش کردن شعله',
      `آیا مطمئن هستید می‌خواهید ${BURNER_NAMES[position]} را خاموش کنید؟`,
      [
        { text: 'خیر', style: 'cancel' },
        {
          text: 'بله، خاموش کن',
          onPress: () => {
            setBurners(prev =>
              prev.map(b =>
                b.position === position
                  ? {
                      ...b,
                      level: 0,
                      isOn: false,
                      timerActive: false,
                      timerRemaining: 0,
                    }
                  : b,
              ),
            );
            send(`BURNER_${getBurnerKey(position)}:OFF`);
            send(`TIMER_${getBurnerKey(position)}:0`);
          },
        },
      ],
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage for linear timer
  const getTimerProgress = (burner: Burner): number => {
    if (!burner.timerActive || burner.timerSeconds === 0) return 0;
    return (
      ((burner.timerSeconds - burner.timerRemaining) / burner.timerSeconds) *
      100
    );
  };

  const handleCustomTimerSubmit = (position: BurnerPosition) => {
    const minutesStr = customTimerMinutes[position];
    if (minutesStr) {
      const minutes = parseInt(minutesStr, 10);
      if (!isNaN(minutes) && minutes > 0) {
        setBurnerTimer(position, minutes * 60);
      } else {
        Alert.alert('خطا', 'لطفاً یک عدد معتبر وارد کنید');
      }
    }
    setCustomTimerMinutes(prev => ({ ...prev, [position]: '' }));
    setShowCustomInput(prev => ({ ...prev, [position]: false }));
  };

  const renderBurnerCard = (burner: Burner) => {
    const showInput = showCustomInput[burner.position] || false;

    return (
      <View
        key={burner.position}
        style={[styles.burnerCard, { backgroundColor: colors.card }]}
      >
        <View style={styles.burnerHeader}>
          <Text style={styles.burnerIcon}>{BURNER_ICONS[burner.position]}</Text>
          <CustomText
            style={[styles.burnerName, { color: colors.textPrimary }]}
          >
            {BURNER_NAMES[burner.position]}
          </CustomText>
        </View>

        {/* Flame level buttons */}
        <View style={styles.levelContainer}>
          <CustomText
            style={[styles.levelLabel, { color: colors.textSecondary }]}
          >
            قدرت شعله
          </CustomText>
          <View style={styles.levelButtons}>
            {([0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as BurnerLevel[]).map(level => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  { backgroundColor: colors.surface },
                  burner.level === level && { backgroundColor: colors.primary },
                  level === 0 &&
                    burner.level === 0 && { backgroundColor: colors.error },
                ]}
                onPress={() => updateBurnerLevel(burner.position, level)}
              >
                <CustomText
                  style={[
                    styles.levelButtonText,
                    { color: colors.textPrimary },
                    burner.level === level && { color: '#fff' },
                  ]}
                >
                  {level === 0 ? '●' : level}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Timer Section */}
        <View style={styles.timerContainer}>
          <CustomText
            style={[styles.timerLabel, { color: colors.textSecondary }]}
          >
            ⏱️ تایمر خطی
          </CustomText>

          {/* Timer preset buttons */}
          <View style={styles.timerPresets}>
            {[5, 10, 15, 30, 60].map(mins => (
              <TouchableOpacity
                key={mins}
                style={[
                  styles.timerPreset,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() => setBurnerTimer(burner.position, mins * 60)}
              >
                <CustomText
                  style={[
                    styles.timerPresetText,
                    { color: colors.textPrimary },
                  ]}
                >
                  {mins} min
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom timer input */}
          {!showInput ? (
            <TouchableOpacity
              style={[
                styles.customTimerButton,
                { backgroundColor: colors.surface },
              ]}
              onPress={() =>
                setShowCustomInput(prev => ({
                  ...prev,
                  [burner.position]: true,
                }))
              }
            >
              <CustomText
                style={[
                  styles.customTimerButtonText,
                  { color: colors.textPrimary },
                ]}
              >
                ✏️ تنظیم دلخواه
              </CustomText>
            </TouchableOpacity>
          ) : (
            <View style={styles.customInputContainer}>
              <TextInput
                style={[
                  styles.customInput,
                  {
                    backgroundColor: colors.surface,
                    color: colors.textPrimary,
                  },
                ]}
                placeholder="دقیقه"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                value={customTimerMinutes[burner.position] || ''}
                onChangeText={(text: string) =>
                  setCustomTimerMinutes(prev => ({
                    ...prev,
                    [burner.position]: text,
                  }))
                }
              />
              <View style={styles.customInputButtons}>
                <TouchableOpacity
                  style={[
                    styles.customInputButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => handleCustomTimerSubmit(burner.position)}
                >
                  <CustomText style={styles.customInputButtonText}>
                    تنظیم
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.customInputButton,
                    { backgroundColor: colors.error },
                  ]}
                  onPress={() => {
                    setShowCustomInput(prev => ({
                      ...prev,
                      [burner.position]: false,
                    }));
                    setCustomTimerMinutes(prev => ({
                      ...prev,
                      [burner.position]: '',
                    }));
                  }}
                >
                  <CustomText style={styles.customInputButtonText}>
                    لغو
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Timer display and controls */}
          <View style={styles.customTimerRow}>
            <TouchableOpacity
              style={[styles.timerControl, { backgroundColor: colors.surface }]}
              onPress={() => {
                const newTime = Math.max(0, burner.timerSeconds - 60);
                setBurnerTimer(burner.position, newTime);
              }}
            >
              <Text style={styles.timerControlText}>-1min</Text>
            </TouchableOpacity>

            <View
              style={[styles.timerDisplay, { backgroundColor: colors.surface }]}
            >
              <CustomText
                style={[styles.timerDisplayText, { color: colors.primary }]}
              >
                {burner.timerActive
                  ? formatTime(burner.timerRemaining)
                  : '00:00'}
              </CustomText>
            </View>

            <TouchableOpacity
              style={[styles.timerControl, { backgroundColor: colors.surface }]}
              onPress={() => {
                const newTime = burner.timerSeconds + 60;
                setBurnerTimer(burner.position, newTime);
              }}
            >
              <Text style={styles.timerControlText}>+1min</Text>
            </TouchableOpacity>
          </View>

          {/* Linear progress bar */}
          {burner.timerActive && burner.timerSeconds > 0 && (
            <View style={styles.progressContainer}>
              <View
                style={[styles.progressBar, { backgroundColor: colors.border }]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getTimerProgress(burner)}%`,
                      backgroundColor:
                        burner.timerRemaining < 60
                          ? colors.error
                          : colors.primary,
                    },
                  ]}
                />
              </View>
              <CustomText
                style={[styles.progressText, { color: colors.textSecondary }]}
              >
                {Math.floor(getTimerProgress(burner))}% تکمیل
              </CustomText>
            </View>
          )}

          {/* Cancel timer button */}
          {burner.timerActive && (
            <TouchableOpacity
              style={[
                styles.cancelTimerButton,
                { backgroundColor: colors.error + '20' },
              ]}
              onPress={() => setBurnerTimer(burner.position, 0)}
            >
              <CustomText
                style={[styles.cancelTimerText, { color: colors.error }]}
              >
                ✖ لغو تایمر
              </CustomText>
            </TouchableOpacity>
          )}
        </View>

        {/* Turn off button */}
        {burner.isOn && (
          <TouchableOpacity
            style={[styles.offButton, { backgroundColor: colors.error }]}
            onPress={() => turnOffBurner(burner.position)}
          >
            <CustomText style={styles.offButtonText}>
              خاموش کردن شعله
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (!device) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <CustomText style={[styles.errorText, { color: colors.textPrimary }]}>
          دستگاه یافت نشد
        </CustomText>
      </SafeAreaView>
    );
  }

  const backBurners = burners.filter(
    b => b.position === 'backLeft' || b.position === 'backRight',
  );
  const frontBurners = burners.filter(
    b => b.position === 'frontLeft' || b.position === 'frontRight',
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <CustomText style={[styles.title, { color: colors.textPrimary }]}>
            {device.name || 'اجاق گاز هوشمند'}
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

        {/* Burners Grid */}
        <View style={styles.burnersGrid}>
          {/* Back burners */}
          <View style={styles.burnerRow}>
            {backBurners.map(burner => renderBurnerCard(burner))}
          </View>
          {/* Front burners */}
          <View style={styles.burnerRow}>
            {frontBurners.map(burner => renderBurnerCard(burner))}
          </View>
        </View>
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
  burnersGrid: { gap: 20 },
  burnerRow: { flexDirection: 'row', gap: 16, justifyContent: 'space-between' },
  burnerCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  burnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  burnerIcon: { fontSize: 28 },
  burnerName: { fontSize: 18, fontWeight: '600' },
  levelContainer: { marginBottom: 20 },
  levelLabel: { fontSize: 14, marginBottom: 8, textAlign: 'center' },
  levelButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  levelButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelButtonText: { fontSize: 14, fontWeight: '600' },
  timerContainer: { marginBottom: 16 },
  timerLabel: { fontSize: 14, marginBottom: 8, textAlign: 'center' },
  timerPresets: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  timerPreset: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerPresetText: { fontSize: 12 },
  customTimerButton: {
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  customTimerButtonText: { fontSize: 13 },
  customInputContainer: {
    marginBottom: 12,
  },
  customInput: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 8,
  },
  customInputButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  customInputButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  customInputButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  customTimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },
  timerControl: {
    width: 60,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  timerControlText: { fontSize: 14, fontWeight: '600' },
  timerDisplay: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  timerDisplayText: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  progressContainer: { marginTop: 8, marginBottom: 8 },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: { fontSize: 10, textAlign: 'center', marginTop: 4 },
  cancelTimerButton: {
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelTimerText: { fontSize: 12, fontWeight: '600' },
  offButton: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  offButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  errorText: { fontSize: 18, textAlign: 'center', marginTop: 100 },
});
