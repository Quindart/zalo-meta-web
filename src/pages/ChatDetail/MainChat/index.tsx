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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [MESS_LIST.length]); // Cập nhật khi danh sách tin nhắn thay đổi

  return (
    <Box
      sx={{
        maxWidth: "calc(100% - 358px)",
        height: "600px",
        bgcolor: "grey.300",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          height: 65,
          flexShrink: 0,
          bgcolor: "white",
          position: "sticky", // Giữ header cố định
          top: 0, // Luôn nằm trên cùng
          zIndex: 10, // Đảm bảo header không bị che mất
          borderBottom: "1px solid #ddd",
          borderRight: "1px solid #ddd"
        }}
      >
        <InfoUser/>
      </Box>

      <Box
        ref={chatContainerRef}
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          paddingBottom: 2,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Box sx={{ mx: 1, my: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {MESS_LIST.map((mess, index) => (
            <MessageChat key={index} {...mess} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default MainChat;
