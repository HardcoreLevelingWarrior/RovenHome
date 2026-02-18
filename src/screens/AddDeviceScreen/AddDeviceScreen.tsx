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
        children={t('Add device based on :')}
        style={[styles.screenHeader, { fontSize: typography.fontSize.xxl }]}
        // weight="bold"
      ></CustomText>
      <ConfigBox
        header={t('Select based on device brand')}
        description={t('adding devices based on the device brand and model ')}
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
