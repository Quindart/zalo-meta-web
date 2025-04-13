import React, { createContext, useContext, useMemo } from 'react';
import { useChat } from '@/hook/api/useChat';

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
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ userId: string; children: React.ReactNode }> = ({ userId, children }) => {
  const chat = useChat(userId);

  const value = useMemo(() => chat, [chat]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};