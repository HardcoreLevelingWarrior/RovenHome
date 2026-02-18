import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/themeContext';
import CustomText from './customText';

interface Props {
  headerText: string;
  brandName?: string;
}

function Header({ headerText, brandName }: Props) {
  const { theme } = useTheme();
  const { colors, typography, shadows } = theme;
  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: colors.surface, ...shadows.small },
      ]}
    >
      <CustomText
        style={[
          styles.headerText,
          {
            fontSize: typography.fontSize.xxxxl,
            color: colors.textPrimary,
            paddingTop: 14,
          },
        ]}
        children={brandName ? brandName : headerText}
        weight="bold"
      ></CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 0,
    paddingHorizontal: 16,
    paddingBottom: 10,
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: '90%',
    marginHorizontal: 'auto',
  },
  headerText: {
    fontSize: 30,
    textAlign: 'center',
  },
  icon: {
    width: '70%',
    height: '70%',
  },
});
export default Header;
