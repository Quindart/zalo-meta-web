import SocketService from "@/services/socket/SocketService";
import { useEffect, useState, useCallback, useRef } from "react";

const SOCKET_EVENTS = {
  MESSAGE: {
    SEND: "message:send",
    RECEIVED: "message:received",
    DELIVERED: "message:delivered",
    READ: "message:read",
    ERROR: "message:error",
    LOAD: "message:load",
    LOAD_RESPONSE: "message:loadResponse",
  },
  CHANNEL: {
    FIND_BY_ID: "channel:findById",
    FIND_BY_ID_RESPONSE: "channel:findByIdResponse",
    FIND_ORCREATE: "channel:findOrCreate",
    FIND_ORCREATE_RESPONSE: "channel:findOrCreateResponse",
    LOAD_CHANNEL: "channel:load",
    LOAD_CHANNEL_RESPONSE: "channel:loadResponse",
  },
};

const socketService = new SocketService();

interface ResponseType {
  success: boolean;
  message: string;
  data: any;
}

export const useChat = (currentUserId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [channel, setChannel] = useState<any>(null);
  const [listChannel, setListChannel] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>("");
  const currentChannelRef = useRef<string | null>(null);

  useEffect(() => {
    const socket = socketService.getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      // Cleanup listeners on unmount
      socket.off(SOCKET_EVENTS.MESSAGE.RECEIVED);
      socket.off(SOCKET_EVENTS.MESSAGE.READ);
      socket.off(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE_RESPONSE);
      socket.off(SOCKET_EVENTS.CHANNEL.FIND_BY_ID_RESPONSE);
      socket.off(SOCKET_EVENTS.MESSAGE.LOAD_RESPONSE);
      socket.off(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL_RESPONSE);
    };
  }, []);

  useEffect(() => {
    const socket = socketService.getSocket();
    socket.on(SOCKET_EVENTS.MESSAGE.RECEIVED, (newMessage: any) => {
      setLoading(true);
      setMessages((prev) => {
        const messageId = newMessage.id || newMessage._id;
        const isDuplicate = messageId ?
          prev.some(msg => (msg.id === messageId || msg._id === messageId)) :
          false;
        if (isDuplicate) {
          console.log("Duplicate message detected, not adding");
          return prev;
        }
        console.log("Adding new message to state");
        return [...prev, newMessage];
      });
      setLoading(false);

    });

    socket.on(SOCKET_EVENTS.MESSAGE.READ, (update: any) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === update.messageId ? { ...msg, status: "read" } : msg
        )
      );
    });

    socket.on(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE_RESPONSE, (response: ResponseType) => {
      if (response.success) {
        setChannel(response.data);
        currentChannelRef.current = response.data.id;
        setRoomName(response.data.name || "");
        setLoading(false);
      }
    });

    socket.on(SOCKET_EVENTS.CHANNEL.FIND_BY_ID_RESPONSE, (response: ResponseType) => {
      if (response.success) {
        setChannel(response.data);
        currentChannelRef.current = response.data.id;
        setRoomName(response.data.name || "");
        setLoading(false);
      }
    });

    socket.on(SOCKET_EVENTS.MESSAGE.LOAD_RESPONSE, (response: ResponseType) => {
      if (response?.success) {
        setMessages(response.data);
        setLoading(false);
      }
    });

    socket.on(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL_RESPONSE, (response: ResponseType) => {
      if (response.success) {
        setListChannel(response.data);
        setLoading(false);
      }
    });

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE.RECEIVED);
      socket.off(SOCKET_EVENTS.MESSAGE.READ);
      socket.off(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE_RESPONSE);
      socket.off(SOCKET_EVENTS.CHANNEL.FIND_BY_ID_RESPONSE);
      socket.off(SOCKET_EVENTS.MESSAGE.LOAD_RESPONSE);
      socket.off(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL_RESPONSE);
    };
  }, [currentUserId]);

  const sendMessage = useCallback(
    (channelId: string, content: string) => {
      if (!channelId || !content.trim()) {
        console.error("Cannot send message: Missing channel ID or content");
        return;
      }

      const socket = socketService.getSocket();
      const messageData = {
        channelId,
        senderId: currentUserId,
        content: content.trim(),
        timestamp: new Date().toISOString(),
        status: "sent"
      };
      socket.emit(SOCKET_EVENTS.MESSAGE.SEND, messageData);
    },
    [currentUserId])

  const readMessage = useCallback(
    (messageId: string) => {
      const socket = socketService.getSocket();
      const readData = { messageId, readerId: currentUserId };
      socket.emit(SOCKET_EVENTS.MESSAGE.READ, readData);
    },
    [currentUserId]
  );

  const findOrCreateChat = useCallback(
    (receiverId: string) => {
      const socket = socketService.getSocket();
      const params = { senderId: currentUserId, receiverId };
      setLoading(true);
      setChannel(null);
      setMessages([]);
      socket.emit(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE, params);
    },
    [currentUserId]
  );

  const findChannelById = useCallback((channelId: string) => {
    const socket = socketService.getSocket();
    setLoading(true);
    const data = { channelId, currentUserId };
    currentChannelRef.current = channelId;
    socket.emit(SOCKET_EVENTS.CHANNEL.FIND_BY_ID, data);
  }, [currentUserId]);

  const loadMessages = useCallback((channelId: string) => {
    if (!channelId) {
      console.error("Cannot load messages: No channel ID provided");
      return;
    }
    const socket = socketService.getSocket();
    setLoading(true);
    setMessages([]);
    currentChannelRef.current = channelId;
    socket.emit(SOCKET_EVENTS.MESSAGE.LOAD, channelId);
  }, []);

  const loadChannel = useCallback((userId: string) => {
    if (userId) {
      const socket = socketService.getSocket();
      setLoading(true);
      setListChannel([]);
      const params = { currentUserId: userId };
      socket.emit(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL, params);
    }
  }, []);

  return {
    messages,
    sendMessage,
    readMessage,
    findOrCreateChat,
    channel,
    findChannelById,
    loading,
    loadMessages,
    roomName,
    loadChannel,
    listChannel,
  };
};  