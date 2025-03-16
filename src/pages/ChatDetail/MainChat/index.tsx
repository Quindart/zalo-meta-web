import { Box } from "@mui/material";
import { useRef } from "react";
import InfoUser from "./InfoUser/InfoUser";
import MessageChat from "@/components/Message";
import { useChat } from "@/hook/api/useChat";

// const MESS_LIST = [
//   {
//     content: "Xin chào mọi người!",
//     author: "Quang",
//     dateCreated: "10:00",
//     userId: "user_1",
//     emojis: ["😂", "👍"],
//     isMe: true,
//   },
//   {
//     content: "Chào Quang! Hôm nay bạn thế nào?",
//     author: "Linh",
//     dateCreated: "10:05",
//     userId: "user_2",
//     emojis: ["😍"],
//     isMe: false,
//   },
//   {
//     content: "Mình ổn, cảm ơn nhé!",
//     author: "Quang",
//     dateCreated: "10:10",
//     userId: "user_1",
//     emojis: ["🎉"],
//     isMe: true,
//   },
//   {
//     content: "Cuối tuần này có ai rảnh đi cafe không?",
//     author: "Nam",
//     dateCreated: "10:15",
//     userId: "user_3",
//     emojis: ["🔥", "👍"],
//     isMe: false,
//   },
//   {
//     content: "Nghe hay đó! Tầm mấy giờ nhỉ?",
//     author: "Quang",
//     dateCreated: "10:20",
//     userId: "user_1",
//     emojis: [],
//     isMe: true,
//   },
//   {
//     content: "Chiều 3h nha, chỗ cũ nhé!",
//     author: "Nam",
//     dateCreated: "10:25",
//     userId: "user_3",
//     emojis: ["🎉"],
//     isMe: false,
//   },
// ];

const user = {
  _id: "67b4b8fa40191e21f03c08f2",
  email: "huyvu@gmail.com",
  avatar: "",
  phone: "0334405617",
  gender: "Nam",
  dateOfBirth: "2003-01-01T00:00:00.000Z",
  firstName: "Vu",
  lastName: "Huy",
  status: "ACTIVE",
  twoFactorAuthenticationSecret: null,
  isTwoFactorAuthenticationEnabled: false,
  updatedAt: "2025-02-18T16:44:42.665Z",
  createdAt: "2025-02-18T16:44:42.665Z",
  __v: 0,
};
function MainChat() {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const { readMessage, messages } = useChat();
  // console.log("💲💲💲 ~ MainChat ~ messages:", messages);
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
          borderRight: "1px solid #ddd",
        }}
      >
        <InfoUser />
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
    </Box>
  );
}

export default MainChat;
