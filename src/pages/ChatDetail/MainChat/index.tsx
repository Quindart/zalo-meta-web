import { Box, Typography } from "@mui/material";
import InfoUser from "./InfoUser/InfoUser";
import ChatInput from "./ChatInput";
import MessageChat from "@/components/Message";
import MessageSystem from "@/components/MessageSystem";
import { useRef, useEffect } from "react";
import FileCard from "@/components/FileCard";

function MainChat(
  {
    channel,
    messages,
    sendMessage,
    me,
    channelId,
    uploadFile,
  }: {
    channel: any;
    messages: any;
    sendMessage: any;
    me: any;
    channelId: string | undefined;
    uploadFile: (channelId: string, file: File) => void;
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

  const RenderMessage = ({ mess, index }: { mess: any; index: number }) => {
    if (mess.messageType === "system") {
      return <MessageSystem key={mess.id || index} {...mess} />;
    } else if (mess.messageType === "file") {
      return <FileCard name={mess.file.filename} size={mess.file.size} path={mess.file.path} extension={mess.file.extension} isMe={mess.sender.id === me.id} />;
    } else {
      return <MessageChat {...mess} isMe={mess.sender.id === me.id} />;
    }
  }

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
                RenderMessage({ mess, index })
              ))
            ) : (
              <Box sx={{ textAlign: "center", color: "grey.500", mt: 3 }}>
                Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
              </Box>
            )}
          </Box>
        }
      </Box>

      {channel && !channel.isDeleted ?
        (
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
            <ChatInput channelId={channelId} sendMessage={sendMessage} uploadFile={uploadFile} />
          </Box>
        ) : (
          <Box
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(245, 245, 245, 0.8)',
              borderTop: '1px solid #e0e0e0',
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#d32f2f',
                fontWeight: 500,
                fontSize: '0.875rem',
                textAlign: 'center',
              }}
            >
              Nhóm đã bị giải tán
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#757575',
                mt: 0.5,
                fontSize: '0.75rem',
                textAlign: 'center',
              }}
            >
              Không thể gửi hoặc nhận tin nhắn trong nhóm này nữa.
            </Typography>
          </Box>
        )
      }
    </Box>
  );
}

export default MainChat;
