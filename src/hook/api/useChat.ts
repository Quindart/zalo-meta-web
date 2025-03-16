import SocketService from "@/services/socket/SocketService";
import { useEffect, useState } from "react";
const SOCKET_EVENTS = {
    MESSAGE: {
        SEND: "message:send",
        RECEIVED: "message:received",
        DELIVERED: "message:delivered",
        READ: "message:read",
        ERROR: "message:error",
    },
};
export const useChat = () => {
    const [messages, setMessages] = useState<any[]>([]);
    console.log("✅ Socket connected:", SocketService.getSocket().connected);
    //TODO: HANDLE EVENT
    useEffect(() => {
        SocketService.getSocket().connect();
        SocketService.getSocket().off(SOCKET_EVENTS.MESSAGE.RECEIVED);
        SocketService.getSocket().off(SOCKET_EVENTS.MESSAGE.READ);

        SocketService.getSocket().on(SOCKET_EVENTS.MESSAGE.RECEIVED, (newMessage: string) => {
            console.log("Tin nhắn mới:", newMessage);
            setMessages((prev) => [...prev, newMessage]);
        });
        SocketService.getSocket().on(SOCKET_EVENTS.MESSAGE.READ, (update: any) => {
            console.log("Tin nhắn đã đọc:", update);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === update.messageId ? { ...msg, status: "read" } : msg,
                ),
            );
        });
        return () => {
            SocketService.getSocket().disconnect();
            SocketService.getSocket().off(SOCKET_EVENTS.MESSAGE.RECEIVED);
            SocketService.getSocket().off(SOCKET_EVENTS.MESSAGE.READ);
        };
    }, []);

    //TODO: SEND
    const sendMessage = (receiverId: string, content: string, userId: string) => {
        const messageData = {
            senderId: userId,
            receiverId,
            content,
        };
        SocketService.getSocket().emit("message:send", messageData);
    };
    //TODO: READ
    const readMessage = (messageId: string, userId: string) => {
        const readData = {
            messageId,
            readerId: userId,
        };
        SocketService.getSocket().emit("message:read", readData);
    };
    return { messages, sendMessage, readMessage };
};
