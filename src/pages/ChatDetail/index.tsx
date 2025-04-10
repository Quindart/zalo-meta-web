import { Box } from "@mui/material";
import RightSideBar from "./RighSideBar";
import MainChat from "./MainChat";
import { useEffect } from "react";
import { useChat } from "@/hook/api/useChat";
import { useParams } from "react-router-dom";

function ChatDetailTemplate() {
  const params = useParams();
  const channelId = params.id;
  const { messages, loadMessages, loading } = useChat();
  const userId = localStorage.getItem("userId")?.replace(/"/g, "") || "";

  useEffect(() => {
    if (channelId) {
      loadMessages(channelId, userId);
    }
  }, [channelId, userId]);

  return (
    <Box width={"100%"}>
      <MainChat messages={messages} loading={loading} />
      <RightSideBar />
    </Box>
  );
}

export default ChatDetailTemplate;
