import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/themeContext';

import Header from '../../components/Header';
import AddDeviceButton from '../../components/AddDeviceButton';
import CustomText from '../../components/customText';

function HomeScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { colors, typography } = theme;
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header headerText="Home" brandName={t('Roven')}></Header>
      <CustomText
        style={[
          {
            color: 'black',
            fontSize: typography.fontSize.xxxl,
            marginHorizontal: 10,
          },
        ]}
        children={t('Devices')}
      ></CustomText>
      <AddDeviceButton
        avatar={require('../../assets/images/wifiConfig.png')}
        text={t('Add Device')}
      ></AddDeviceButton>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
});
export default HomeScreen;
