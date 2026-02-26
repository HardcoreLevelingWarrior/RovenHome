export type PairingStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'scanning'
  | 'sendingCredentials'
  | 'success'
  | 'failed';

export interface WifiNetwork {
  ssid: string;
  rssi?: number;
  security: string;
}

export interface DeviceInfo {
  id: string;
  name: string;
  ip: string;
  port: number;
  ssid?: string;
  status: 'paired' | 'online' | 'offline' | 'error';
  lastSeen?: string; // اختیاری: آخرین باری که آنلاین بود (ISO string)
}

export interface Device {
  id: string;
  name: string;
  ip: string;
  port: number;
}

export interface DeviceExtended extends DeviceInfo {
  macAddress?: string;
  firmwareVersion?: string;
  model?: string;
}
