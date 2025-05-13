/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";
import { useChat } from "@/hook/api/useChat";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AssignRoleParams } from "@/types";

interface ChatContextType {
  findOrCreateChat: (receiverId: string) => void;
  channel: any;
  joinRoom: (channelId: string) => void;
  deleteAllMessages: (channelId: string) => void;
  messages: any[];
  sendMessage: (channelId: string, content: string) => void;
  deleteMessage: (messageId: string, channelId: string) => void;
  recallMessage: (messageId: string) => void;
  loadChannel: (userId: string) => void;
  uploadImageGroup: (channelId: string, file: File[]) => void;
  listChannel: any[];
  createGroup: (name: string, members: string[]) => void;
  leaveRoom: (channelId: string) => void;
  uploadFile: (channelId: string, file: File) => void;
  dissolveGroup: (channelId: string) => void;
  addMember: (channelId: string, userId: string) => void;
  removeMember: (channelId: string, senderId: string, userId: string) => void;
  assignRole: (data: AssignRoleParams) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{
  userId?: string;
  children: React.ReactNode;
}> = ({ userId, children }) => {
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;

  const effectiveUserId = userId || me?.id || "";
  const chatHook = useChat(effectiveUserId);

  return (
    <ChatContext.Provider value={chatHook}>{children}</ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
