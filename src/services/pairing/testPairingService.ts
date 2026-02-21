import TcpSocket from 'react-native-tcp-socket';
import { NativeEventEmitter } from 'react-native';
import { Buffer } from 'buffer';

type PairingEvents = {
  wifiListReceived: (list: WifiNetwork[]) => void;
  pairingSuccess: (device: DeviceInfo) => void;
  pairingError: (error: string) => void;
  statusChanged: (status: PairingStatus) => void;
};

export type WifiNetwork = {
  ssid: string;
  password: string;
};

export interface DeviceInfo {
  id: string;
  name: string;
  ip: string;
  port: number;
  sssid: string;
  status: 'paired' | 'online' | 'offline' | 'error';
}

export type PairingStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'scanning'
  | 'sendingCredentials'
  | 'success'
  | 'failed';

export default class testPairingSevice {
  private static instance: testPairingSevice | null;
  private client: any | null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private currentStatus: PairingStatus = 'idle';
  private tempDeviceInfo: Partial<DeviceInfo> = {};

  private emitter = new NativeEventEmitter();

  private constructor() {}

  get status() {
    return this.currentStatus;
  }

  set setStatus(status: PairingStatus) {
    this.currentStatus = status;
    this.emitter.emit('statusChanged', status);
  }

  private handleClose() {
    if (this.currentStatus !== 'success') {
      this.setStatus = 'failed';
      this.emitter.emit('pairingError', 'failed th connect to the device');
    }

    this.client = null;
  }

  // private handleIncomingData () {

  // }
}
