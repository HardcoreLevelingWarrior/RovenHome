import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from 'zustand-mmkv-storage';

import { PairingStatus, WifiNetwork, DeviceInfo } from './types';

type PairingStore = {
  status: PairingStatus;
  setStatus: (status: PairingStatus) => void;

  wifiList: WifiNetwork[];
  setWifiList: (list: WifiNetwork[]) => void;

  error: string | null;
  setError: (msg: string | null) => void;

  devices: DeviceInfo[];
  addDevice: (device: DeviceInfo) => void;
  updateDeviceStatus: (id: string, status: DeviceInfo['status']) => void;
};

export const usePairingStore = create<PairingStore>()(
  persist(
    //initial state
    set => ({
      status: 'idle',
      setStatus: status => set({ status }),

      wifiList: [],
      setWifiList: list => set({ wifiList: list }),

      error: null,
      setError: msg => set({ error: msg }),

      devices: [],
      addDevice: device =>
        set(state => ({
          devices: [...state.devices, device],
        })),

      updateDeviceStatus: (id, newStatus) =>
        set(state => ({
          devices: state.devices.map(dev =>
            dev.id === id ? { ...dev, status: newStatus } : dev,
          ),
        })),
    }),

    //persist settings
    {
      name: 'pairing-Storage',
      storage: createJSONStorage(() => mmkvStorage),

      partialize: state => ({ devices: state.devices }),

      onRehydrateStorage: () => state => {
        // other things after load
        if (state) {
          console.log('state rehydrate  from mmkv');
        }
      },
    },
  ),
);
