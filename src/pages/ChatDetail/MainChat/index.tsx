import { Box } from "@mui/material";
import InfoUser from "./InfoUser/InfoUser";
import ChatInput from "./ChatInput";
import MessageChat from "@/components/Message";
import MessageSystem from "@/components/MessageSystem";
import { useRef, useEffect } from "react";

function MainChat(
  {
    channel,
    messages,
    sendMessage,
    me,
    channelId,
  }: {
    channel: any;
    messages: any;
    sendMessage: any;
    me: any;
    channelId: string | undefined;
  }
) {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      window.requestAnimationFrame(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      sx={{
        maxWidth: "calc(100% - 415px)",
        height: "100vh",
        bgcolor: "grey.300",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        marginLeft: "59px",
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
        <InfoUser channel={channel} />

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
        {
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
                mess.messageType === "system" ? (
                  <MessageSystem
                    key={mess.id || index} // Đảm bảo có key unique
                    {...mess}
                  />
                ) : (
                  <MessageChat
                    key={mess.id || index} // Đảm bảo có key unique
                    {...mess}
                    isMe={mess.sender.id === me.id}
                  />
                )
              ))
            ) : (
              <Box sx={{ textAlign: "center", color: "grey.500", mt: 3 }}>
                Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
              </Box>
            )}
          </Box>
        }
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
        <ChatInput channelId={channelId} sendMessage={sendMessage} />
      </Box>
    </Box>
  );
}

export default MainChat;
