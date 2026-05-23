// // // src/screens/PickDeviceScreen/components/DeviceBox.tsx
import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../../context/themeContext';
import CustomText from '../../../components/customText';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2; // 48 = مجموع حاشیه‌های چپ و راست

interface Props {
  avatar: any;
  itemName: string;
  itemModel: string;
  onPress: () => void;
}

function DeviceBox({ avatar, itemName, itemModel, onPress }: Props) {
  const { theme } = useTheme();
  const { colors, shadows } = theme;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.deviceCard,
        {
          backgroundColor: colors.surface,
          ...shadows.medium,
          width: itemWidth, // ← عرض ثابت و دقیق
        },
      ]}
    >
      <Image source={avatar} style={styles.deviceImage} />
      <CustomText
        weight="regular"
        style={[styles.deviceText, { color: colors.textPrimary }]}
      >
        {itemName}
      </CustomText>
      <CustomText
        weight="regular"
        style={[styles.deviceText, { color: colors.textPrimary }]}
      >
        {itemModel}
      </CustomText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deviceCard: {
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16, // فاصله بین ردیف‌ها
  },
  deviceImage: {
    width: '75%',
    height: 85,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  deviceText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default DeviceBox;
// import React from 'react';
// import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
// import { useTheme } from '../../../context/themeContext';
// import CustomText from '../../../components/customText';

// const { width } = Dimensions.get('window');
// const itemWidth = (width - 48) / 2; // دو ستون با حاشیه

// interface Props {
//   avatar: any;
//   text: string;
//   onPress: () => void;
// }

// function DeviceBox({ avatar, text, onPress }: Props) {
//   const { theme } = useTheme();
//   const { colors, shadows } = theme;

//   return (
//     <TouchableOpacity
//       activeOpacity={0.8}
//       onPress={onPress}
//       style={[
//         styles.deviceCard,
//         {
//           backgroundColor: colors.surface,
//           ...shadows.medium,
//         },
//       ]}
//     >
//       <Image source={avatar} style={styles.deviceImage} />
//       <CustomText
//         weight="regular"
//         style={[styles.deviceText, { color: colors.textPrimary }]}
//       >
//         {text}
//       </CustomText>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   deviceCard: {
//     flex: 1, // 👈 اضافه کنید
//     borderRadius: 16,
//     padding: 12,
//     alignItems: 'center',
//     marginHorizontal: 8,
//   },
//   deviceImage: {
//     width: '80%',
//     height: 80,
//     resizeMode: 'contain',
//     marginBottom: 12,
//   },
//   deviceText: {
//     fontSize: 12,
//     textAlign: 'center',
//   },
// });

// export default DeviceBox;
