import axiosConfig from "./axiosConfig";

const api = "/api/v1/messages";

export const getMessages = async (receiverId: string, senderId: string) => {
  try {
    const url = `${api}/${receiverId}/${senderId}`;
    return await axiosConfig.get(url);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { success: false, data: [] };
  }
};

export const getMessagesByCharId = async (chatId: string) => {
  try {
    const url = `${api}?chatId=${chatId}`;
    return await axiosConfig.get(url);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { success: false, data: [] };
  }
};

export const markAsRead = async (messageId: string, userId: string) => {
  try {
    const url = `${api}/read`;
    return await axiosConfig.post(url, { messageId, readerId: userId });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return { success: false };
  }
};
