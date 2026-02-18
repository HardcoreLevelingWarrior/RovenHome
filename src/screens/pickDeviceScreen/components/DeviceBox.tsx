// src/screens/PickDeviceScreen/components/DeviceBox.tsx
import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../../context/themeContext';
import CustomText from '../../../components/customText';

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2; // دو ستون با حاشیه

interface Props {
  avatar: any; // ImageSourcePropType یا { uri: string }
  text: string;
  onPress: () => void;
}

function DeviceBox({ avatar, text, onPress }: Props) {
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
          width: itemWidth,
        },
      ]}
    >
      <Image source={avatar} style={styles.deviceImage} />
      <CustomText
        weight="regular"
        style={[styles.deviceText, { color: colors.textPrimary }]}
      >
        {text}
      </CustomText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deviceCard: {
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  deviceImage: {
    width: itemWidth - 24, // کمی کوچکتر از کارت
    height: itemWidth - 24,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  deviceText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default DeviceBox;

// import react from 'react';
// import {
//   TouchableOpacity,
//   Text,
//   ImageSourcePropType,
//   Image,
//   StyleSheet,
//   Dimensions,
//   View,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Routes } from '../../../navigation/Routes';

// import { useTheme } from '../../../context/themeContext';
// import CustomText from '../../../components/customText';
// import { useTranslation } from 'react-i18next';
// import Icon from 'react-native-vector-icons/Ionicons';

// const { width } = Dimensions.get('window');
// const itemWidth = (width - 48) / 2; // دو ستون با حاشیه ۱۶ از هر طرف

// interface Props {
//   avatar: ImageSourcePropType;
//   text: string;
// }

// function DeviceBox({ avatar, text }: Props) {
//   const navigation = useNavigation<any>();
//   const { theme } = useTheme();
//   const { colors, typography, shadows } = theme;
//   const { t } = useTranslation();

//   return (
//     <TouchableOpacity
//       style={[
//         styles.deviceCard,
//         { backgroundColor: colors.surface, ...shadows.large },
//       ]}
//       // onPress={() => navigation.navigate(Routes.PickDeviceScreen)}
//     >
//       <Image source={avatar} style={styles.deviceImage}></Image>
//       <CustomText children={text}></CustomText>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     marginHorizontal: 20,
//     width: itemWidth,
//     // width: '40%',
//     height: itemWidth,
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     borderRadius: 16,
//     elevation: 5,
//     zIndex: 5,
//     // marginTop: 20,
//     // padding: 15,
//   },
//   brandLogo: {
//     width: '20%',
//     height: '20%',
//   },
//   textBox: {
//     marginTop: 20,
//   },
//   deviceCard: {
//     width: itemWidth,
//     borderRadius: 16,
//     padding: 12,
//     margin: 10,
//     alignItems: 'center',
//     elevation: 5,
//     zIndex: 5,
//   },
//   deviceImage: {
//     width: itemWidth / 2,
//     height: itemWidth / 2,
//     resizeMode: 'contain',
//     marginBottom: 12,
//   },
// });

// export default DeviceBox;
