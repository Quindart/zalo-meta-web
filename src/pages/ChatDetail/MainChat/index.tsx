import MessageChat from "@/components/Message";
import { Box } from "@mui/material";

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
  return (
    <Box
      sx={{
        maxWidth: "calc(100% - 358px)",
        overflowY: "auto",
        height: "600px",
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
        {MESS_LIST.map((mess) => (
          <MessageChat {...mess} />
        ))}
      </Box>
    </Box>
  );
}

export default MainChat;
