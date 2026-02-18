// src / screens / SetupGuideScreen / SetupGuideScreen.tsx;
import React from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/themeContext';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RouteProps';
import CustomText from '../../components/customText';
import { Devices } from '../../constant/devices';
import { SafeAreaView } from 'react-native-safe-area-context';

type SetupGuideRouteProp = RouteProp<RootStackParamList, 'SetupGuideScreen'>;

export default function SetupGuideScreen() {
  const { theme } = useTheme();
  const { colors, typography } = theme;
  const { t } = useTranslation();
  const route = useRoute<SetupGuideRouteProp>();

  const device = route.params?.device as Devices | undefined;

  if (!device) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <CustomText
          style={{ color: colors.error, fontSize: 18, textAlign: 'center' }}
          weight="bold"
        >
          {t('No device selected')}
        </CustomText>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        {/* عنوان اصلی */}
        <CustomText
          style={[styles.screenHeader, { fontSize: typography.fontSize.xxl }]}
          weight="bold"
        >
          {t('Setup Guide for')} {device.name}
        </CustomText>

        <CustomText
          style={[styles.subtitle, { color: colors.textSecondary }]}
          weight="bold"
        >
          Model: {device.model} • {device.connectionType.toUpperCase()}
        </CustomText>

        {/* لیست گام‌های راهنما */}
        {device.setupGuide && device.setupGuide.length > 0 ? (
          device.setupGuide.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepNumberContainer}>
                <CustomText style={styles.stepNumber} weight="bold">
                  {index + 1}
                </CustomText>
              </View>

              <View style={styles.stepContent}>
                <Image
                  source={require('../../assets/icons/exclamationMark.png')}
                  style={styles.stepIcon}
                />
                <CustomText style={styles.stepText}>{step}</CustomText>
              </View>
            </View>
          ))
        ) : (
          <CustomText
            style={{
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: 40,
            }}
          >
            {t('No setup guide available for this device')}
          </CustomText>
        )}
      </ScrollView>
      <TouchableOpacity
        style={[styles.closeBtn, { backgroundColor: colors.primary }]}
        onPress={() => console.log()}
      >
        <CustomText
          style={{ color: colors.textPrimary, fontWeight: '600' }}
          children={t('Start connection')}
          weight="bold"
        ></CustomText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    height: '80%',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  screenHeader: {
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  stepNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF', // یا از theme.primary
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumber: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: '#FF9500', // رنگ هشدار
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333', // یا از theme.textPrimary
  },
  closeBtn: {
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '85%',
    marginHorizontal: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
