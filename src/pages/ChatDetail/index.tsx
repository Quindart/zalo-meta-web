import { Box, Button, TextField } from "@mui/material";
import RightSideBar from "./RighSideBar";
import MainChat from "./MainChat";
import { useState, useEffect } from "react";
import { useChat } from "@/hook/api/useChat";
import useAuth from "@/hook/api/useAuth";
import { useParams } from "react-router-dom";

function ChatDetailTemplate() {
  const params = useParams();
  const receiverId = params.id;
  const { messages, sendMessage, loadMessages, loading } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const userId = localStorage.getItem("userId")?.replace(/"/g, "") || "";
  const { me } = useAuth();

  // Load messages when receiverId changes
  useEffect(() => {
    if (receiverId) {
      loadMessages(receiverId, userId);
    }
  }, [receiverId, userId]);

  return (
    <div>
      <Box width={"100%"}>
        <MainChat messages={messages} loading={loading} />
        <RightSideBar />
      </Box>

      <Box mb={2}>
        <TextField type="text" disabled value={receiverId} />
        <TextField type="text" placeholder="Nhập tin nhắn..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
        <Button
          onClick={() => {
            console.log("Gửi tin nhắn:", me);
            if (receiverId && newMessage) {
              sendMessage(receiverId, newMessage, userId);
              setNewMessage(""); // Xóa tin nhắn sau khi gửi
            } else {
              alert("Vui lòng nhập ID người nhận và nội dung tin nhắn");
            }
          }}
        >
          Gửi
        </Button>
      </Box>
    </div>
  );
}

export default ChatDetailTemplate;
