import FriendRequestCard from "@/components/FriendRequestCard";
import SentRequestCard from "@/components/SendRequestCard";
import { Box, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const friendRequests = [
  {
    id: 1,
    avatar: "https://picsum.photos/id/101/40/40", // Ảnh ngẫu nhiên ID 101
    name: "Thành Đạt Sapo",
    date: "04/03",
    source: "Từ số điện thoại",
    message:
      "Xin chào, mình là Thành Đạt Sapo. Mình tìm thấy bạn bằng số điện thoại. Kết bạn với mình",
  },
  {
    id: 2,
    avatar: "https://picsum.photos/id/102/40/40", // Ảnh ngẫu nhiên ID 102
    name: "Ngọc Ánh",
    date: "05/03",
    source: "Nhóm chung",
    message: "Chào bạn, mình thấy bạn trong nhóm Cộng đồng React. Kết bạn nhé!",
  },
  {
    id: 3,
    avatar: "https://picsum.photos/id/103/40/40", // Ảnh ngẫu nhiên ID 103
    name: "Minh Tuấn",
    date: "06/03",
    source: "Bạn chung",
    message: "Chào bạn, mình là bạn của Thế Trung. Rất vui được kết bạn!",
  },
  {
    id: 4,
    avatar: "https://picsum.photos/id/104/40/40", // Ảnh ngẫu nhiên ID 104
    name: "Hà Linh",
    date: "07/03",
    source: "Từ số điện thoại",
    message: "Hi, mình là Hà Linh. Kết bạn để trò chuyện nhé!",
  },
  {
    id: 5,
    avatar: "https://picsum.photos/id/105/40/40", // Ảnh ngẫu nhiên ID 105
    name: "Quốc Anh",
    date: "08/03",
    source: "Nhóm chung",
    message: "Chào bạn, mình thấy bạn trong nhóm Học lập trình. Kết bạn nào!",
  },
];

const sentRequests = [
  {
    id: 1,
    avatar: "https://picsum.photos/id/106/40/40", // Ảnh ngẫu nhiên ID 106
    name: "Thế Trung",
    date: "4 ngày",
  },
  {
    id: 2,
    avatar: "https://picsum.photos/id/107/40/40", // Ảnh ngẫu nhiên ID 107
    name: "Lan Anh",
    date: "3 ngày",
  },
  {
    id: 3,
    avatar: "https://picsum.photos/id/108/40/40", // Ảnh ngẫu nhiên ID 108
    name: "Hoàng Nam",
    date: "2 ngày",
  },
];
export default function RequestAddFriend() {
  return (
    <Box>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          lèft: 300,
          right: 0,
          fontSize: 18,
          padding: "20px",
          color: "#081b3a",
          fontWeight: "bold",
          backgroundColor: "white",
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <PersonAddIcon />
        Lời mời kết bạn
      </Box>
      <Box
        px={2}
        sx={{ overflowY: "auto", height: "calc(100vh - 80px)", pb: 10 }}
      >
        <Typography mt={4} mb={3} fontWeight={600}>
          Lời mời kết bạn ({friendRequests.length})
        </Typography>
        <Box
          display="flex"
          flexWrap={"wrap"}
          justifyContent={"start"}
          gap={"10px"}
        >
          {friendRequests.map((request) => (
            <Box width={"calc(100% / 3 - 7px)"}>
              <FriendRequestCard
                key={request.id}
                avatar={request.avatar}
                name={request.name}
                date={request.date}
                source={request.source}
                message={request.message}
                onAccept={() => alert(`Đồng ý kết bạn với ${request.name}`)}
                onDecline={() => alert(`Từ chối kết bạn với ${request.name}`)}
              />
            </Box>
          ))}
        </Box>

        <Typography mt={4} mb={3} fontWeight={600}>
          Lời mời đã gửi ({sentRequests.length})
        </Typography>
        <Box
          display="flex"
          flexWrap={"wrap"}
          justifyContent={"start"}
          gap={"10px"}
        >
          {sentRequests.map((request) => (
            <Box width={"calc(100% / 3 - 7px)"}>
              <SentRequestCard
                key={request.id}
                avatar={request.avatar}
                name={request.name}
                date={request.date}
                onCancel={() =>
                  alert(`Thu hồi lời mời gửi đến ${request.name}`)
                }
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
