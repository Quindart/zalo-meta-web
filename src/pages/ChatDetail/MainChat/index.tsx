import { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import InfoUser from "./InfoUser/InfoUser";
import ChatInput from "./ChatInput";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import MessageChat from "@/components/Message";
import { useChatContext } from "@/Context/ChatContextType";
import { useParams } from "react-router-dom";

function MainChat() {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  const params = useParams();
  const channelId = params.id;

  const { channel, messages, sendMessage, joinRoom, loading } = useChatContext();


  useEffect(() => {
    if (channelId) {
      joinRoom(channelId);
    }
  }, [channelId]);

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
          loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <div className="loader"></div>
            </Box>
          ) : (<Box
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
          </Box>)
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
