import TcpSocket from 'react-native-tcp-socket';
import { NativeEventEmitter } from 'react-native';
import { Buffer } from 'buffer';

// class PairingManager {
//   // تک نمونه
//   static shared = new PairingManager()

//   // وضعیت فعلی
//   status: 'idle' | 'connecting' | ... = 'idle'

//   // سوکت فعال
//   socket: TcpSocketClient | null = null

//   // اطلاعات موقتی دستگاه
//   device: { ip: string, port: number, ssid?: string } | null = null

//   // تایمر heartbeat
//   heartbeat?: number = null

//   // متدهای عمومی
//   async connectToDevice(ip: string, port = 5000)
//   sendScanRequest()
//   sendWifiCredentials(ssid: string, pass: string)
//   disconnect()

//   // listener ها
//   on(event: 'wifiList' | 'success' | 'error' | 'status', callback)
// }

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

  private startHeartbeat() {
    //this.stopHeartbeat()
    // this.heartbeatTimer = setInterval(() =>{
    //   if(this.)
    // })
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

  ///////////////////////////////////////////
  public async startPairing(ip: string, port: number = 5000) {
    if (this.currentStatus === 'idle') {
      console.warn('Pairing in progress');
      return false;
    }
    // if (this.client) this.disconnect

    if (!ip || !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
      throw new Error('آدرس IP نامعتبر');
    }
  }

  // public isConnected() :boolean {
  //   return this.client !this.client.distroyed
  // }
}
