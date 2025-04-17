import { memo, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import InfoUser from "./InfoUser/InfoUser";
import ChatInput from "./ChatInput";
import MessageChat from "@/components/Message";
import MessageSystem from "@/components/MessageSystem";
import FileCard from "@/components/FileCard";
import ImageMessage from "@/components/ImageMessage";
import VideoMessage from "@/components/VideoMessage";

const RenderMessage = memo(({ mess, index, meId }: { mess: any; index: number; meId: string }) => {
  if (mess.messageType === "system") {
    return <MessageSystem {...mess} />;
  } else if (mess.messageType === "file") {
    return (
      <FileCard
        key={mess.id || index}
        name={mess.file.filename}
        size={mess.file.size}
        path={mess.file.path}
        extension={mess.file.extension}
        isMe={mess.sender.id === meId}
      />
    );
  } else if (mess.messageType === "image") {
    if (mess.file) {
      return (
        <ImageMessage
          key={mess.id || index}
          name={mess.file.filename}
          size={mess.file.size}
          path={mess.file.path}
          extension={mess.file.extension}
          isMe={mess.sender.id === meId}
          sender={mess.sender}
          createdAt={mess.createdAt}
        />
      );
    }
  } else if (mess.messageType === "video") {
    return (
      <VideoMessage
        key={mess.id || index}
        name={mess.file.filename}
        size={mess.file.size}
        path={mess.file.path}
        extension={mess.file.extension}
        isMe={mess.sender.id === meId}
        sender={mess.sender}
        createdAt={mess.createdAt}
      />
    );
  } else {
    return <MessageChat {...mess} isMe={mess.sender.id === meId} />;
  }
});

const RenderChatInput = memo(({ channel, channelId, sendMessage, uploadFile }: { channel: any; channelId: string | undefined, sendMessage: any; uploadFile: any; }) => {
  return (
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
      <ChatInput
        channel={channel}
        channelId={channelId}
        sendMessage={sendMessage}
        uploadFile={uploadFile}
      />
    </Box>
  )
});

function MainChat({
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
}) {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const meId = me.id;

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
  }, [messages.length]);

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
            messages
              .filter((mess) => mess.isDeletedById !== meId)
              .map((mess: any, index: number) => (
                <RenderMessage key={mess.id || index} mess={mess} index={index} meId={meId} />
              ))
          ) : (
            <Box sx={{ textAlign: "center", color: "grey.500", mt: 3 }}>
              Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
            </Box>
          )}
        </Box>
      </Box>
      <RenderChatInput
        channel={channel}
        channelId={channelId}
        sendMessage={sendMessage}
        uploadFile={uploadFile}
      />
    </Box>
  );
}

export default memo(MainChat);