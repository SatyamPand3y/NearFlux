import { Device, RegisterDevicePayload } from '../types/index.js';

class DeviceManager {
  private devices: Map<string, Device> = new Map();

  public registerDevice(socketId: string, clientIp: string, payload: RegisterDevicePayload): Device {
    const device: Device = {
      id: socketId,
      name: payload.name,
      type: payload.type,
      os: payload.os,
      browser: payload.browser,
      ip: clientIp,
      joinedAt: Date.now(),
    };
    this.devices.set(socketId, device);
    return device;
  }

  public updateDeviceName(socketId: string, name: string): Device | null {
    const device = this.devices.get(socketId);
    if (!device) return null;

    device.name = name;
    this.devices.set(socketId, device);
    return device;
  }

  public removeDevice(socketId: string): Device | null {
    const device = this.devices.get(socketId) || null;
    this.devices.delete(socketId);
    return device;
  }

  public getDevice(socketId: string): Device | undefined {
    return this.devices.get(socketId);
  }

  public getAllDevices(): Device[] {
    return Array.from(this.devices.values());
  }

  public getOtherDevices(excludeSocketId: string): Device[] {
    return this.getAllDevices().filter((device) => device.id !== excludeSocketId);
  }

  public getCount(): number {
    return this.devices.size;
  }
}

export const deviceManager = new DeviceManager();