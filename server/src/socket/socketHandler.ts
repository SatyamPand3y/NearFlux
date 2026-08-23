import { Server, Socket } from 'socket.io';
import { deviceManager } from '../services/deviceManager.js';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  RegisterDevicePayload,
  UpdateDeviceNamePayload,
  TransferRequestPayload,
  TransferResponsePayload,
  WebRTCSignalPayload,
  FileChunkPayload,
} from '../types/index.js';

export function setupSocketHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents>
): void {
  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    const clientIp = socket.handshake.address.replace(/^.*:/, '') || '127.0.0.1';

    socket.on('register-device', (payload: RegisterDevicePayload) => {
      if (!payload || !payload.name) return;

      const registeredDevice = deviceManager.registerDevice(socket.id, clientIp, payload);
      
      socket.emit('device-registered', registeredDevice);
      socket.emit('device-list', deviceManager.getOtherDevices(socket.id));
      socket.broadcast.emit('device-joined', registeredDevice);
    });

    socket.on('update-device-name', (payload: UpdateDeviceNamePayload) => {
      if (!payload || !payload.name) return;

      const updatedDevice = deviceManager.updateDeviceName(socket.id, payload.name);
      if (updatedDevice) {
        socket.emit('device-registered', updatedDevice);
        socket.broadcast.emit('device-updated', updatedDevice);
      }
    });

    // Signaling relays for WebRTC file transfer
    socket.on('transfer-request', (payload: TransferRequestPayload) => {
      io.to(payload.targetId).emit('transfer-request', payload);
    });

    socket.on('transfer-response', (payload: TransferResponsePayload) => {
      io.to(payload.senderId).emit('transfer-response', payload);
    });

    socket.on('webrtc-offer', (payload: WebRTCSignalPayload) => {
      io.to(payload.targetId).emit('webrtc-offer', payload);
    });

    socket.on('webrtc-answer', (payload: WebRTCSignalPayload) => {
      io.to(payload.senderId).emit('webrtc-answer', payload);
    });

    socket.on('webrtc-ice-candidate', (payload: WebRTCSignalPayload) => {
      io.to(payload.targetId).emit('webrtc-ice-candidate', payload);
    });

    socket.on('transfer-cancel', (payload: { senderId: string; targetId: string }) => {
      io.to(payload.targetId).emit('transfer-cancel', payload);
      io.to(payload.senderId).emit('transfer-cancel', payload);
    });

    // Hybrid Socket fallback chunk relay
    socket.on('file-chunk', (payload: FileChunkPayload) => {
      io.to(payload.targetId).emit('file-chunk', payload);
    });

    socket.on('disconnect', () => {
      const removedDevice = deviceManager.removeDevice(socket.id);
      if (removedDevice) {
        socket.broadcast.emit('device-left', { id: socket.id });
      }
    });
  });
}