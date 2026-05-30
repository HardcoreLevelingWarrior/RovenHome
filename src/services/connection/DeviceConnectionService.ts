import TcpSocket from 'react-native-tcp-socket';
import { Buffer } from 'buffer';
import { useApplicationStore } from '../../stores/ApplicationStore';
import type { DeviceInfo } from '../../stores/types';

export default class DeviceConnectionService {
  private static instance: DeviceConnectionService | null = null;
  private sockets = new Map<string, any>();
  private heartbeats = new Map<string, number>();

  private constructor() {}

  static getInstance() {
    if (!DeviceConnectionService.instance) {
      DeviceConnectionService.instance = new DeviceConnectionService();
    }
    return DeviceConnectionService.instance;
  }

  //
  async connect(device: DeviceInfo): Promise<boolean> {
    const id = device.id;

    this.disconnect(id);

    useApplicationStore.getState().setConnectionStatus(id, 'connecting');

    return new Promise(resolve => {
      const timeout = setTimeout(() => {
        this.disconnect(id);
        useApplicationStore.getState().setConnectionStatus(id, 'error');
        resolve(false);
      }, 8000);

      const client = TcpSocket.createConnection(
        { host: device.ip, port: device.port },
        () => {
          clearTimeout(timeout);
          this.sockets.set(id, client);
          useApplicationStore.getState().setConnected(id, true);
          useApplicationStore.getState().setConnectionStatus(id, 'connected');
          useApplicationStore.getState().updateDeviceStatus(id, 'online');

          // اصلاح شده: نوع درست
          client.on('data', (data: Buffer | string) =>
            this.handleData(id, data),
          );

          this.startHeartbeat(id);
          resolve(true);
        },
      );

      client.on('error', () => {
        clearTimeout(timeout);
        this.disconnect(id);
        resolve(false);
      });

      client.on('close', () => {
        clearTimeout(timeout);
        this.disconnect(id);
        resolve(false);
      });
    });
  }

  // ✅ اصلاح شده
  private handleData(deviceId: string, data: Buffer | string) {
    const msg =
      typeof data === 'string' ? data.trim() : data.toString('utf8').trim();

    useApplicationStore.getState().setLastMessage(deviceId, msg);

    console.log(`[RX ${deviceId}]: ${msg}`);
  }

  // private handleData(deviceId: string, data: Buffer) {
  //   const msg = data.toString('utf8').trim();
  //   useApplicationStore.getState().setLastMessage(deviceId, msg);
  // }

  public send(deviceId: string, command: string): boolean {
    const socket = this.sockets.get(deviceId);
    if (!socket || socket.destroyed) return false;

    socket.write(command + '\n', 'utf8');
    return true;
  }

  private startHeartbeat(deviceId: string) {
    this.stopHeartbeat(deviceId);
    const timer = setInterval(() => {
      this.send(deviceId, 'PING');
    }, 12000);
    this.heartbeats.set(deviceId, timer);
  }

  private stopHeartbeat(deviceId: string) {
    const timer = this.heartbeats.get(deviceId);
    if (timer) clearInterval(timer);
    this.heartbeats.delete(deviceId);
  }

  public disconnect(deviceId: string) {
    this.stopHeartbeat(deviceId);
    const socket = this.sockets.get(deviceId);
    if (socket) {
      socket.destroy();
      this.sockets.delete(deviceId);
    }
    useApplicationStore.getState().setConnected(deviceId, false);
    useApplicationStore
      .getState()
      .setConnectionStatus(deviceId, 'disconnected');
    useApplicationStore.getState().updateDeviceStatus(deviceId, 'offline');
  }
}
