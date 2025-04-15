import React, { createContext, useContext } from 'react';
import { useChat } from '@/hook/api/useChat';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface ChatContextType {
  findOrCreateChat: (receiverId: string) => void;
  channel: any;
  loading: boolean;
  joinRoom: (channelId: string) => void;
  messages: any[];
  sendMessage: (channelId: string, content: string) => void;
  loadChannel: (userId: string) => void;
  listChannel: any[];
  createGroup: (name: string, members: string[]) => void;
  leaveRoom: (channelId: string) => void;
  uploadFile: (channelId: string, file: File) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ userId?: string; children: React.ReactNode }> = ({ userId, children }) => {
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;

  // Use userId from props if provided, otherwise try to get it from me object
  const effectiveUserId = userId || me?.id || '';
  const chatHook = useChat(effectiveUserId);

  return <ChatContext.Provider value={chatHook}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};