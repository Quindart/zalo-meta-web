import { useRef, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import InfoUser from "./InfoUser/InfoUser";
import ChatInput from "./ChatInput";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import MessageChat from "@/components/Message";
import { useChat } from "@/hook/api/useChat";
import { useParams } from "react-router-dom";

function MainChat() {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  const params = useParams();
  const channelId = params.id;
  const { 
    channel,
    findChannelById,
    roomName,
    messages,
    loadMessages,
    loading,
  } = useChat(me.id);

  useEffect(() => {
    if (channelId) {
      findChannelById(channelId);
    }
  }, [channelId, findChannelById]);

  useEffect(() => {
    if (channel) {
      loadMessages(channel.id);
    }
  }, [channel]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      sx={{
        maxWidth: "calc(100% - 340px)",
        height: "100vh",
        bgcolor: "grey.300",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        sx={{
          height: 65,
          flexShrink: 0,
          bgcolor: "white",
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: "1px solid #ddd",
          borderRight: "1px solid #ddd",
        }}
      >
        <InfoUser channel={channel} roomName={roomName} />
      </Box>

      <Box
        ref={chatContainerRef}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          paddingBottom: "80px",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              mx: 1,
              my: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages && Array.isArray(messages) && messages.length > 0 ? (
              messages.map((mess: any, index: number) => (
                <MessageChat
                  key={mess.id || index} // Đảm bảo có key unique
                  {...mess}
                  isMe={mess.sender.id === me.id}
                />
              ))
            ) : (
              <Box sx={{ textAlign: "center", color: "grey.500", mt: 3 }}>
                Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "white",
          border: "1px solid #ccc",
          zIndex: 10,
        }}
      >
        <ChatInput channelId={channelId} />
      </Box>
    </Box>
  );
}

export default MainChat;