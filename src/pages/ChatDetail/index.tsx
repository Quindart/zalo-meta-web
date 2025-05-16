import { Box } from "@mui/material";
import RightSideBar from "./RighSideBar";
import MainChat from "./MainChat";
import { useChatContext } from "@/Context/ChatContextType";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SkeletonLoadingChat from "@/components/SkeletonLoadingChat";
import useAuth from "@/hook/api/useAuth";

function ChatDetailTemplate() {
  const {
    channel,
    messages,
    sendMessage,
    joinRoom,
    uploadFile,
    uploadImageGroup,
  } = useChatContext();

  const { me } = useAuth();
  const params = useParams();
  const channelId = params.id;

  useEffect(() => {
    if (channelId) {
      joinRoom(channelId);
    }
  }, [channelId, joinRoom]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box width="100%" height="100vh">
      {isLoading ? (
        <>
          <SkeletonLoadingChat />
        </>
      ) : (
        <>
          <MainChat
            channel={channel}
            messages={messages}
            sendMessage={sendMessage}
            me={me}
            channelId={channelId}
            uploadFile={uploadFile}
            uploadImageGroup={uploadImageGroup}
          />
          <RightSideBar />
        </>
      )}
    </Box>
  );
}

export default ChatDetailTemplate;
