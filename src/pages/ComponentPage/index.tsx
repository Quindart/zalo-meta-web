// import FileCard from "@/components/FileCard";
import FriendRequestCard from "@/components/FriendRequestCard";
import SentRequestCard from "@/components/SendRequestCard";
import { Box, Typography } from "@mui/material";
function ComponentPage() {
  return (
    <Box px={2} height={"100vh"} bgcolor={"#E5E7EB"}>
      <Typography variant="body1" color="initial">
        File
      </Typography>
      {/* <Box display={"flex"} flexDirection={"column"} gap={2}>
        <FileCard
          name="Lê Minh Quang - Báo cáo thực tập doan...nal"
          size="10.45 MB"
          extension="docx"
        />
        <FileCard name="Báo cáo tài chính" size="1.2 MB" extension="pdf" />
        <FileCard name="Thống kê bảng lương" size="562 KB" extension="xlsx" />
      </Box> */}

      <Typography variant="body1" mt={2} color="initial">
        {" "}
        Lời mời kết bạn
      </Typography>
      <Box sx={{ maxWidth: 420, mt: 3 }}>
        <FriendRequestCard
          avatar="/avatar1.jpg"
          name="Thành Đạt Sapo"
          date="04/03"
          source="Từ số điện thoại"
          message="Xin chào, mình là Thành Đạt Sapo. Mình tìm thấy bạn bằng số điện thoại. Kết bạn với mình"
          onAccept={() => alert("Đồng ý")}
          onDecline={() => alert("Từ chối")}
        />

        <Typography mt={3} mb={1} fontWeight={600}>
          Lời mời đã gửi (8)
        </Typography>

        <SentRequestCard
          avatar="/avatar2.jpg"
          name="Thế Trung"
          date="4 ngày"
          onCancel={() => alert("Thu hồi lời mời")}
        />
      </Box>
    </Box>
  );
}

export default ComponentPage;
