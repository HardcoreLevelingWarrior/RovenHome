import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import Header from '../../components/Header';
import AddDeviceButton from '../../components/AddDeviceButton';

function HomeScreen() {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <Header headerText="Home" brandName={t('Roven')}></Header>
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
    backgroundColor: '#F6F7FB',
    padding: 15,
  },
});
export default HomeScreen;
