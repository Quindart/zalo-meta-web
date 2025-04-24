import { memo, useRef, useEffect } from "react";
import { Box } from "@mui/material";
import InfoUser from "./InfoUser/InfoUser";
import ChatInput from "./ChatInput";
import MessageChat from "@/components/Message";
import MessageSystem from "@/components/MessageSystem";
import FileCard from "@/components/FileCard";
import { useChat } from "@/hook/api/useChat";
import ImageMessage from "@/components/ImageMessage";
import VideoMessage from "@/components/VideoMessage";

const RenderMessage = memo(({ mess, meId }: { mess: any; meId: string }) => {
  console.log(mess);
  const useChatContext = useChat(meId);
  const interactEmoji = useChatContext.interactEmoji;
  const removeMyEmoji = useChatContext.removeMyEmoji;
  if (mess.messageType === "system") {
    return <MessageSystem {...mess} />;
  } else if (mess.messageType === "file") {
    return (
      <FileCard
        interactEmoji={interactEmoji}
        removeMyEmoji={removeMyEmoji}
        {...mess}
        isMe={mess.sender.id === meId}
      />
    );
  } else if (mess.messageType === "image") {
    if (mess.file) {
      return (
        <ImageMessage
          interactEmoji={interactEmoji}
          removeMyEmoji={removeMyEmoji}
          {...mess}
          isMe={mess.sender.id === meId}
        />
      );
    }
  } else if (mess.messageType === "video") {
    return (
      <VideoMessage
        interactEmoji={interactEmoji}
        removeMyEmoji={removeMyEmoji}
        {...mess}
        isMe={mess.sender.id === meId}
      />
    );
  } else {
    return (
      <MessageChat
        interactEmoji={interactEmoji}
        removeMyEmoji={removeMyEmoji}
        {...mess}
        isMe={mess.sender.id === meId}
      />
    );
  }
});

const RenderChatInput = memo(
  ({
    channel,
    channelId,
    sendMessage,
    uploadFile,
  }: {
    channel: any;
    channelId: string | undefined;
    sendMessage: any;
    uploadFile: any;
  }) => {
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
    );
  },
);

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
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
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
        maxWidth: "calc(100% - 430px)",
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
        {channel && !channel.isDeleted ? (
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
                <RenderMessage key={index} mess={mess} meId={meId} />
              ))
            ) : (
              <Box sx={{ textAlign: "center", color: "grey.500", mt: 3 }}>
                Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
              </Box>
            )}
          </Box>
        ) : null}
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
