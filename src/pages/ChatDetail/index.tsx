import { Box } from "@mui/material";
import RightSideBar from "./RighSideBar";
import MainChat from "./MainChat";

function ChatDetailTemplate() {
  return (
    <Box width={"100%"}>
      <MainChat />
      <RightSideBar />
    </Box>
  );
}

export default ChatDetailTemplate;
