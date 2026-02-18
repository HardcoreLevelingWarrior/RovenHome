import { Routes } from './Routes';
import { Brand, Devices } from '../constant/devices';

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
};
