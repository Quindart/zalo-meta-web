import { Box, Button, TextField } from "@mui/material";
import RightSideBar from "./RighSideBar";
import MainChat from "./MainChat";
import { useState } from "react";
import { useChat } from "@/hook/api/useChat";

function ChatDetailTemplate() {
  const { messages, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");

  return (
    <div>
      <Box width={"100%"}>
        <MainChat messages={messages} />
        <RightSideBar />
      </Box>

      <Box mb={2}>
        <TextField
          type="text"
          placeholder="Nhập ID người nhận"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
        <TextField
          type="text"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button
          onClick={() =>
            sendMessage(
              "67baead7581e27c55e2b3d24",
              newMessage,
              "67b4b8fa40191e21f03c08f2",
            )
          }
        >
          Gửi
        </Button>
      </Box>
    </div>
  );
}

export default ChatDetailTemplate;
