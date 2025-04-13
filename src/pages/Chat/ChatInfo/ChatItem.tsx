import { Box, Button, Typography, Badge } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { useNavigate, useParams } from "react-router-dom";
import { memo } from "react";

interface ChatItemProps {
  item: {
    id: number | string | undefined;
    avatar: string;
    name: string;
    message: string;
    time: Date;
    isRead: boolean;
    isChoose: boolean;
  };
}
const ChatItem: React.FC<ChatItemProps> = memo(({ item }) => {
  const navigate = useNavigate();
  console.log("ChatItem", item);
  const getTimeDisplay = (time: Date) => {
    const now = new Date();
    time = new Date(time);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Vài giây trước";
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} phút`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} giờ`;
    } else {
      return `${time.getDate()}/${time.getMonth() + 1}`; // Hiển thị ngày/tháng
    }
  };
  const params = useParams();
  return (
    <Button
      onClick={() => navigate(`/chats/${item.id}`)}
      sx={{
        justifyContent: "flex-start",
        textTransform: "none",
        width: "100%",
        px: 2,
        py: 1,
        backgroundColor: item.id == params.id ? blue[50] : "#fff",
        color: "black",
        "&:hover": { backgroundColor: grey[100] },
      }}
    >
      <Box display="flex" alignItems="center" gap={2} width="100%">
        {/* Avatar */}
        <Badge>
          <img
            src={item.avatar}
            alt={item.name}
            width={"50px"}
            height={"50px"}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        </Badge>

        {/* Nội dung chat */}
        <Box flexGrow={1}>
          <Typography
            fontWeight="600"
            fontSize={'1rem'}
            color="#081b3a"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
            textAlign={"left"}
          >
            {item.name}
          </Typography>
          <Typography
            fontSize={13}
            color="gray"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "140px",
            }}
            textAlign={"left"}
          >
            {item.message}
          </Typography>
        </Box>

        {/* Thời gian và số tin chưa đọc */}
        <Box textAlign="right">
          <Typography fontSize={14} color="gray">
            {getTimeDisplay(item.time)}
          </Typography>
        </Box>
        {/* 🛑 Thêm dấu chấm đỏ khi có tin nhắn chưa đọc */}
        <Badge
          color="error"
          overlap="circular"
          variant="dot"
          invisible={item.isRead} // Nếu đã đọc (true) thì ẩn dấu đỏ
        ></Badge>
      </Box>
    </Button>
  );
});

export default ChatItem;
