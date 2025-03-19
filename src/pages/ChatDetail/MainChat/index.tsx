import { Box } from "@mui/material";
import { useRef } from "react";
import InfoUser from "./InfoUser/InfoUser";
import MessageChat from "@/components/Message";
import { Avatar, Box } from "@mui/material";
import { useEffect, useRef } from "react";
import InfoUser from "./InfoUser/InfoUser";
import { blue, grey } from "@mui/material/colors";

const MESS_LIST = [
  { content: "Xin chào mọi người!", author: "Quang", dateCreated: "10:00", userId: "user_1", emojis: ["😂", "👍"], isMe: true },
  { content: "Chào Quang! Hôm nay bạn thế nào?", author: "Linh", dateCreated: "10:05", userId: "user_2", emojis: ["😍"], isMe: false },
  { content: "Mình ổn, cảm ơn nhé!", author: "Quang", dateCreated: "10:10", userId: "user_1", emojis: ["🎉"], isMe: true },
  { content: "Cuối tuần này có ai rảnh đi cafe không?", author: "Nam", dateCreated: "10:15", userId: "user_3", emojis: ["🔥", "👍"], isMe: false },
  { content: "Nghe hay đó! Tầm mấy giờ nhỉ?", author: "Quang", dateCreated: "10:20", userId: "user_1", emojis: [], isMe: true },
  { content: "Chiều 3h nha, chỗ cũ nhé!", author: "Nam", dateCreated: "10:25", userId: "user_3", emojis: ["🎉"], isMe: false },
];
const Users=[
  {
    avatar: "/images/zalo-icon.png",
    bgAvatar: "/images/zalo-welcom.png",
    name:"Nguyễn Kim Ngọc Tuyền",
    birthday: new Date("2003-04-29"),

  }
]

function MainChat() {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { messages } = useChat();
  // console.log("💲💲💲 ~ MainChat ~ messages:", messages);
  return (
    <>
    <Box
      sx={{
        maxWidth: "calc(100% - 358px)",
        height: "600px",
        bgcolor: "grey.300",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Header - Thanh thông tin người dùng */}
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
          borderRight: "1px solid #ddd",
        }}
      >
        <InfoUser />
      </Box>

      {/* Vùng hiển thị tin nhắn */}
      <Box
        ref={chatContainerRef}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          paddingBottom: "80px", // Chừa chỗ cho ô nhập tin nhắn
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
          {Array.isArray(messages) &&
            messages.map((mess: any, index: number) => (
              <MessageChat key={index} {...mess} />
            ))}
        </Box>
      </Box>

      {/* Ô nhập tin nhắn - Cố định phía dưới */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "white",
          border: "1px solid #ccc",
          zIndex: 10, // Đảm bảo luôn hiển thị trên tin nhắn
        }}
      >
        <ChatInput />
      </Box>
    </Box>
    <Box display={'flex'} gap={2}>

    </Box>

    </>
  );
}

export default MainChat;


