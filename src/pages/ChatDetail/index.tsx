import { Box } from "@mui/material";
import RightSideBar from "./RighSideBar";
import MainChat from "./MainChat";
import { useChatContext } from "@/Context/ChatContextType";
import { useParams } from "react-router-dom";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function ChatDetailTemplate() {
  const { channel, messages, sendMessage, joinRoom, leaveRoom, uploadFile } = useChatContext();
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  const params = useParams();
  const channelId = params.id;

  useEffect(() => {
    if (channelId) {
      joinRoom(channelId);
    }
  }, [channelId]);
  return (
    <Box width={"100%"}>
      <MainChat
        channel={channel}
        messages={messages}
        sendMessage={sendMessage}
        me={me}
        channelId={channelId}
        uploadFile={uploadFile}
      />
      <RightSideBar channel={channel} leaveRoom={leaveRoom} me={me} />
    </Box>
  );
}

export default ChatDetailTemplate;
