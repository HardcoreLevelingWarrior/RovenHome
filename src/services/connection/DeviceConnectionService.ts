import TcpSocket from 'react-native-tcp-socket';
import { DeviceInfo } from '../../stores/types';
import { useApplicationStore } from '../../stores/ApplicationStore';
import { Buffer } from 'buffer';

export default class DeviceConnectionService {
  private static instance: DeviceConnectionService | null = null;
  private sockets = new Map<string, any>();
  private heartbeats = new Map<string, number>();
  private missedPongs = new Map<string, number>();

  private constructor() {}

  static getInstance() {
    if (!DeviceConnectionService.instance) {
      DeviceConnectionService.instance = new DeviceConnectionService();
    }
    return DeviceConnectionService.instance;
  }

  async connect(device: DeviceInfo): Promise<boolean> {
    const id = device.id;

    // مرحله حیاتی: اگر سوکت قبلی وجود داشت، حتماً قطعش کن
    if (this.sockets.has(id)) {
      console.warn(
        `[WARN] سوکت قبلی برای ${id} هنوز باز بود → قطع کامل می‌شود`,
      );
      this.disconnect(id); // این خط خیلی مهمه! قطع کامل قبلی
    }

    useApplicationStore.getState().setConnectionStatus(id, 'connecting');

    return new Promise<boolean>(resolve => {
      const timeoutMs = 8000;

      const client = TcpSocket.createConnection(
        {
          host: device.ip,
          port: device.port,
          connectTimeout: timeoutMs,
        },
        () => {
          console.log(`[CONNECTED] ${id} (${device.ip}:${device.port})`);
          this.sockets.set(id, client);
          useApplicationStore.getState().setConnected(id, true);
          useApplicationStore.getState().setConnectionStatus(id, 'connected');
          useApplicationStore.getState().updateDeviceStatus(id, 'online');

          // listener 'data' فقط یک بار
          client.on('data', (data: Buffer | string) =>
            this.handleData(id, data),
          );

          this.startHeartbeat(id);
          resolve(true);
        },
      );

      const cleanup = () => {
        client.removeAllListeners();
        if (!client.destroyed) client.destroy();
        clearTimeout(timeoutId);
      };

      client.on('error', (err: Error) => {
        console.error(`[ERROR ${id}]: ${err.message}`);
        cleanup();
        useApplicationStore.getState().setConnectionStatus(id, 'error');
        useApplicationStore.getState().updateDeviceStatus(id, 'offline');
        resolve(false);
      });

      client.on('close', () => {
        console.log(`[CLOSE ${id}]`);
        cleanup();
        useApplicationStore.getState().setConnected(id, false);
        useApplicationStore.getState().setConnectionStatus(id, 'disconnected');
        useApplicationStore.getState().updateDeviceStatus(id, 'offline');
        resolve(false);
      });

      const timeoutId = setTimeout(() => {
        console.warn(`[TIMEOUT ${id}]`);
        cleanup();
        useApplicationStore.getState().setConnectionStatus(id, 'error');
        resolve(false);
      }, timeoutMs + 1000);

      client.on('connect', () => clearTimeout(timeoutId));
    });
  }

  // مدیریت داده‌ها (فقط یک listener)
  private handleData(deviceId: string, data: Buffer | string) {
    const msg = data.toString('utf8').trim();
    useApplicationStore.getState().setLastMessage(deviceId, msg);

    if (msg === 'PONG') {
      this.missedPongs.set(deviceId, 0);
      console.log(`[PONG OK] ${deviceId}`);
    }
  }

  public send(deviceId: string, command: string): boolean {
    const socket = this.sockets.get(deviceId);
    if (!socket || socket.destroyed) return false;

    socket.write(command + '\n', 'utf8', (err?: Error) => {
      if (err) console.error(`Send error to ${deviceId}:`, err);
      else console.log(`[SENT to ${deviceId}]: ${command}`);
    });

    return true;
  }

  private startHeartbeat(deviceId: string) {
    this.stopHeartbeat(deviceId);
    this.missedPongs.set(deviceId, 0);

    const timer = setInterval(() => {
      if (!this.sockets.has(deviceId)) {
        this.stopHeartbeat(deviceId);
        return;
      }

      this.send(deviceId, 'PING');

      setTimeout(() => {
        const misses = (this.missedPongs.get(deviceId) || 0) + 1;
        this.missedPongs.set(deviceId, misses);

        if (misses >= 3) {
          console.warn(`[${deviceId}] ${misses} missed PONG → disconnecting`);
          this.disconnect(deviceId);
        }
      }, 6000);
    }, 12000);

    this.heartbeats.set(deviceId, timer);
  }

  private stopHeartbeat(deviceId: string) {
    const timer = this.heartbeats.get(deviceId);
    if (timer) {
      clearInterval(timer);
      this.heartbeats.delete(deviceId);
    }
    this.missedPongs.delete(deviceId);
  }

