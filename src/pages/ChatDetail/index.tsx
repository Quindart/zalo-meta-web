import { Box } from "@mui/material";
import RightSideBar from "./RighSideBar";
import MainChat from "./MainChat";
import { useChatContext } from "@/Context/ChatContextType";
import { useParams } from "react-router-dom";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function ChatDetailTemplate() {
  const {
    channel,
    messages,
    sendMessage,
    joinRoom,
    uploadFile,
    uploadImageGroup,
  } = useChatContext();
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  const params = useParams();
  const channelId = params.id;

  useEffect(() => {
    if (channelId) {
      joinRoom(channelId);
    }
  }, [channelId, joinRoom]);

  return (
    <Box width="100%" height="100vh">
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
    </Box>
  );
}

export default ChatDetailTemplate;