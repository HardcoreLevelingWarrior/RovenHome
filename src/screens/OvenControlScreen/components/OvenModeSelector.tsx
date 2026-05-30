import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { useTheme } from '../../../context/themeContext';
import { useTranslation } from 'react-i18next';
import CustomText from '../../../components/customText';

// به روز رسانی نوع برای حالت‌های جدید
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

interface OvenModeSelectorProps {
  mode: OvenMode;
  setMode: (mode: OvenMode) => void;
}

const MODE_CONFIG: Record<
  OvenMode,
  { icon: string; labelKey: string; glowColor: string }
> = {
  off: { icon: '⏻', labelKey: 'oven-mode.off', glowColor: '#9E9E9E' },
  bake: { icon: '🔥', labelKey: 'oven-mode.bake', glowColor: '#FF9800' },
  grill: { icon: '🫕', labelKey: 'oven-mode.grill', glowColor: '#F44336' },
  convection: {
    icon: '♨️',
    labelKey: 'oven-mode.convection',
    glowColor: '#2196F3',
  },
  roast: { icon: '🍖', labelKey: 'oven-mode.roast', glowColor: '#528912' },
  pizza: { icon: '🍕', labelKey: 'oven-mode.pizza', glowColor: '#E91E63' },
  pasta: { icon: '🍝', labelKey: 'oven-mode.pasta', glowColor: '#c79d1f' },
  cake: { icon: '🎂', labelKey: 'oven-mode.cake', glowColor: '#FF69B4' },
  pasty: { icon: '🥧', labelKey: 'oven-mode.pasty', glowColor: '#8c5723' },
  frozen: { icon: '❄️', labelKey: 'oven-mode.frozen', glowColor: '#00BCD4' },
  fish: { icon: '🐟', labelKey: 'oven-mode.fish', glowColor: '#03A9F4' },
  redmeat: { icon: '🥩', labelKey: 'oven-mode.redmeat', glowColor: '#D32F2F' },
  chicken: { icon: '🍗', labelKey: 'oven-mode.chicken', glowColor: '#db942a' },
  redmeatchop: {
    icon: '🍖',
    labelKey: 'oven-mode.redmeatchop',
    glowColor: '#B71C1C',
  },
  chickenchop: {
    icon: '🍗',
    labelKey: 'oven-mode.chickenchop',
    glowColor: '#F57C00',
  },
  fishchop: {
    icon: '🐟',
    labelKey: 'oven-mode.fishchop',
    glowColor: '#0288D1',
  },
};

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = (width - 48) / 2.8;
const SCROLL_PADDING = 16;

const OvenModeSelector: React.FC<OvenModeSelectorProps> = ({
  mode,
  setMode,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);
  const scaleAnims = useRef<Record<string, Animated.Value>>(
    Object.keys(MODE_CONFIG).reduce(
      (acc, key) => ({ ...acc, [key]: new Animated.Value(1) }),
      {} as Record<string, Animated.Value>,
    ),
  ).current;

  const handlePressIn = (key: string) => {
    Animated.spring(scaleAnims[key], {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 200,
    }).start();
  };

  const handlePressOut = (key: string) => {
    Animated.spring(scaleAnims[key], {
      toValue: 1,
      useNativeDriver: true,
      speed: 200,
    }).start();
  };

  const handlePress = (key: OvenMode) => {
    setMode(key);
  };

  return (
    <View style={styles.container}>
      <CustomText style={[styles.title, { color: colors.textPrimary }]}>
        {t('oven-mode.cooking-mode')}
      </CustomText>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={BUTTON_WIDTH + 12}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {(Object.keys(MODE_CONFIG) as OvenMode[]).map(key => {
          const config = MODE_CONFIG[key];
          const isActive = mode === key;
          return (
            <Animated.View
              key={key}
              style={[
                styles.buttonWrapper,
                {
                  transform: [{ scale: scaleAnims[key] }],
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPressIn={() => handlePressIn(key)}
                onPressOut={() => handlePressOut(key)}
                onPress={() => handlePress(key)}
                style={[
                  styles.modeButton,
                  {
                    backgroundColor: isActive
                      ? colors.primary + '15'
                      : colors.surface,
                    borderColor: isActive ? config.glowColor : colors.border,
                    borderWidth: 1.5,
                  },
                ]}
              >
                <View style={styles.iconContainer}>
                  <CustomText style={styles.icon}>{config.icon}</CustomText>
                </View>
                <CustomText
                  style={[
                    styles.label,
                    {
                      color: isActive ? config.glowColor : colors.textSecondary,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {t(config.labelKey)}
                </CustomText>
                {isActive && (
                  <View
                    style={[
                      styles.activeGlow,
                      { backgroundColor: config.glowColor + '40' },
                    ]}
                  />
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
    marginLeft: 4,
    letterSpacing: -0.3,
  },
  scrollContent: {
    paddingHorizontal: SCROLL_PADDING,
    paddingVertical: 3,
    gap: 12,
    alignItems: 'center',
  },
  buttonWrapper: {
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 40,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
    gap: 10,
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 15,
    letterSpacing: 0.2,
  },
  activeGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
});

export default OvenModeSelector;