  public disconnect(deviceId: string) {
    console.log(`[DISCONNECT REQUEST] ${deviceId}`);

    this.stopHeartbeat(deviceId);

    const socket = this.sockets.get(deviceId);
    if (socket) {
      socket.destroy();
      this.sockets.delete(deviceId);
      console.log(`[DISCONNECTED] ${deviceId}`);
    }

    useApplicationStore.getState().setConnected(deviceId, false);
    useApplicationStore
      .getState()
      .setConnectionStatus(deviceId, 'disconnected');
    useApplicationStore.getState().updateDeviceStatus(deviceId, 'offline');
  }

  public disconnectAll() {
    this.sockets.forEach((_, id) => this.disconnect(id));
  }
}

// export default class DeviceConnectionService {
//   private static instance: DeviceConnectionService | null = null;
//   private sockets = new Map<string, any>();
//   private heartbeats = new Map<string, number>();
//   private missedPongs = new Map<string, number>();
//   private constructor() {}

//   static getInstance() {
//     if (!DeviceConnectionService.instance) {
//       DeviceConnectionService.instance = new DeviceConnectionService();
//     }
//     return DeviceConnectionService.instance;
//   }

//   // async connect(device: DeviceInfo): Promise<boolean> {
//   //   const id = device.id;
//   //   if (this.sockets.has(id)) return true;

//   //   useApplicationStore.getState().setConnectionStatus(id, 'connecting');

//   //   return new Promise(resolve => {
//   //     const client = TcpSocket.createConnection(
//   //       { host: device.ip, port: device.port, connectTimeout: 80000 },
//   //       () => {
//   //         this.sockets.set(id, client);
//   //         useApplicationStore.getState().setConnected(id, true);
//   //         useApplicationStore.getState().setConnectionStatus(id, 'connected');
//   //         useApplicationStore.getState().updateDeviceStatus(id, 'online');
//   //         this.startHeartbeat(id);
//   //         resolve(true);
//   //       },
//   //     );

//   //     client.on('data', data => {
//   //       const msg = data.toString('utf8').trim();
//   //       useApplicationStore.getState().setLastMessage(id, msg);
//   //       if (msg === 'PONG') {
//   //         //   useApplicationStore.getState().updateLastPong(id, Date.now());
//   //       }
//   //     });
//   //     client.on('error', (err: Error) => {
//   //       console.error(`[ERROR ${id}]: ${err.message}`);
//   //       this.handleDisconnect(id);
//   //       resolve(false);
//   //     });

//   //     client.on('close', () => {
//   //       console.log(`[CLOSE ${id}]`);
//   //       this.handleDisconnect(id);
//   //       resolve(false);
//   //     });
//   //   });
//   // }
//   async connect(device: DeviceInfo): Promise<boolean> {
//     const id = device.id;
//     if (this.sockets.has(id)) return true;

//     useApplicationStore.getState().setConnectionStatus(id, 'connecting');

//     return new Promise<boolean>((resolve, reject) => {
//       const timeoutMs = 8000; // ۸ ثانیه معقول برای اتصال محلی

//       const client = TcpSocket.createConnection(
//         {
//           host: device.ip,
//           port: device.port,
//           connectTimeout: timeoutMs,
//         },
//         () => {
//           console.log(`[CONNECTED] ${id} (${device.ip}:${device.port})`);
//           this.sockets.set(id, client);
//           useApplicationStore.getState().setConnected(id, true);
//           useApplicationStore.getState().setConnectionStatus(id, 'connected');
//           useApplicationStore.getState().updateDeviceStatus(id, 'online');
//           this.startHeartbeat(id);
//           resolve(true);
//         },
//       );

//       // برای جلوگیری از memory leak و اطمینان از cleanup
//       const cleanup = () => {
//         client.removeAllListeners();
//         if (!client.destroyed) client.destroy();
//       };

//       client.on('data', data => {
//         const msg = data.toString('utf8').trim();
//         useApplicationStore.getState().setLastMessage(id, msg);
//         if (msg === 'PONG') {
//           // اگر بعداً شمارنده missedPong اضافه کردی، اینجا ریست می‌کنی
//         }
//       });

//       client.on('error', (err: Error) => {
//         console.error(`[ERROR ${id}]: ${err.message}`);
//         cleanup();
//         useApplicationStore.getState().setConnectionStatus(id, 'error');
//         useApplicationStore.getState().updateDeviceStatus(id, 'offline');
//         resolve(false); // یا reject(err) اگر می‌خوای خطا رو به caller برگردونی
//       });

