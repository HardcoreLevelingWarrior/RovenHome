// // components/OvenPowerControl.tsx
// components/OvenPowerControl.tsx
import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { useTheme } from '../../../context/themeContext';
import CustomText from '../../../components/customText';
import { useTranslation } from 'react-i18next';

interface OvenPowerControlProps {
  isOn: boolean;
  setIsOn: (value: boolean) => void;
  sendCommand: (command: string) => boolean;
}

const OvenPowerControl: React.FC<OvenPowerControlProps> = ({
  isOn,
  setIsOn,
  sendCommand,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { t } = useTranslation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const togglePower = () => {
    const newState = !isOn;
    setIsOn(newState);
    const command = newState ? 'POWER_ON' : 'POWER_OFF';
    sendCommand(command);
  };

  // رنگ دایره وضعیت
  const statusColor = isOn ? colors.success : colors.error;
  const buttonBg = isOn ? colors.success + '20' : colors.error + '20'; // 20% opacity
  const shadowColor = isOn ? colors.success : colors.error;

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={togglePower}
          style={({ pressed }) => [
            styles.powerButton,
            {
              backgroundColor: buttonBg,
              borderColor: isOn ? colors.success : colors.error,
              borderWidth: 2,
              shadowColor: shadowColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: isOn ? 0.6 : 0.2,
              shadowRadius: isOn ? 12 : 8,
              elevation: isOn ? 8 : 4,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          {/* <View style={styles.iconContainer}>
            <CustomText style={styles.powerEmoji}>
              {isOn ? '🔴' : '⚫'}
            </CustomText>
          </View> */}
          <CustomText
            style={[styles.buttonText, { color: colors.textPrimary }]}
          >
            {isOn ? t('oven-control-screen.off') : t('oven-control-screen.on')}
          </CustomText>
        </Pressable>
      </Animated.View>

      {/* <CustomText style={[styles.hint, { color: colors.textSecondary }]}>
        {isOn
          ? 'در حال حاضر فر روشن است. با ضربه زدن می‌توانید آن را خاموش کنید.'
          : 'فر خاموش است. برای شروع پخت، آن را روشن کنید.'}
      </CustomText> */}
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <CustomText
          style={[styles.statusText, { color: colors.textSecondary }]}
        >
          {isOn
            ? t('oven-control-screen.the-device-is-on')
            : t('oven-control-screen.the-device-is-off')}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    paddingHorizontal: 24,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 30,
    // alignSelf: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  powerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 60,
    minWidth: 80,
    maxWidth: 120,
    height: 40,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hint: {
    marginTop: 20,
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default OvenPowerControl;

// import React from 'react';
// import { View, TouchableOpacity, StyleSheet } from 'react-native';
// import { useTheme } from '../../../context/themeContext';
// import CustomText from '../../../components/customText';

// interface OvenPowerControlProps {
//   isOn: boolean;
//   setIsOn: (value: boolean) => void;
//   // sendCommand: (command: string) => void | Promise<any>;
//   sendCommand: (command: string) => boolean;
// }

// const OvenPowerControl: React.FC<OvenPowerControlProps> = ({
//   isOn,
//   setIsOn,
//   sendCommand,
// }) => {
//   const { theme } = useTheme();
//   const { colors } = theme;

//   const togglePower = async () => {
//     const newState = !isOn;
//     // به‌روزرسانی optimistic
//     setIsOn(newState);
//     const command = newState ? 'POWER_ON' : 'POWER_OFF';
//     const result = sendCommand(command);
//   };

//   return (
//     <View style={styles.container}>
//       <CustomText style={[styles.label, { color: colors.textPrimary }]}>
//         وضعیت فر
//       </CustomText>
//       <TouchableOpacity
//         style={[
//           styles.powerButton,
//           {
//             backgroundColor: isOn ? colors.error : colors.success, // سبز = روشن، قرمز = خاموش
//             borderColor: colors.border,
//           },
//         ]}
//         onPress={togglePower}
//         activeOpacity={0.7}
//       >
//         <CustomText style={styles.emoji}>{isOn ? '🔴' : '⚫'}</CustomText>
//         <CustomText style={[styles.powerText, { color: colors.textOnPrimary }]}>
//           {isOn ? 'خاموش کردن' : 'روشن کردن'}
//         </CustomText>
//       </TouchableOpacity>
//       <CustomText style={[styles.hint, { color: colors.textSecondary }]}>
//         {isOn ? 'فر در حال کار است' : 'فر خاموش است'}
//       </CustomText>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     marginVertical: 16,
//     paddingHorizontal: 20,
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//   },
//   powerButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 40,
//     borderWidth: 1,
//     minWidth: 160,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   emoji: {
//     fontSize: 24,
//     marginRight: 12,
//   },
//   powerText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   hint: {
//     marginTop: 10,
//     fontSize: 14,
//     textAlign: 'center',
//   },
// });

// export default OvenPowerControl;
