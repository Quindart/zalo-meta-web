import MessageChat from "@/components/Message";
import SocketClientService from "@/services/socket";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import ChatInput from "../ChatInput";
import { io } from "socket.io-client";

const MESS_LIST = [
  {
    content: "Xin chào mọi người!",
    author: "Quang",
    dateCreated: "10:00",
    userId: "user_1",
    emojis: ["😂", "👍"],
    isMe: true,
  },
  {
    content: "Chào Quang! Hôm nay bạn thế nào?",
    author: "Linh",
    dateCreated: "10:05",
    userId: "user_2",
    emojis: ["😍"],
    isMe: false,
  },
  {
    content: "Mình ổn, cảm ơn nhé!",
    author: "Quang",
    dateCreated: "10:10",
    userId: "user_1",
    emojis: ["🎉"],
    isMe: true,
  },
  {
    content: "Cuối tuần này có ai rảnh đi cafe không?",
    author: "Nam",
    dateCreated: "10:15",
    userId: "user_3",
    emojis: ["🔥", "👍"],
    isMe: false,
  },
  {
    content: "Nghe hay đó! Tầm mấy giờ nhỉ?",
    author: "Quang",
    dateCreated: "10:20",
    userId: "user_1",
    emojis: [],
    isMe: true,
  },
  {
    content: "Chiều 3h nha, chỗ cũ nhé!",
    author: "Nam",
    dateCreated: "10:25",
    userId: "user_3",
    emojis: ["🎉"],
    isMe: false,
  },
  {
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos ipsam ab unde ducimus nostrum ea voluptas incidunt quia quae! Exercitationem, obcaecati. Ipsam corporis ab aliquid nesciunt nulla, dolore debitis harum.",
    author: "Nam",
    dateCreated: "10:25",
    userId: "user_3",
    isMe: false,
  },
  {
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos ipsam ab unde ducimus nostrum ea voluptas incidunt quia quae! Exercitationem, obcaecati. Ipsam corporis ab aliquid nesciunt nulla, dolore debitis harum.",
    author: "Quang",
    dateCreated: "10:25",
    userId: "user_3",
    isMe: true,
  },
  {
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos ipsam ab unde ducimus nostrum ea voluptas incidunt quia quae! Exercitationem, obcaecati. Ipsam corporis ab aliquid nesciunt nulla, dolore debitis harum.",
    author: "Quang",
    dateCreated: "10:25",
    userId: "user_3",
    isMe: true,
  },
];



function MainChat() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
const socket = io("http://localhost:5000")

  const onChangeInput = (mess:string)=>{
      setMessage(mess)
  }
    socket.on('receive_message',(data: any) => {
      setMessages((prev) => [...prev, data]); 
    });
     

  const sendMessage = () => {
     socket.emit("send_message", {
            userId: '123',
            threadId: "456",
            message:message,
        });
  };

  return (
    <>
    <Box
      sx={{
        maxWidth: "calc(100% - 358px)",
        overflowY: "auto",
        height: "calc(100vh - 120px)",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        bgcolor: "grey.300",
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
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.userId}:</strong> {msg.message}
            </li>
          ))}
        </ul>
      </Box>
      
     

    </Box>
    <Box display={'flex'} gap={2}>

     <ChatInput onChangeInput={onChangeInput}/>
      <button onClick={()=>sendMessage()}>Send</button>
    </Box>

    </>
  );
}

export default MainChat;


