import { io, } from "socket.io-client";


class SocketClientService {
    socket
    constructor() {
        this.socket = io("http://localhost:5000");
    }
    getSocket() {
        return this.socket
    }
    sendMessage =  (userId: string | number, message: any) => {
        return this.socket.emit("send_message", {
            userId: userId,
            threadId: "456",
            message,
        });
    }

    onReceiveMessage =  (_: any) => {
        this.socket.on("receive_message", _);
    }

    disconnect = () => {
        this.socket.disconnect();
    }
};

export default new SocketClientService;
