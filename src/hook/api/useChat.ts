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
  FILE: {
    UPLOAD: "file:upload",
    UPLOAD_RESPONSE: "file:uploadResponse",
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

interface UserType {
  id: string;
  name?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
}

interface ChannelMemberType {
  userId: string;
  role?: string;
  user?: UserType;
}

interface ChannelType {
  id: string;
  name?: string;
  type?: 'direct' | 'group';
  members: ChannelMemberType[];
  createdAt?: string;
  updatedAt?: string;
  message?: string;
  time?: string;
  lastMessage?: MessageType;
  isRead?: boolean;
  avatar?: string;
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
        currentChannelRef.current = response.data.channel.id;
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
            // Update the channel with the latest message
            return {
              ...channel,
              message: message.content,
              time: message.timestamp,
              lastMessage: message,
              isRead: currentChannelRef.current === message.channelId
            };
          }
          return channel;
        });
      });
    };
    const receivedMessage = (message: any) => {
      console.log("Received message:", message);
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
      setLoading(false);
    }

    const loadChannelResponse = (response: ResponseType) => {
      if (response.success) {
        // Remove duplicates using a Set with channel IDs
        const uniqueChannels = (response.data as ChannelType[]).filter((channel, index, self) =>
          index === self.findIndex((c) => c.id === channel.id)
        );

        setListChannel(uniqueChannels);
        setLoading(false);
      } else {
        console.error("Failed to load channel:", response.message);
        setLoading(false);
      }
    }

    const createGroupResponse = (response: ResponseType) => {
      if (response.success) {
        setListChannel((prev) => {
          const channelExists = prev.some(
            (channel) => channel.id === response.data.id
          );

          if (channelExists) {
            console.log("Channel already exists in list, not adding duplicate:", response.data.id);
            return prev;
          }

          console.log("Adding new channel to list:", response.data.id);
          return [...prev, response.data];
        });
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
        console.log("Left room successfully:", response.data);
        setListChannel((prev) => prev.filter(channel => channel.id !== response.data.id));
      }
      else {
        console.error("Failed to leave room:", response.message);
        setLoading(false);
      }
    }

    const uploadFileResponse = (response: ResponseType) => {
      if (response.success) {
        const newMessage = response.data.message;
        setMessages((prev) => {
          const messageId = newMessage.id;
          const isDuplicate = messageId ? 
            prev.some(msg => (msg.id === messageId)) : 
            false;
            
          if (isDuplicate) {
            console.log("Duplicate file message detected, not adding");
            return prev;
          }
          
          return [...prev, newMessage];
        });
        
        updateChannelWithMessage(response.data.message);
      } else {
        console.error("Failed to upload file:", response.message);
      }
      setLoading(false);
    };


    socket.on(SOCKET_EVENTS.CHANNEL.JOIN_ROOM_RESPONSE, joinRoomResponse);
    socket.on(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE_RESPONSE, findOrCreateResponse);
    socket.on(SOCKET_EVENTS.MESSAGE.RECEIVED, receivedMessage);
    socket.on(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL_RESPONSE, loadChannelResponse);
    socket.on(SOCKET_EVENTS.CHANNEL.CREATE_RESPONSE, createGroupResponse);
    socket.on(SOCKET_EVENTS.CHANNEL.LEAVE_ROOM_RESPONSE, leaveRoomResponse);
    socket.on(SOCKET_EVENTS.FILE.UPLOAD_RESPONSE, uploadFileResponse);

    return () => {
      socket.off(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE_RESPONSE, findOrCreateResponse);
      socket.off(SOCKET_EVENTS.CHANNEL.JOIN_ROOM_RESPONSE, joinRoomResponse);
      socket.off(SOCKET_EVENTS.MESSAGE.RECEIVED, receivedMessage);
      socket.off(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL_RESPONSE, loadChannelResponse);
      socket.off(SOCKET_EVENTS.CHANNEL.CREATE_RESPONSE, createGroupResponse);
      socket.off(SOCKET_EVENTS.CHANNEL.LEAVE_ROOM_RESPONSE, leaveRoomResponse);
      socket.off(SOCKET_EVENTS.FILE.UPLOAD_RESPONSE, uploadFileResponse);
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
    setLoading(true);
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

  const uploadFile = useCallback((channelId: string, file: File) => {
    const socket = socketService.getSocket();
    setLoading(true);
    const reader = new FileReader();
    console.log("Uploading file:", file);
    reader.onload = () => {
      const fileData = reader.result as ArrayBuffer;
      const fileMessage = {
        channelId,
        senderId: currentUserId,
        fileName: file.name,
        fileData,
        timestamp: new Date().toISOString(),
        status: "sent",
      };
      console.log("File data read:", fileData);
      socket.emit(SOCKET_EVENTS.FILE.UPLOAD, fileMessage);
    };
    reader.readAsArrayBuffer(file);
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
    uploadFile
  };
};