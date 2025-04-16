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
    CREATE: "channel:create",
    CREATE_RESPONSE: "channel:createResponse",
    JOIN_ROOM: "joinRoom",
    JOIN_ROOM_RESPONSE: "joinRoomResponse",
    LEAVE_ROOM: "leaveRoom",
    LEAVE_ROOM_RESPONSE: "leaveRoomResponse",
  },
  FRIEND: {
    ADD_FRIEND: "friend:add",
    ADD_FRIEND_RESPONSE: "friend:addResponse",
    REMOVE_FRIEND: "friend:remove",
    REMOVE_FRIEND_RESPONSE: "friend:removeResponse",
    ACCEPT_FRIEND: "friend:accept",
    ACCEPT_FRIEND_RESPONSE: "friend:acceptResponse",
    REJECT_FRIEND: "friend:reject",
    REJECT_FRIEND_RESPONSE: "friend:rejectResponse",
    LIST_FRIEND: "friend:list",
    LIST_FRIEND_RESPONSE: "friend:listResponse",
  },
};

interface ResponseType {
  success: boolean;
  message: string;
  data: any;
}

interface MessageType {
  id?: string;
  _id?: string;
  channelId: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: string;
  sender?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export const useChat = (currentUserId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [channel, setChannel] = useState<any>(null);
  const [listChannel, setListChannel] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const currentChannelRef = useRef<string | null>(null);

  const socketService = SocketService.getInstance(currentUserId);

  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket.connected) {
      socket.connect();
    }
    console.log("Socket connected:", socket.connected);

    const findOrCreateResponse = (response: ResponseType) => {
      if (response.success) {
        console.log("Channel received:", response.data);
        setChannel(response.data);
        setLoading(false);
        currentChannelRef.current = response.data.id;
      } else {
        console.error("Failed to create/find channel:", response.message);
        setLoading(false);
      }
    };

    const joinRoomResponse = (response: ResponseType) => {
      if (response.success) {
        setChannel(response.data.channel);
        setMessages(response.data.messages);
        setLoading(false);
        currentChannelRef.current = response.data.id;
      }
      else {
        console.error("Failed to join room:", response.message);
        setLoading(false);
      }
    }

    const updateChannelWithMessage = (message: MessageType) => {
      setListChannel(prevChannels => {
        return prevChannels.map(channel => {
          if (channel.id === message.channelId) {
            return {
              ...channel,
              id: 123456789,
              avatar: message.sender?.avatar || "https://example.com/default-avatar.png",
              name:    message.sender?.name || "Unknown",
              message:  message.content,
              time:   message.timestamp,
              isRead:   message.status === "read",
              isChoose:   currentChannelRef.current === message.channelId,
            };
          }
          return channel;
        });
      });
    };

    const receivedMessage = (message: any) => { 
      const members = message.members;
      const isMember = members.some((member: any) => member.userId === currentUserId);
      if (!isMember) {
        console.log("Received message not for current user, ignoring:", message);
        return;
      }
      
      loadChannel(currentUserId);

      updateChannelWithMessage(message);

      if (message.channelId !== currentChannelRef.current) {
        console.log("Message is for a different channel, ignoring", {
          messageChannelId: message.channelId,
          currentChannelId: currentChannelRef.current
        });
        return;
      }
      setMessages((prev) => {
        const messageId = message.id || message._id;
        const isDuplicate = messageId ?
          prev.some(msg => (msg.id === messageId || msg._id === messageId)) :
          false;

        if (isDuplicate) {
          console.log("Duplicate message detected, not adding");
          return prev;
        }

        console.log("Adding new message to state for channel:", currentChannelRef.current);
        return [...prev, message];
      });
    }

    const loadChannelResponse = (response: ResponseType) => {
      if (response.success) {
        setListChannel(response.data);
        setLoading(false);
      }
      else {
        console.error("Failed to load channel:", response.message);
        setLoading(false);
      }
    }

    const createGroupResponse = (response: ResponseType) => {
      if (response.success) {
        setListChannel((prev) => [...prev, response.data]);
        setLoading(false);
      } else {
        console.error("Failed to create group:", response.message);
        setLoading(false);
      }
    }

    const leaveRoomResponse = (response: ResponseType) => {
      if (response.success) {
        setChannel(null);
        setMessages([]);
        setLoading(false);
        setListChannel((prev) => prev.filter(channel => channel.id !== response.data.channelId));
      }
      else {
        console.error("Failed to leave room:", response.message);
        setLoading(false);
      }
    }






    socket.on(SOCKET_EVENTS.CHANNEL.JOIN_ROOM_RESPONSE, joinRoomResponse);
    socket.on(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE_RESPONSE, findOrCreateResponse);
    socket.on(SOCKET_EVENTS.MESSAGE.RECEIVED, receivedMessage);
    socket.on(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL_RESPONSE, loadChannelResponse);
    socket.on(SOCKET_EVENTS.CHANNEL.CREATE_RESPONSE, createGroupResponse);
    socket.on(SOCKET_EVENTS.CHANNEL.LEAVE_ROOM_RESPONSE, leaveRoomResponse);

    return () => {
      socket.off(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE_RESPONSE, findOrCreateResponse);
      socket.off(SOCKET_EVENTS.CHANNEL.JOIN_ROOM_RESPONSE, joinRoomResponse);
      socket.off(SOCKET_EVENTS.MESSAGE.RECEIVED, receivedMessage);
      socket.off(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL_RESPONSE, loadChannelResponse);
      socket.off(SOCKET_EVENTS.CHANNEL.CREATE_RESPONSE, createGroupResponse);
      socket.off(SOCKET_EVENTS.CHANNEL.LEAVE_ROOM_RESPONSE, leaveRoomResponse);
    };
  }, []);

  const findOrCreateChat = useCallback((receiverId: string) => {
    setLoading(true);
    setChannel(null);
    setMessages([]);
    const socket = socketService.getSocket();
    const params = { senderId: currentUserId, receiverId };
    socket.emit(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE, params);
  }, []);

  const joinRoom = useCallback((channelId: string) => {
    setLoading(true);
    setChannel(null);
    setMessages([]);
    const socket = socketService.getSocket();
    currentChannelRef.current = channelId;
    const params = { channelId, currentUserId };
    socket.emit(SOCKET_EVENTS.CHANNEL.JOIN_ROOM, params);
  }, []);

  const sendMessage = useCallback((channelId: string, content: string) => {
    const socket = socketService.getSocket();
    const messageData = {
      channelId,
      senderId: currentUserId,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      status: "sent"
    };
    currentChannelRef.current = channelId;
    socket.emit(SOCKET_EVENTS.MESSAGE.SEND, messageData);
  }, []);

  const loadChannel = useCallback((userId: string) => {
    setLoading(true);
    const socket = socketService.getSocket();
    const params = { currentUserId: userId };
    socket.emit(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL, params);
  }, []);

  const createGroup = useCallback((name: string, members: string[]) => {
    setLoading(true);
    const socket = socketService.getSocket();
    const params = { name, currentUserId, members: members };
    socket.emit(SOCKET_EVENTS.CHANNEL.CREATE, params);
  }, []);

  const leaveRoom = useCallback((channelId: string) => {
    const socket = socketService.getSocket();
    const params = { 
      channelId,
      userId: currentUserId
     };
    socket.emit(SOCKET_EVENTS.CHANNEL.LEAVE_ROOM, params);
  }, []);

  return {
    findOrCreateChat,
    joinRoom,
    sendMessage,
    loadChannel,
    createGroup,
    leaveRoom,
    listChannel,
    channel,
    messages,
    loading,
  };
};