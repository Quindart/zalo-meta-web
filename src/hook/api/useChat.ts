import SocketService from "@/services/socket/SocketService";
import { AssignRoleParams } from "@/types";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from 'react-router-dom';


const SOCKET_EVENTS = {
  MESSAGE: {
    SEND: "message:send",
    RECEIVED: "message:received",
    DELIVERED: "message:delivered",
    READ: "message:read",
    ERROR: "message:error",
    LOAD: "message:load",
    LOAD_RESPONSE: "message:loadResponse",
    RECALL: "message:recall",
    RECALL_RESPONSE: "message:recallResponse",
    DELETE: "message:delete",
    DELETE_RESPONSE: "message:deleteResponse",
    DELETE_HISTORY: "message:deleteHistory",
    DELETE_HISTORY_RESPONSE: "message:deleteHistoryResponse",
    FORWARD: "message:forward"
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
    DISSOLVE_GROUP: "channel:dissolveGroup",
    DISSOLVE_GROUP_RESPONSE: "channel:dissolveGroupResponse",
    DISSOLVE_GROUP_RESPONSE_MEMBER: "channel:dissolveGroupResponseMember",
    ADD_MEMBER: "channel:addMember",
    ADD_MEMBER_RESPONSE: "channel:addMemberResponse",
    ASSIGN_ROLE: "channel:assignRole",
    ROLE_UPDATED: "channel:roleUpdated",
    REMOVE_MEMBER: 'channel:removeMember',
    REMOVE_MEMBER_RESPONSE: 'channel:removeMemberResponse',
  },
  FILE: {
    UPLOAD: "file:upload",
    UPLOAD_RESPONSE: "file:uploadResponse",
    UPLOAD_GROUP: "file:uploadGroup",
    UPLOAD_GROUP_RESPONSE: "file:uploadGroupResponse"
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
  EMOJI: {
    LOAD_EMOJIS_OF_MESSAGE: "emoji:loadEmojis",
    INTERACT_EMOJI: "emoji:interactEmoji",
    REMOVE_MY_EMOJI: "emoji:removeMyEmoji",
    LOAD_EMOJIS_OF_MESSAGE_RESPONSE: "emoji:loadEmojisResponse",
    INTERACT_EMOJI_RESPONSE: "emoji:interactEmojiResponse",
    REMOVE_MY_EMOJI_RESPONSE: "emoji:removeMyEmojiResponse"
  },
};



interface ResponseType {
  success: boolean;
  message: string;
  data: any;
}
interface Emoji {
  emoji: string;
  userId: string;
  messageId: string,
  quantity: number;
  createAt: string;
  updateAt: string;
  deleteAt?: string;
}
interface MessageType {
  id?: string;
  _id?: string;
  channelId: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: string;
  emojis?: Emoji[]
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
  isDeleted?: boolean;
}

export const useChat = (currentUserId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [channel, setChannel] = useState<any>(null);
  const [listChannel, setListChannel] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const currentChannelRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketService = SocketService.getInstance(currentUserId);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket.connected) {
      socket.connect();
    }
    const findOrCreateResponse = (response: ResponseType) => {
      if (response.success) {
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
        setListChannel((prev) => prev.filter(channel => channel.id !== response.data.id));
      }
      else {
        console.error("Failed to leave room:", response.message);
        setLoading(false);
      }
    }
    const dissolveGroupResponse = (response: ResponseType) => {
      if (response.success) {
        setChannel(null);
        setMessages([]);
        setLoading(false);
        setListChannel((prev) => prev.filter(channel => channel.id !== response.data.id));
        navigate('/chats');
      }
      else {
        console.error("Failed to dissolve group:", response.message);
        setLoading(false);
      }
    }
    const dissolveGroupResponseMember = (response: ResponseType) => {
      if (response.success) {
        if (response.data.channelId === currentChannelRef.current) {
          setChannel(null);
          setMessages([]);
          navigate('/chats');
        } else {
          updateChannelWithMessage(response.data.message);
        }
      }
      else {
        console.error("Failed to dissolve group:", response.message);
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

    const recallMessageResponse = (response: ResponseType) => {
      if (response.success) {
        const messageId = response.data.messageId;
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

        loadChannel(currentUserId);
        setLoading(false);

      } else {
        console.error("Failed to recall message:", response.message);
      }
    }

    const deleteMessageResponse = (response: ResponseType) => {
      if (response.success) {
        const messageId = response.data.messageId;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, content: "Tin nhắn đã được thu hồi", isRecalled: true, messageType: "text" } : msg
          )
        );
        setLoading(false);
      } else {
        console.error("Failed to delete message:", response.message);
        setLoading(false);
      }
    }

    const deleteAllMessagesResponse = (response: ResponseType) => {
      if (response.success) {
        const channelId = response.data.channelId;
        //remove channel from listChannel
        setListChannel((prev) => prev.filter(channel => channel.id !== channelId));
        setMessages([]);
        setLoading(false);
      }
      else {
        console.error("Failed to delete all messages:", response.message);
        setLoading(false);
      }
    }

    //emoji
    const interactEmojiResponse = (response: ResponseType) => {
      setLoading(false);
      if (response.success && response.data) {
        const updatedMessage: MessageType = response.data;
        setMessages(prev => prev.map(msg =>
          msg.id === updatedMessage._id || msg._id === updatedMessage._id
            ? { ...msg, emojis: updatedMessage.emojis || [] }
            : msg
        ));
      } else {
        setError(response.message || "Không thể bày tỏ cảm xúc");
      }
    };
    const removeMyEmojiResponse = (response: ResponseType) => {
      setLoading(false);
      if (response.success) {
        setMessages(prev => prev.map(msg => {
          if (msg.id === response.data?._id || msg._id === response.data?._id) {
            return {
              ...msg,
              emojis: msg.emojis?.filter((emoji: any) => emoji.userId !== currentUserId) || []
            };
          }
          return msg;
        }));
      } else {
        setError(response.message || "Không thể xóa emoji");
      }
    };
    const forwardMessageHandler = (message: MessageType) => {


      // Check if the channel exists in listChannel
      const existingChannel = listChannel.find((channel) => channel.id === message.channelId);

      if (!existingChannel) {
        // Channel does not exist, so we need to add it to the listChannel
        // You can create a new channel object here based on the message's data
        const newChannel: ChannelType = {
          id: message.channelId,
          name: message.channelId,  // You can use message.channelId or some other logic to set the name
          type: "direct",  // Assuming it's a direct channel for now, adjust as needed
          members: [],  // Populate members if available in the message
          lastMessage: message,
          message: message.content,
          time: message.timestamp,
          isRead: false,
          avatar: "",  // You can use avatar info if available
          isDeleted: false,
        };

        // Add the new channel to the list
        setListChannel((prev) => [...prev, newChannel]);

        // Load the messages for this new channel (if needed)
        loadChannel(currentUserId);
      }

      // Update the current channel with the new forwarded message
      updateChannelWithMessage(message);
    };

    const addMemberResponse = (response: ResponseType) => {
      setLoading(false);
      if (response.success) {
        // response.data chính là channel đã format (có trường members mới)
        setChannel(response.data);           // Cập nhật channel hiện tại nếu đang view chi tiết
        setListChannel(prev => {
          // Cập nhật listChannel nếu cần: replace channel cũ bằng channel mới
          return prev.map(ch =>
            ch.id === response.data.id ? response.data : ch
          );
        });
      } else {
        console.error("Thêm thành viên thất bại:", response.message);
      }
    };

    const uploadImageGroupResponse = (response: ResponseType) => {
      console.log("File uploaded successfully:", response.data);
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

    const assignRoleUpdatedResponse = (response: ResponseType) => {
      if (response.success) {
        setChannel(response.data);
        setListChannel(prev => {
          return prev.map(ch =>
            ch.id === response.data.id ? response.data : ch
          );
        });
      } else {
        console.error("Phân quyền thành viên thất bại:", response.message);
      }
    }
    const removeMemberResponse = (response: ResponseType) => {
      setLoading(false);
      console.log("💲💲💲 ~ removeMemberResponse ~ response.data:", response)

      if (response.success) {
        setChannel(response.data);

        setListChannel(prev => {
          return prev.map(ch =>
            ch.id === response.data.id ? response.data : ch
          );
        });
      } else {
        console.error(response.message);
      }
    }
    socket.on(SOCKET_EVENTS.CHANNEL.JOIN_ROOM_RESPONSE, joinRoomResponse);
    socket.on(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE_RESPONSE, findOrCreateResponse);
    socket.on(SOCKET_EVENTS.MESSAGE.RECEIVED, receivedMessage);
    socket.on(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL_RESPONSE, loadChannelResponse);
    socket.on(SOCKET_EVENTS.CHANNEL.CREATE_RESPONSE, createGroupResponse);
    socket.on(SOCKET_EVENTS.CHANNEL.LEAVE_ROOM_RESPONSE, leaveRoomResponse);
    socket.on(SOCKET_EVENTS.FILE.UPLOAD_RESPONSE, uploadFileResponse);
    socket.on(SOCKET_EVENTS.CHANNEL.DISSOLVE_GROUP_RESPONSE, dissolveGroupResponse);
    socket.on(SOCKET_EVENTS.CHANNEL.DISSOLVE_GROUP_RESPONSE_MEMBER, dissolveGroupResponseMember);
    socket.on(SOCKET_EVENTS.MESSAGE.RECALL_RESPONSE, recallMessageResponse);
    socket.on(SOCKET_EVENTS.MESSAGE.DELETE_RESPONSE, deleteMessageResponse);
    socket.on(SOCKET_EVENTS.EMOJI.INTERACT_EMOJI_RESPONSE, interactEmojiResponse);
    socket.on(SOCKET_EVENTS.EMOJI.REMOVE_MY_EMOJI_RESPONSE, removeMyEmojiResponse);
    socket.on(SOCKET_EVENTS.MESSAGE.DELETE_HISTORY_RESPONSE, deleteAllMessagesResponse);
    socket.on(SOCKET_EVENTS.MESSAGE.FORWARD, forwardMessageHandler);
    socket.on(SOCKET_EVENTS.CHANNEL.ADD_MEMBER_RESPONSE, addMemberResponse);
    socket.on(SOCKET_EVENTS.FILE.UPLOAD_GROUP_RESPONSE, uploadImageGroupResponse);
    socket.on(SOCKET_EVENTS.CHANNEL.ROLE_UPDATED, assignRoleUpdatedResponse);
    socket.on(SOCKET_EVENTS.CHANNEL.REMOVE_MEMBER_RESPONSE, removeMemberResponse);

    return () => {
      socket.off(SOCKET_EVENTS.CHANNEL.FIND_ORCREATE_RESPONSE, findOrCreateResponse);
      socket.off(SOCKET_EVENTS.CHANNEL.JOIN_ROOM_RESPONSE, joinRoomResponse);
      socket.off(SOCKET_EVENTS.MESSAGE.RECEIVED, receivedMessage);
      socket.off(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL_RESPONSE, loadChannelResponse);
      socket.off(SOCKET_EVENTS.CHANNEL.CREATE_RESPONSE, createGroupResponse);
      socket.off(SOCKET_EVENTS.CHANNEL.LEAVE_ROOM_RESPONSE, leaveRoomResponse);
      socket.off(SOCKET_EVENTS.FILE.UPLOAD_RESPONSE, uploadFileResponse);
      socket.off(SOCKET_EVENTS.CHANNEL.DISSOLVE_GROUP_RESPONSE, dissolveGroupResponse);
      socket.off(SOCKET_EVENTS.CHANNEL.DISSOLVE_GROUP_RESPONSE_MEMBER, dissolveGroupResponseMember);
      socket.off(SOCKET_EVENTS.MESSAGE.RECALL_RESPONSE, recallMessageResponse);
      socket.off(SOCKET_EVENTS.MESSAGE.DELETE_RESPONSE, deleteMessageResponse);
      socket.off(SOCKET_EVENTS.EMOJI.INTERACT_EMOJI_RESPONSE, interactEmojiResponse);
      socket.off(SOCKET_EVENTS.EMOJI.REMOVE_MY_EMOJI_RESPONSE, removeMyEmojiResponse);
      socket.off(SOCKET_EVENTS.MESSAGE.DELETE_HISTORY_RESPONSE, deleteAllMessagesResponse);
      socket.off(SOCKET_EVENTS.MESSAGE.FORWARD, forwardMessageHandler);
      socket.off(SOCKET_EVENTS.CHANNEL.ADD_MEMBER_RESPONSE, addMemberResponse);
      socket.off(SOCKET_EVENTS.FILE.UPLOAD_GROUP_RESPONSE, uploadImageGroupResponse);
      socket.off(SOCKET_EVENTS.CHANNEL.ROLE_UPDATED, assignRoleUpdatedResponse);
      socket.off(SOCKET_EVENTS.CHANNEL.REMOVE_MEMBER_RESPONSE, removeMemberResponse);

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


  const dissolveGroup = useCallback((channelId: string) => {
    setLoading(true);
    const socket = socketService.getSocket();
    const params = {
      channelId,
      userId: currentUserId
    };
    socket.emit(SOCKET_EVENTS.CHANNEL.DISSOLVE_GROUP, params);
  }, []);

  const deleteMessage = useCallback((messageId: string, channelId: string) => {
    const socket = socketService.getSocket();
    const params = {
      senderId: currentUserId,
      messageId,
      channelId
    };
    socket.emit(SOCKET_EVENTS.MESSAGE.DELETE, params);
  }, [])

  const recallMessage = useCallback((messageId: string) => {
    const socket = socketService.getSocket();
    const params = {
      senderId: currentUserId,
      messageId,

    };
    socket.emit(SOCKET_EVENTS.MESSAGE.RECALL, params);
  }, [])
  //emoji
  const interactEmoji = useCallback((messageId: string, emoji: string, userId: string, channelId: string) => {
    setLoading(true);
    setError(null);
    const socket = socketService.getSocket();
    const params = { messageId, emoji, userId, channelId };
    socket.emit(SOCKET_EVENTS.EMOJI.INTERACT_EMOJI, params);
  }, [])

  const removeMyEmoji = useCallback((messageId: string, userId: string, channelId: string) => {
    setLoading(true);
    setError(null);
    const socket = socketService.getSocket();
    const params = { messageId, userId, channelId };
    socket.emit(SOCKET_EVENTS.EMOJI.REMOVE_MY_EMOJI, params);
  }, [])


  const deleteAllMessages = useCallback((channelId: string) => {
    const socket = socketService.getSocket();
    const params = {
      senderId: currentUserId,
      channelId
    };
    socket.emit(SOCKET_EVENTS.MESSAGE.DELETE_HISTORY, params);
  }, [])

  const forwardMessage = useCallback((messageId: string, channelId: string) => {
    const socket = socketService.getSocket();
    // Gửi sự kiện forwardMessage đến server
    const params = {
      senderId: currentUserId,
      messageId, // ID của tin nhắn cần chuyển tiếp
      channelId, // ID của phòng đích
    };

    setLoading(true);
    socket.emit(SOCKET_EVENTS.MESSAGE.FORWARD, params);

  }, [currentUserId]);

  const addMember = useCallback((channelId: string, userId: string) => {
    setLoading(true);
    const socket = socketService.getSocket();
    socket.emit(SOCKET_EVENTS.CHANNEL.ADD_MEMBER, { channelId, userId });
  }, []);

  const uploadImageGroup = useCallback((channelId: string, files: File[]) => {
    setLoading(true);
    const socket = socketService.getSocket();

    // Create promises for all file reads
    const fileReadPromises = files.map(file => {
      return new Promise<{ fileName: string, fileData: ArrayBuffer }>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            fileName: file.name,
            fileData: reader.result as ArrayBuffer
          });
        };
        reader.readAsArrayBuffer(file);
      });
    });

    // Once all files are read, send the group message
    Promise.all(fileReadPromises).then(filesData => {
      const groupMessage = {
        channelId,
        senderId: currentUserId,
        files: filesData,
        timestamp: new Date().toISOString(),
        status: "sent"
      };

      socket.emit(SOCKET_EVENTS.FILE.UPLOAD_GROUP, groupMessage);
    });
  }, []);

  const removeMember = useCallback((channelId: string, senderId: string, userId: string) => {
    setLoading(true);
    const socket = socketService.getSocket();
    socket.emit(SOCKET_EVENTS.CHANNEL.REMOVE_MEMBER, { channelId, senderId, userId });
    setLoading(false);
    navigate(`/chats/${channelId}`)
  }, []);



  const assignRole = useCallback(({ channelId, userId, targetUserId, newRole }: AssignRoleParams) => {
    const socket = socketService.getSocket();
    socket.emit(SOCKET_EVENTS.CHANNEL.ASSIGN_ROLE, { channelId, userId, targetUserId, newRole });
  }, [])
  return {
    findOrCreateChat,
    joinRoom,
    deleteMessage,
    recallMessage,
    sendMessage,
    loadChannel,
    createGroup,
    leaveRoom,
    listChannel,
    dissolveGroup,
    deleteAllMessages,
    uploadImageGroup,
    channel,
    messages,
    loading,
    uploadFile,
    interactEmoji,
    removeMyEmoji,
    error,
    forwardMessage,
    addMember,
    assignRole,
    removeMember
  };
};