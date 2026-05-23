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
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../../navigation/Routes';

import { useTheme } from '../../../context/themeContext';
import CustomText from '../../../components/customText';
import { useTranslation } from 'react-i18next';

interface Props {
  header: string;
  description: string;
}

function ConfigBox({ header, description }: Props) {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const { colors, typography, shadows } = theme;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.surface, ...shadows.large },
      ]}
      onPress={() => navigation.navigate(Routes.BrandScreen)}
    >
      <CustomText
        style={[
          styles.textBox,
          {
            color: colors.textPrimary,
            fontSize: typography.fontSize.xl,
            width: '100%',
          },
        ]}
        children={header}
        weight="bold"
      ></CustomText>

      <CustomText
        style={[
          styles.textBox,
          {
            color: colors.textPrimary,
            fontSize: typography.fontSize.xl,
            marginBottom: 20,
          },
        ]}
        children={description}
      ></CustomText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 'auto',
    width: '90%',
    // width: '40%',
    // height: width * 0.5,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 16,
    elevation: 5,
    zIndex: 5,
    marginTop: 20,
    padding: 15,
  },
  textBox: {
    marginTop: 20,
  },
});

export default ConfigBox;
