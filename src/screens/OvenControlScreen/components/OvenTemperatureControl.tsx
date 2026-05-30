import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../../context/themeContext';
import { useTranslation } from 'react-i18next';
import CustomText from '../../../components/customText';

interface Props {
  temp: number;
  setTemp: (value: number) => void;
  minTemp?: number;
  maxTemp?: number;
  step?: number;
  currentTemp?: number; // دمای فعلی داخل فر (اختیاری)
}

const { width } = Dimensions.get('window');

function OvenTemperatureControl({
  temp,
  setTemp,
  minTemp = 50,
  maxTemp = 300,
  step = 5,
  currentTemp,
}: Props) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { t } = useTranslation();

  const increaseTemp = () => {
    if (temp + step <= maxTemp) {
      setTemp(temp + step);
    }
  };

  const decreaseTemp = () => {
    if (temp - step >= minTemp) {
      setTemp(temp - step);
    }
  };

  // درصد پیشرفت دما برای اسلایدر
  const progress = (temp - minTemp) / (maxTemp - minTemp);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <CustomText style={[styles.title, { color: colors.textPrimary }]}>
        {t('oven-temperature.target-temperature')}
      </CustomText>

      {currentTemp !== undefined && (
        <View style={styles.currentTempRow}>
          <CustomText
            style={[styles.currentTempLabel, { color: colors.textSecondary }]}
          >
            {t('oven-temperature.current')}
          </CustomText>
          <CustomText
            style={[styles.currentTempValue, { color: colors.primary }]}
          >
            {currentTemp}°C
          </CustomText>
        </View>
      )}
      <View style={styles.tempBox}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={decreaseTemp}
          activeOpacity={0.7}
        >
          <CustomText
            style={[styles.buttonText, { color: colors.textPrimary }]}
          >
            −
          </CustomText>
        </TouchableOpacity>
        <View style={styles.tempDisplay}>
          <CustomText style={[styles.tempValue, { color: colors.textPrimary }]}>
            {temp}
          </CustomText>
          <CustomText
            style={[styles.tempUnit, { color: colors.textSecondary }]}
          >
            °C
          </CustomText>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.primary, borderColor: colors.primary },
          ]}
          onPress={increaseTemp}
          activeOpacity={0.7}
        >
          <CustomText
            style={[styles.buttonText, { color: colors.textOnPrimary }]}
          >
            +
          </CustomText>
        </TouchableOpacity>
      </View>
      <View style={styles.sliderContainer}>
        <CustomText style={[styles.minTemp, { color: colors.textSecondary }]}>
          {minTemp}°
        </CustomText>
        <View style={styles.sliderWrapper}>
          <Slider
            style={styles.slider}
            minimumValue={minTemp}
            maximumValue={maxTemp}
            step={step}
            value={temp}
            onValueChange={setTemp}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
          <View
            style={[
              styles.progressTrack,
              {
                width: `${progress * 100}%`,
                backgroundColor: colors.primary + '20',
              },
            ]}
            pointerEvents="none"
          />
        </View>
        <CustomText style={[styles.maxTemp, { color: colors.textSecondary }]}>
          {maxTemp}°
        </CustomText>
      </View>

      <View style={styles.buttonsRow}>
        {/* <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={decreaseTemp}
          activeOpacity={0.7}
        >
          <CustomText
            style={[styles.buttonText, { color: colors.textPrimary }]}
          >
            −
          </CustomText>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.primary, borderColor: colors.primary },
          ]}
          onPress={increaseTemp}
          activeOpacity={0.7}
        >
          <CustomText
            style={[styles.buttonText, { color: colors.textOnPrimary }]}
          >
            +
          </CustomText>
        </TouchableOpacity> */}
      </View>

      <CustomText style={[styles.hint, { color: colors.textSecondary }]}>
        {t('oven-temperature.hint', { min: minTemp, max: maxTemp, step: step })}
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  currentTempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  currentTempLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  currentTempValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  tempDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 24,
  },
  tempBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempValue: {
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -1,
  },
  tempUnit: {
    fontSize: 24,
    fontWeight: '500',
    marginLeft: 4,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  minTemp: {
    fontSize: 14,
    width: 35,
  },
  sliderWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    height: 4,
    borderRadius: 2,
    bottom: 18,
    pointerEvents: 'none',
  },
  maxTemp: {
    fontSize: 14,
    width: 35,
    textAlign: 'right',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonText: {
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 40,
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.6,
  },
});

export default OvenTemperatureControl;