//       client.on('close', () => {
//         console.log(`[CLOSE ${id}]`);
//         cleanup();
//         // فقط اگر هنوز resolve نشده باشه
//         useApplicationStore.getState().setConnected(id, false);
//         useApplicationStore.getState().setConnectionStatus(id, 'disconnected');
//         useApplicationStore.getState().updateDeviceStatus(id, 'offline');
//         resolve(false);
//       });

//       // timeout دستی (برای اطمینان بیشتر)
//       const timeoutId = setTimeout(() => {
//         console.warn(
//           `[TIMEOUT ${id}] اتصال پس از ${timeoutMs / 1000} ثانیه ناموفق`,
//         );
//         cleanup();
//         useApplicationStore.getState().setConnectionStatus(id, 'error');
//         resolve(false);
//       }, timeoutMs + 1000);

//       // اگر موفق شد، timeout رو پاک کن
//       client.on('connect', () => clearTimeout(timeoutId));
//     });
//   }
//   public send(deviceId: string, command: string): boolean {
//     const socket = this.sockets.get(deviceId);
//     if (!socket || socket.destroyed) {
//       console.warn(`Cannot send to ${deviceId}: no active connection`);
//       return false;
//     }

//     socket.write(command + '\n', 'utf8', (err?: Error) => {
//       if (err) {
//         console.error(`Send error to ${deviceId}:`, err);
//       } else {
//         console.log(`[SENT to ${deviceId}]: ${command}`);
//       }
//     });

//     return true;
//   }

//   // private startHeartbeat(deviceId: string) {
//   //   this.stopHeartbeat(deviceId);

//   //   const timer = setInterval(() => {
//   //     if (!this.sockets.has(deviceId)) {
//   //       this.stopHeartbeat(deviceId);
//   //       return;
//   //     }
//   //     this.send(deviceId, 'PING');
//   //   }, 12000);

//   //   this.heartbeats.set(deviceId, timer);
//   // }

//   /**
//    * توقف heartbeat
//    */
//   private stopHeartbeat(deviceId: string) {
//     const timer = this.heartbeats.get(deviceId);
//     if (timer) {
//       clearInterval(timer);
//       this.heartbeats.delete(deviceId);
//     }
//   }
//   //////////////////////////

//   private startHeartbeat(deviceId: string) {
//     this.stopHeartbeat(deviceId);
//     this.missedPongs.set(deviceId, 0);

//     const timer = setInterval(() => {
//       if (!this.sockets.has(deviceId)) {
//         this.stopHeartbeat(deviceId);
//         return;
//       }

//       this.send(deviceId, 'PING');

//       // بعد از ۵ ثانیه اگر PONG نیومد → یک miss حساب کن
//       const pongTimeout = setTimeout(() => {
//         const misses = (this.missedPongs.get(deviceId) || 0) + 1;
//         this.missedPongs.set(deviceId, misses);

//         if (misses >= 2) {
//           // بعد از ۲ بار miss → قطع فرض کن
//           console.warn(`[${deviceId}] 2 missed PONG → disconnecting`);
//           this.handleDisconnect(deviceId);
//         }
//       }, 5000);

//       // اگر PONG آمد، timeout و miss رو ریست کن
//       const originalOnData = this.sockets.get(deviceId)?.listeners('data')[0];
//       const wrappedOnData = (data: Buffer) => {
//         const msg = data.toString('utf8').trim();
//         if (msg === 'PONG') {
//           clearTimeout(pongTimeout);
//           this.missedPongs.set(deviceId, 0);
//         }
//         // بقیه listenerها رو هم اجرا کن
//         originalOnData?.(data);
//       };

//       // این فقط برای مثال ساده است؛ در عمل بهتره listener رو override نکنی
//     }, 12000);

//     this.heartbeats.set(deviceId, timer);
//   }
//   private handleDisconnect(deviceId: string) {
//     console.log(`Handling disconnect for ${deviceId}`);

//     this.stopHeartbeat(deviceId);

//     const socket = this.sockets.get(deviceId);
//     if (socket) {
//       socket.destroy();
//       this.sockets.delete(deviceId);
//     }

//     // آپدیت store
//     useApplicationStore.getState().setConnected(deviceId, false);
//     useApplicationStore
//       .getState()
//       .setConnectionStatus(deviceId, 'disconnected');
//     useApplicationStore.getState().updateDeviceStatus(deviceId, 'offline');

//     // reconnect ساده بعد از ۵ ثانیه
//     setTimeout(() => {
//       const dev = useApplicationStore
//         .getState()
//         .devices.find(d => d.id === deviceId);
//       if (dev) {
//         console.log(`Reconnecting to ${deviceId} after delay...`);
//         this.connect(dev);
//       }
//     }, 5000);
//   }

//   public disconnect(deviceId: string) {
//     this.handleDisconnect(deviceId);
//   }

//   public disconnectAll() {
//     this.sockets.forEach((_, id) => this.disconnect(id));
//   }
// }
