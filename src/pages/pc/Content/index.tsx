import { Box, Button, Typography, Stack } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import LanguageIcon from "@mui/icons-material/Language";

function ContentPCLandingTemplate() {
  return (
    <Box
      justifyContent="center"
      alignItems="center"
      py={10}
      px={7}
      sx={{
        maxWidth: "1100px",
        margin: "auto",
        mt: 5,
        bgcolor: "white",
        borderRadius: 2,
      }}
    >
      {/* Bên trái - Nội dung */}
      <Box>
        <Typography fontWeight="600" fontSize={38}>
          Tải Zalo PC cho máy tính
        </Typography>
        <Typography fontWeight="500" mt={1} fontSize={26}>
          Ứng dụng Zalo PC đã có mặt trên Windows, Mac OS, Web
        </Typography>

        <Box display="flex" paddingTop={4}>
          <Box width="50%">
            {/* Danh sách lợi ích */}
            <Stack spacing={2} mt={2}>
              <Typography>
                <img
                  src="/assets/images/check_welcom.png"
                  width={15}
                  height={15}
                  style={{ marginRight: 12 }}
                />
                Gửi file, ảnh, video cực nhanh lên đến 1GB
              </Typography>
              <Typography>
                <img
                  src="/assets/images/check_welcom.png"
                  width={15}
                  height={15}
                  style={{ marginRight: 12 }}
                />
                Đồng bộ tin nhắn với điện thoại
              </Typography>
              <Typography>
                <img
                  src="/assets/images/check_welcom.png"
                  width={15}
                  height={15}
                  style={{ marginRight: 12 }}
                />
                Tối ưu cho chat nhóm và trao đổi công việc
              </Typography>
            </Stack>

            {/* Nút hành động */}
            <Stack direction="row" spacing={2} mt={3}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  fontWeight: "600",
                  fontSize: 20,
                  paddingX: 3,
                  border: "none",
                }}
              >
                <img
                  src="/assets/images/download_welcom.png"
                  width={22}
                  height={22}
                  style={{ marginRight: 12 }}
                />
                Tải ngay
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<LanguageIcon />}
                sx={{ fontWeight: "600", fontSize: 20, paddingX: 3 }}
              >
                Dùng bản web
              </Button>
            </Stack>
          </Box>
          {/* Bên phải - Hình minh họa */}
          <Box width="50%" display="flex" justifyContent="center">
            <img
              src="/assets/images/zalo-welcom.png"
              alt="Zalo PC"
              width="80%"
              style={{ borderRadius: "10px" }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ContentPCLandingTemplate;
