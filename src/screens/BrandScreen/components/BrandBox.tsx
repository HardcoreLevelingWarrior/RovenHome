import react from 'react';
import {
  TouchableOpacity,
  Text,
  ImageSourcePropType,
  Image,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';

import { useTheme } from '../../../context/themeContext';
import CustomText from '../../../components/customText';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface Props {
  avatar: ImageSourcePropType;
  onClick: (item: any) => void;
}

function BrandBox({ avatar, onClick }: Props) {
  const { theme } = useTheme();
  const { colors, typography, shadows } = theme;
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.surface, ...shadows.large },
      ]}
      onPress={onClick}
    >
      <Image source={avatar} style={styles.brandLogo}></Image>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    width: width * 0.3,
    // width: '40%',
    height: width * 0.3,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 16,
    elevation: 5,
    zIndex: 5,
    marginTop: 20,
    padding: 15,
  },
  brandLogo: {
    width: '90%',
    height: '90%',
  },
  textBox: {
    marginTop: 20,
  },
});

export default BrandBox;
