import react from 'react';
import {
  TouchableOpacity,
  Text,
  ImageSourcePropType,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../navigation/Routes';
import AddDeviceScreen from '../screens/AddDeviceScreen/AddDeviceScreen';

const { width } = Dimensions.get('window');

interface Props {
  avatar: ImageSourcePropType;
  text: string;
}

function AddDeviceButton({ avatar, text }: Props) {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate(AddDeviceScreen)}
    >
      <Image style={styles.imageBox} source={avatar}></Image>
      <Text>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    marginHorizontal: 'auto',
    width: width * 0.4,
    height: width * 0.5,
    // width: '40%',
    // height: width * 0.5,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 5,
    zIndex: 5,
    left: width * 0.3,
    bottom: 120,
  },
  imageBox: {
    width: width * 0.3,
    height: width * 0.3,
  },
});

export default AddDeviceButton;

// import React from 'react';
// import {
//   TouchableOpacity,
//   StyleSheet,
//   ViewStyle,
//   Platform,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons'; // یا Ionicons / Feather
// // اگر از @expo/vector-icons استفاده می‌کنی: import { MaterialIcons } from '@expo/vector-icons';

// import { useTheme } from '../context/themeContext'; // مسیر رو با alias خودت تنظیم کن

// interface Props {
//   onPress: () => void;
//   style?: ViewStyle;
// }

// export default function AddDeviceButton({ onPress, style }: Props) {
//   // const { colors, shadows } = useTheme();

//   const { theme, isDark, toggleTheme } = useTheme();
//   const { colors, shadows, spacing } = theme;

//   return (
//     <TouchableOpacity
//       activeOpacity={0.8}
//       style={[
//         styles.fab,
//         {
//           backgroundColor: colors.primary,
//           ...shadows.medium, // از theme shadows استفاده می‌کنیم
//         },
//         style,
//       ]}
//       onPress={onPress}
//     >
//       <Icon name="add" size={28} color={colors.textPrimary} />
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   fab: {
//     // position: 'absolute',
//     // bottom: 80,
//     // right: 24,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // shadow و elevation رو از theme می‌گیریم، ولی fallback هم داریم
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: Platform.OS === 'android' ? 8 : 0,
//   },
// });
