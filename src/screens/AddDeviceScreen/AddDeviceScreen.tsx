import { Text, View, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../context/themeContext';
import { useTranslation } from 'react-i18next';
import ConfigBox from './components/ConfigBox';
import CustomText from '../../components/customText';

function AddDeviceScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { colors, typography } = theme;
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomText
        children={t('add_device_screen.add_device_based_on')}
        style={[styles.screenHeader, { fontSize: typography.fontSize.xxl }]}
        // weight="bold"
      ></CustomText>
      <ConfigBox
        header={t('add_device_screen.select_based_on_device_brand')}
        description={t(
          'add_device_screen.adding_devices_based_on_the_device_brand_and_model',
        )}
      ></ConfigBox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  screenHeader: {
    textAlign: 'center',
    marginVertical: 35,
  },
});
export default AddDeviceScreen;
