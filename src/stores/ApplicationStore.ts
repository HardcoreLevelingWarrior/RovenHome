import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from 'zustand-mmkv-storage';
import DeviceConnectionService from '../services/connection/DeviceConnectionService';

import { PairingStatus, WifiNetwork, DeviceInfo } from './types';

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

type ApplicationStore = {
  status: PairingStatus;
  setStatus: (status: PairingStatus) => void;

  wifiList: WifiNetwork[];
  setWifiList: (list: WifiNetwork[]) => void;

  error: string | null;
  setError: (msg: string | null) => void;

  devices: DeviceInfo[];
  addDevice: (device: DeviceInfo) => void;
  removeDevice: (deviceId: string) => void;
  updateDeviceStatus: (id: string, status: DeviceInfo['status']) => void;

  connectedIds: string[]; // کدام دستگاه‌ها الان TCP وصل هستند
  lastMessages: Record<string, string>; // فقط آخرین پیام هر دستگاه (برای سادگی)
  connectionStatus: Record<string, ConnectionStatus>;

  setConnected: (deviceId: string, isConnected: boolean) => void;
  setLastMessage: (deviceId: string, message: string) => void;
  setConnectionStatus: (deviceId: string, connStatus: ConnectionStatus) => void;
  clearLastMessage: (deviceId: string) => void;
};

export const useApplicationStore = create<ApplicationStore>()(
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

      ///////////////////////////
      connectedIds: [],
      lastMessages: {},
      connectionStatus: {},

      setConnected: (id, isConnected) =>
        set(state => ({
          connectedIds: isConnected
            ? [...new Set([...state.connectedIds, id])]
            : state.connectedIds.filter(x => x !== id),
        })),
      removeDevice: (deviceId: string) =>
        set(state => {
          // ۱. قطع اتصال واقعی (خیلی مهم!)
          DeviceConnectionService.getInstance().disconnect(deviceId);

          // ۲. حذف از لیست اصلی دستگاه‌ها
          const newDevices = state.devices.filter(d => d.id !== deviceId);

          // ۳. پاک کردن داده‌های موقتی مرتبط با این deviceId
          const newConnectedIds = state.connectedIds.filter(
            id => id !== deviceId,
          );

          const newLastMessages = { ...state.lastMessages };
          delete newLastMessages[deviceId];

          const newConnectionStatus = { ...state.connectionStatus };
          delete newConnectionStatus[deviceId];

          return {
            devices: newDevices,
            connectedIds: newConnectedIds,
            lastMessages: newLastMessages,
            connectionStatus: newConnectionStatus,
          };
        }),
      setLastMessage: (id, msg) =>
        set(state => ({
          lastMessages: { ...state.lastMessages, [id]: msg },
        })),

      setConnectionStatus: (id, connStatus) =>
        set(state => ({
          connectionStatus: { ...state.connectionStatus, [id]: connStatus },
        })),

      clearLastMessage: id =>
        set(state => {
          const { [id]: _, ...rest } = state.lastMessages;
          return { lastMessages: rest };
        }),
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
