import { io, Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  TransferRequestPayload,
  TransferResponsePayload,
  WebRTCSignalPayload,
  FileChunkPayload,
} from '../types/index.js';

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

  public connect(serverUrl?: string): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (this.socket) {
      return this.socket;
    }

    const host = window.location.hostname;
    const url = serverUrl || `http://${host}:3000`;

    this.socket = io(url, {
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    return this.socket;
  }

  public getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> | null {
    return this.socket;
  }

  public sendTransferRequest(payload: TransferRequestPayload): void {
    this.socket?.emit('transfer-request', payload);
  }

  public sendTransferResponse(payload: TransferResponsePayload): void {
    this.socket?.emit('transfer-response', payload);
  }

  public sendWebRTCOffer(payload: WebRTCSignalPayload): void {
    this.socket?.emit('webrtc-offer', payload);
  }

  public sendWebRTCAnswer(payload: WebRTCSignalPayload): void {
    this.socket?.emit('webrtc-answer', payload);
  }

  public sendIceCandidate(payload: WebRTCSignalPayload): void {
    this.socket?.emit('webrtc-ice-candidate', payload);
  }

  public sendFileChunk(payload: FileChunkPayload): void {
    this.socket?.emit('file-chunk', payload);
  }

  public cancelTransfer(senderId: string, targetId: string): void {
    this.socket?.emit('transfer-cancel', { senderId, targetId });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();