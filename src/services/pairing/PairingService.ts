import TcpSocket from 'react-native-tcp-socket';
import { Buffer } from 'buffer';

// توجه: import store و types
import { useApplicationStore } from '../../stores/ApplicationStore'; // مسیر را درست کن (یا هر alias/path که داری)
import type {
  PairingStatus,
  WifiNetwork,
  DeviceInfo,
} from '../../stores/types'; // یا مسیر types

// دیگر نیازی به PairingEvents و NativeEventEmitter نیست

export default class PairingService {
  private static instance: PairingService | null = null;

  private client: any | null = null; // نوع دقیق‌تر
  private currentStatus: PairingStatus = 'idle';
  private tempDeviceInfo: Partial<DeviceInfo> = {};
  private heartbeatTimer: number | null = null; // بهتر از number

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
    useApplicationStore.getState().setStatus(status); // ← آپدیت store
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
        this.client!.write('PING\n', 'utf8', (err?: Error) => {
          if (err) {
            console.log('PING write error', err);
          } else {
            console.log('PING sent OK');
          }
        });
      } catch (err) {
        console.log('[HEARTBEAT] failed → disconnect', err);
        this.disconnect();
      }
    }, 10000);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  public isConnected(): boolean {
    return !!this.client && !this.client.destroyed;
  }

  // public async startPairing(ip: string, port: number = 5000): Promise<boolean> {
  //   if (this.currentStatus !== 'idle') {
  //     console.warn('Pairing in progress');
  //     return false;
  //   }

  //   if (this.client) this.disconnect();

  //   if (!ip || !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
  //     throw new Error('آدرس IP نامعتبر');
  //   }

  //   this.setStatus('connecting');
  //   this.tempDeviceInfo = { ip, port };

  //   return new Promise<boolean>((resolve, reject) => {
  //     const timeout = setTimeout(() => {
  //       reject(new Error('اتصال timeout (۳۰ ثانیه)'));
  //       this.disconnect();
  //     }, 30000);

  //     this.client = TcpSocket.createConnection(
  //       { host: ip, port, interface: 'wifi' },
  //       () => {
  //         clearTimeout(timeout);
  //         this.setStatus('connected');
  //         this.startHeartbeat();
  //         resolve(true);
  //       },
  //     );

  //     this.client.on('data', (data: Buffer) => this.handleIncomingData(data));
  //     this.client.on('error', (err: Error) => {
  //       clearTimeout(timeout);
  //       this.handleError(err);
  //       reject(err);
  //     });
  //     this.client.on('close', () => {
  //       clearTimeout(timeout);
  //       this.handleClose();
  //       if (this.status === 'connecting') {
  //         reject(new Error('اتصال بسته شد'));
  //       }
  //     });
  //   });
  // }
  // public async startPairing(ip: string, port: number = 5000): Promise<boolean> {
  //   if (this.currentStatus !== 'idle') {
  //     console.warn('Pairing already in progress');
  //     return false;
  //   }

  //   if (this.client) this.disconnect();

  //   if (!ip || !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
  //     throw new Error('آدرس IP نامعتبر');
  //   }

  //   this.setStatus('connecting');
  //   this.tempDeviceInfo = { ip, port };

  //   return new Promise<boolean>((resolve, reject) => {
  //     let isSettled = false; // ← مهم: جلوگیری از resolve/reject چندباره

  //     const timeout = setTimeout(() => {
  //       if (isSettled) return;
  //       isSettled = true;
  //       reject(new Error('اتصال timeout (۳۰ ثانیه)'));
  //       this.disconnect();
  //     }, 30000);

  //     this.client = TcpSocket.createConnection(
  //       { host: ip, port, interface: 'wifi' },
  //       () => {
  //         if (isSettled) return;
  //         clearTimeout(timeout);
  //         isSettled = true;
  //         this.setStatus('connected');
  //         this.startHeartbeat();
  //         resolve(true);
  //       },
  //     );

  //     this.client.on('data', (data: Buffer) => this.handleIncomingData(data));

  //     this.client.on('error', (err: Error) => {
  //       if (isSettled) return;
  //       isSettled = true;
  //       clearTimeout(timeout);
  //       this.handleError(err);
  //       reject(err);
  //     });

  //     this.client.on('close', () => {
  //       if (isSettled) return;
  //       isSettled = true;
  //       clearTimeout(timeout);
  //       this.handleClose();
  //       if (this.status === 'connecting') {
  //         reject(new Error('اتصال بسته شد قبل از تکمیل'));
  //       }
  //     });
  //   });
  // }

  public async startPairing(ip: string, port: number = 5000): Promise<boolean> {
    console.log(`[startPairing] Attempting to connect to ${ip}:${port}`);

    this.disconnect(); // کامل پاکسازی

    if (this.currentStatus !== 'idle') {
      this.setStatus('idle');
    }

    if (!ip || !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
      throw new Error('آدرس IP نامعتبر');
    }

    this.setStatus('connecting');
    this.tempDeviceInfo = { ip, port };

    return new Promise<boolean>((resolve, reject) => {
      let isSettled = false;
      // let connectionTimeout: NodeJS.Timeout;
      let connectionTimeout: number;

      connectionTimeout = setTimeout(() => {
        if (isSettled) return;
        isSettled = true;
        console.log('[startPairing] Timeout');
        reject(new Error('اتصال timeout (۳۰ ثانیه)'));
        this.disconnect();
      }, 30000);

      try {
        this.client = TcpSocket.createConnection(
          { host: ip, port, interface: 'wifi' },
          () => {
            if (isSettled) return;
            clearTimeout(connectionTimeout);
            isSettled = true;
            console.log('[startPairing] Connected successfully');
            this.setStatus('connected');
            this.startHeartbeat();
            resolve(true);
          },
        );

        this.client.on('data', (data: Buffer) => this.handleIncomingData(data));

        this.client.on('error', (err: Error) => {
          if (isSettled) return;
          isSettled = true;
          clearTimeout(connectionTimeout);
          console.error('[startPairing] Socket Error:', err.message);
          this.handleError(err);
          reject(err);
        });

        this.client.on('close', () => {
          if (isSettled) return;
          isSettled = true;
          clearTimeout(connectionTimeout);
          console.log('[startPairing] Connection closed unexpectedly');
          this.handleClose();
          if (this.status === 'connecting') {
            reject(new Error('اتصال قبل از تکمیل بسته شد'));
          }
        });
      } catch (err: any) {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(connectionTimeout);
          console.error('[startPairing] CreateConnection failed:', err);
          this.handleError(err);
          reject(err);
        }
      }
    });
  }

  public sendScanWifi(): boolean {
    if (!this.isConnected()) {
      console.warn('No active connection');
      useApplicationStore.getState().setError('اتصال وجود ندارد');
      return false;
    }
    this.setStatus('scanning');
    this.client!.write('SCAN_WIFI?\n');
    return true;
  }

  public sendWifiCredentials(ssid: string, password: string): boolean {
    if (!this.isConnected()) {
      useApplicationStore.getState().setError('اتصال وجود ندارد یا قطع شده');
      this.setStatus('failed');
      return false;
    }

    if (!ssid) {
      useApplicationStore.getState().setError('SSID انتخاب نشده');
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
        useApplicationStore.getState().setError('خطا در ارسال: ' + err.message);
        this.setStatus('failed');
      } else {
        console.log('[WRITE OK]');
      }
    });

    setTimeout(() => {
      if (this.currentStatus === 'sendingCredentials') {
        useApplicationStore
          .getState()
          .setError('Timeout - پاسخی از دستگاه دریافت نشد');
        this.setStatus('failed');
        this.disconnect();
      }
    }, 12000);

    return true;
  }

  private handleIncomingData(data: Buffer) {
    const msg = data.toString('utf8').trim();
    console.log('[RECV]', msg);

    const store = useApplicationStore.getState();

    if (msg.startsWith('WIFI_LIST:')) {
      const list = this.parseWifiList(msg);
      store.setWifiList(list);
    } else if (msg === 'WIFI_CONNECTED' || msg.includes('CONNECTED:')) {
      const [ip, portStr, name] = msg
        .replace('CONNECTED:', '')
        .slice(1, -1)
        .split(',');

      let deviceType: 'oven' | 'hood' | 'fridge' | 'other';
      if (name === 'OVEN') {
        deviceType = 'oven';
      } else if (name === 'HOOD') {
        deviceType = 'hood';
      } else if (name === 'FRIDGE') {
        deviceType = 'fridge';
      } else {
        deviceType = 'other';
      }

      const device: DeviceInfo = {
        id: `dev_${Date.now().toString(36)}${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        name: name.trim() || 'Device',
        ip: ip.trim(),
        port: Number.parseInt(portStr.trim(), 10),
        ssid: this.tempDeviceInfo.ssid,
        status: 'paired',
        type: deviceType,
      };

      store.addDevice(device); // ← ذخیره در store (که persist می‌شود)
      this.finishPairingSuccess();
    } else if (msg.includes('ERROR') || msg.includes('FAIL')) {
      store.setError(msg);
      this.setStatus('failed');
    }
    // اگر PONG آمد می‌توانی ignore کنی
  }

  private parseWifiList(msg: string): WifiNetwork[] {
    // همان کد قبلی بدون تغییر
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
      useApplicationStore.getState().setError('اطلاعات دستگاه ناقص');
      this.setStatus('failed');
      return;
    }

    // device قبلاً در handleIncomingData ساخته و اضافه شده
    this.disconnect();
    this.setStatus('success'); // یا می‌توانی success را هم در store داشته باشی
  }

  private handleError(err: any) {
    const msg = err?.message || 'خطای اتصال';
    console.error('[ERROR]', msg);
    useApplicationStore.getState().setError(msg);
    this.setStatus('failed');
    this.disconnect();
  }

  private handleClose() {
    console.log('[CLOSE] status was:', this.currentStatus);
    if (this.currentStatus !== 'success' && this.currentStatus !== 'failed') {
      useApplicationStore.getState().setError('اتصال غیرمنتظره بسته شد');
      this.setStatus('failed');
    }
    this.stopHeartbeat();
    this.client = null;
  }

  // public disconnect() {
  //   this.stopHeartbeat();
  //   if (this.client && !this.client.destroyed) {
  //     this.client.destroy();
  //   }
  //   this.client = null;
  //   this.setStatus('idle');
  //   this.tempDeviceInfo = {};
  // }
  public disconnect() {
    this.stopHeartbeat();

    if (this.client) {
      try {
        if (!this.client.destroyed) {
          this.client.destroy();
        }
      } catch (e) {
        console.log('Error destroying client:', e);
      }
      this.client = null;
    }

    this.setStatus('idle');
    this.tempDeviceInfo = {};
    console.log('[PairingService] Fully disconnected and reset');
  }
}
