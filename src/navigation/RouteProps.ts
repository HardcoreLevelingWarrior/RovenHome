import { Routes } from './Routes';
import { Brand, Devices } from '../constant/devices';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  [Routes.HomeScreen]: undefined;
  [Routes.Setting]: undefined;
  [Routes.AddDeviceScreen]: undefined;
  [Routes.DeviceScreen]: undefined;
  [Routes.PickDeviceScreen]: {
    brand: Brand;
  };
  [Routes.SetupGuideScreen]: {
    device: Devices;
  };
  [Routes.PairingScreen]: {
    device: Devices;
  };
  [Routes.OvenControlScreen]: {
    deviceId: string;
  };
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
