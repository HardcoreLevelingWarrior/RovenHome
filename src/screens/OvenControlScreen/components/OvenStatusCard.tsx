// components/OvenStatusCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from '../../../components/customText';
import { useTheme } from '../../../context/themeContext';
import { useTranslation } from 'react-i18next';

interface OvenStatusCardProps {
  lastMessage: string;
  currentTemp?: number | null;
  remainingTime?: number | null;
  currentMode?: string;
}

export default function OvenStatusCard({
  lastMessage,
  currentTemp,
  remainingTime,
  currentMode,
}: OvenStatusCardProps) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { t } = useTranslation();

  // پارس کردن پیام دریافتی
  const parsed = React.useMemo(() => {
    if (!lastMessage) return {};

    const data: any = {};
    const parts = lastMessage.split('|');

    parts.forEach(part => {
      const [key, value] = part.split(':').map(s => s.trim());
      if (key && value) {
        data[key] = value;
      }
    });

    return data;
  }, [lastMessage]);

  const temp = currentTemp ?? parsed.TEMP;
  const time = remainingTime ?? parsed.TIMER;
  const mode = currentMode ?? parsed.MODE;

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <CustomText style={[styles.cardTitle, { color: colors.textPrimary }]}>
        {t('oven-control-screen.current-status')}
      </CustomText>

      <View style={styles.grid}>
        <View style={styles.item}>
          <CustomText style={[styles.label, { color: colors.textSecondary }]}>
            {t('oven-control-screen.current-temprature')}
          </CustomText>
          <CustomText style={[styles.value, { color: colors.textPrimary }]}>
            {temp ? `${temp}°C` : '—'}
          </CustomText>
        </View>

        <View style={styles.item}>
          <CustomText style={[styles.label, { color: colors.textSecondary }]}>
            {t('oven-control-screen.remaining-time')}
          </CustomText>
          <CustomText style={[styles.value, { color: colors.textPrimary }]}>
            {time
              ? `${Math.floor(Number(time) / 60)}:${(Number(time) % 60)
                  .toString()
                  .padStart(2, '0')}`
              : '—'}
          </CustomText>
        </View>

        <View style={styles.item}>
          <CustomText style={[styles.label, { color: colors.textSecondary }]}>
            {t('oven-control-screen.current-state')}
          </CustomText>
          <CustomText
            style={[
              styles.value,
              styles.modeText,
              { color: colors.primary || '#0066cc' },
            ]}
          >
            {mode ? mode.toUpperCase() : '—'}
          </CustomText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    // marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
  modeText: {
    // رنگ از تم گرفته می‌شود
  },
});
