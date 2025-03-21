import SocketService from "@/services/socket/SocketService";
import { useEffect, useState } from "react";
import { getMessages } from "@/services/Chat";

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
  const [loading, setLoading] = useState<boolean>(false);
  console.log("✅ Socket connected:", SocketService.getSocket().connected);

  // Load messages function
  const loadMessages = async (receiverId: string, senderId: string) => {
    if (!receiverId || !senderId) return;
    
    setLoading(true);
    try {
      const response = await getMessages(receiverId, senderId);
      if (response) {
        console.log("Messages loaded:", response);
        setMessages(response);
      } else {
        console.error("Failed to load messages:", response);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };
  
  //TODO: HANDLE EVENT
  useEffect(() => {
    SocketService.getSocket().connect();
    SocketService.getSocket().off(SOCKET_EVENTS.MESSAGE.RECEIVED);
    SocketService.getSocket().off(SOCKET_EVENTS.MESSAGE.READ);

    SocketService.getSocket().on(SOCKET_EVENTS.MESSAGE.RECEIVED, (newMessage: any) => {
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
    console.log("Sending message:", messageData);
    SocketService.getSocket().emit(SOCKET_EVENTS.MESSAGE.SEND, messageData);
  };
  
  //TODO: READ
  const readMessage = (messageId: string, userId: string) => {
    const readData = {
      messageId,
      readerId: userId,
    };
    SocketService.getSocket().emit("message:read", readData);
  };
  
  return { messages, sendMessage, readMessage, loadMessages, loading };
};