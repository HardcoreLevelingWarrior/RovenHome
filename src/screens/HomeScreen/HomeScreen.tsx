import { View, FlatList, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/themeContext';

import Header from '../../components/Header';
import AddDeviceButton from '../../components/AddDeviceButton';
import CustomText from '../../components/customText';
import { useEffect } from 'react';
import { usePairingStore } from '../../stores/pairingStore';
import TcpSocket from 'react-native-tcp-socket';

function HomeScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { colors, typography } = theme;
  const { devices, updateDeviceStatus } = usePairingStore();

  useEffect(() => {
    const checkOnline = () => {
      devices.forEach(dev => {
        const client = TcpSocket.createConnection(
          { host: dev.ip, port: dev.port },
          () => {
            updateDeviceStatus(dev.id, 'online');
            client.destroy();
          },
        );
        client.on('error', () => updateDeviceStatus(dev.id, 'offline'));
        client.on('close', () => {});
      });
    };
    checkOnline();
    const interval = setInterval(checkOnline, 15000);
    return () => {
      clearInterval(interval);
      devices.forEach(dev => updateDeviceStatus(dev.id, 'offline'));
    };
  }, [devices.length]);
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
      <Text>{JSON.stringify(devices)}</Text>
      <FlatList
        data={devices}
        renderItem={({ item }) => (
          <Text>
            {item.name} - {item.ip} - وضعیت: {item.status}
          </Text>
        )}
      />

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
