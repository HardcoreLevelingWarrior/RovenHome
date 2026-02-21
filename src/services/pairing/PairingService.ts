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
  rssi?: number;
  security: string;
};

export type PairingStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'scanning'
  | 'sendingCredentials'
  | 'success'
  | 'failed';

export interface DeviceInfo {
  id: string;
  name: string;
  ip: string;
  port: number;
  ssid?: string;
  status: 'paired' | 'online' | 'offline' | 'error';
}

export default class PairingService {
  private static instance: PairingService | null = null;

  private emitter = new NativeEventEmitter();
  private client: any | null = null;
  private currentStatus: PairingStatus = 'idle';
  private tempDeviceInfo: Partial<DeviceInfo> = {};
  private heartbeatTimer: number | null = null;

  private constructor() {}

  public static getInstance(): PairingService {
    if (!PairingService.instance) {
      PairingService.instance = new PairingService();
    }
    return PairingService.instance;
  }

  public get status(): PairingStatus {
    return this.currentStatus;
  }

  private setStatus(status: PairingStatus) {
    this.currentStatus = status;
    this.emitter.emit('statusChanged', status);
    console.log('[STATUS]', status);
  }

  private startHeartbeat() {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (!this.isConnected()) {
        this.stopHeartbeat();
        return;
      }

      try {
        console.log(
          'destroyed?',
          this.client?.destroyed,
          'writable?',
          this.client?.writable,
        );
        // this.client!.write('PING\n');
        this.client!.write('PING\n', 'utf8', (err?: Error) => {
          if (err) {
            console.log('PING write error', err);
          } else {
            console.log('PING sent OK');
          }
        });
        // console.log('[HEARTBEAT] PING sent');
      } catch (err) {
        console.log('[HEARTBEAT] failed → disconnect', err);
        this.disconnect();
      }
    }, 10000); // هر ۱۰ ثانیه – قابل تنظیم
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // public isConnected(): boolean {
  //   return !!this.client && !this.client.destroyed && this.client.writable;
  // }
  public isConnected(): boolean {
    return !!this.client && !this.client.destroyed;
  }

  public async startPairing(ip: string, port: number = 5000): Promise<boolean> {
    if (this.currentStatus !== 'idle') {
      console.warn('Pairing in progress');
      return false;
    }

    if (this.client) this.disconnect();

    if (!ip || !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
      throw new Error('آدرس IP نامعتبر');
    }

    this.setStatus('connecting');
    this.tempDeviceInfo = { ip, port };

    return new Promise<boolean>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('اتصال timeout (۳۰ ثانیه)'));
        this.disconnect();
      }, 30000);

      this.client = TcpSocket.createConnection(
        { host: ip, port, interface: 'wifi' },
        () => {
          clearTimeout(timeout);
          this.setStatus('connected');
          this.startHeartbeat(); // ← heartbeat شروع می‌شود
          resolve(true);
          //test
          //   this.client.write('PING\n');
          //   console.log(
          //     'connected, destroyed?',
          //     this.client.destroyed,
          //     'writable?',
          //     this.client.writable,
          //   );
          //   this.client.write('TEST\n', 'utf8', (e: any) =>
          //     console.log('test write cb', e),
          //   );
        },
      );

      this.client.on('data', (data: Buffer) => this.handleIncomingData(data));
      this.client.on('error', (err: Error) => {
        clearTimeout(timeout);
        this.handleError(err);
        reject(err);
      });
      this.client.on('close', () => {
        clearTimeout(timeout);
        this.handleClose();
        if (this.status === 'connecting') {
          reject(new Error('اتصال بسته شد'));
        }
      });
    });
  }

  public sendScanWifi(): boolean {
    if (!this.isConnected()) {
      console.warn('No active connection');
      return false;
    }
    this.setStatus('scanning');
    this.client!.write('SCAN_WIFI?\n');
    return true;
  }

  public sendWifiCredentials(ssid: string, password: string): boolean {
    if (!this.isConnected()) {
      this.emitter.emit('pairingError', 'اتصال وجود ندارد یا قطع شده');
      this.setStatus('failed');
      return false;
    }

    if (!ssid) {
      this.emitter.emit('pairingError', 'SSID انتخاب نشده');
      return false;
    }

    this.setStatus('sendingCredentials');
    this.tempDeviceInfo.ssid = ssid;

    const command = `SELECTED_WIFI:{ssid:${ssid},password:${password},ip:${
      this.tempDeviceInfo.ip || '192.168.1.90'
    },port:${this.tempDeviceInfo.port || 5000}}\n`;

    console.log('[SEND]', command);

    this.client!.write(command, 'utf8', (err?: Error) => {
      if (err) {
        console.error('[WRITE ERROR]', err.message);
        this.emitter.emit('pairingError', 'خطا در ارسال: ' + err.message);
        this.setStatus('failed');
      } else {
        console.log('[WRITE OK]');
      }
    });

    // timeout اگر پاسخی نیومد
    setTimeout(() => {
      if (this.currentStatus === 'sendingCredentials') {
        this.emitter.emit(
          'pairingError',
          'Timeout - پاسخی از دستگاه دریافت نشد',
        );
        this.setStatus('failed');
        this.disconnect();
      }
    }, 12000);

    return true;
  }

  private handleIncomingData(data: Buffer) {
    const msg = data.toString('utf8').trim();
    console.log('[RECV]', msg);

    if (msg.startsWith('WIFI_LIST:')) {
      const list = this.parseWifiList(msg);
      this.emitter.emit('wifiListReceived', list);
    } else if (msg === 'WIFI_CONNECTED' || msg.includes('SUCCESS')) {
      this.finishPairingSuccess();
    } else if (msg.includes('ERROR') || msg.includes('FAIL')) {
      this.emitter.emit('pairingError', msg);
      this.setStatus('failed');
    }
    // می‌تونی اینجا PONG رو هم ignore کنی اگر دستگاه جواب PING می‌ده
  }

  private parseWifiList(msg: string): WifiNetwork[] {
    let content = msg.replace('WIFI_LIST:', '').trim();

    if (content.startsWith('[') && content.endsWith(']')) {
      content = content.slice(1, -1);
      const ssids = content
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      return ssids.map(ssid => ({
        ssid,
        rssi: undefined,
        security: 'Unknown',
      }));
    }

    if (content.includes('|') || content.includes(',')) {
      return content
        .split('|')
        .map(item => {
          const [ssid, rssiStr, security] = item.split(',');
          return {
            ssid: ssid?.trim() || '',
            rssi: rssiStr ? parseInt(rssiStr, 10) : undefined,
            security: security?.trim() || 'Unknown',
          };
        })
        .filter(n => n.ssid);
    }

    return [];
  }

  private finishPairingSuccess() {
    if (!this.tempDeviceInfo.ip || !this.tempDeviceInfo.port) {
      this.emitter.emit('pairingError', 'اطلاعات دستگاه ناقص');
      this.setStatus('failed');
      return;
    }

    const device: DeviceInfo = {
      id: `dev_${Date.now().toString(36)}${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      name: this.tempDeviceInfo.name || 'Device',
      ip: this.tempDeviceInfo.ip,
      port: this.tempDeviceInfo.port,
      ssid: this.tempDeviceInfo.ssid,
      status: 'paired',
    };

    this.emitter.emit('pairingSuccess', device);
    this.disconnect();
  }

  private handleError(err: any) {
    const msg = err?.message || 'خطای اتصال';
    console.error('[ERROR]', msg);
    this.emitter.emit('pairingError', msg);
    this.setStatus('failed');
    this.disconnect();
  }

  private handleClose() {
    console.log('[CLOSE] status was:', this.currentStatus);
    if (this.currentStatus !== 'success' && this.currentStatus !== 'failed') {
      this.setStatus('failed');
      this.emitter.emit('pairingError', 'اتصال غیرمنتظره بسته شد');
    }
    this.stopHeartbeat();
    this.client = null;
  }

  public disconnect() {
    this.stopHeartbeat();
    if (this.client && !this.client.destroyed) {
      this.client.destroy();
    }
    this.client = null;
    this.setStatus('idle');
    this.tempDeviceInfo = {};
  }

  public addListener<K extends keyof PairingEvents>(
    event: K,
    listener: PairingEvents[K],
  ) {
    return this.emitter.addListener(
      event,
      listener as (...args: any[]) => void,
    );
  }

  public removeAllListeners(event?: string) {
    if (event) this.emitter.removeAllListeners(event);
  }
}
