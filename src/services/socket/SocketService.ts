import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

class SocketService {
    public socket: any;
    private url = SOCKET_SERVER_URL
    static instanceCount = 0;
    private config = {
        autoConnect: true,
    }
    constructor() {
        this.socket = io(this.url, { ...this.config });
        SocketService.instanceCount++;
        console.log(`📡 New SocketManager instance created. Total: ${SocketService.instanceCount}`);
    }
    getSocket() {
        return this.socket
    }
}
export default new SocketService()