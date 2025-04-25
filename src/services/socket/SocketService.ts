// services/socket/SocketService.ts
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL;
// const SOCKET_SERVER_URL = "https://192.168.17.5:5000";


class SocketService {
  public socket: Socket | null = null;
  private static instance: SocketService | null = null;
  private url = SOCKET_SERVER_URL;
  private userId?: string;
  static instanceCount = 0;

  private config = {
    reconnectionDelayMax: 10000,
  };

  constructor(userId?: string) {
    this.userId = userId;

    this.socket = io(this.url, {
      ...this.config,
      query: this.userId ? { userId: this.userId } : {},
    });

    SocketService.instanceCount++;
    console.log(
      `📡 New SocketManager instance created for userId: ${userId}. Total: ${SocketService.instanceCount}`
    );
  }

  static getInstance(userId?: string): SocketService {
    if (!SocketService.instance || SocketService.instance.userId !== userId) {
      SocketService.instance = new SocketService(userId);
    }
    return SocketService.instance;
  }

  getSocket(): Socket {
    if (!this.socket) {
      this.socket = io(this.url, {
        ...this.config,
        query: { userId: this.userId },
      });
    }
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      SocketService.instance = null;
      console.log(`📡 Socket disconnected for userId: ${this.userId}`);
    }
  }
}

export default SocketService;