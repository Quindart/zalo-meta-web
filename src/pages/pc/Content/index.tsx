import { APP_ROUTES } from "@/constants";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ContentPCLandingTemplate() {
  const navigate = useNavigate();
  return (
    <Box sx={{ my: 10 }}>
      {" "}
      <Typography variant="body1" color="initial">
        Tải Zalo PC cho máy tính Ứng dụng Zalo PC đã có mặt trên Windows, Mac
        OS, Web
      </Typography>
      <Button color="primary">Tải ngay</Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate(APP_ROUTES.USER.LOGIN_QR)}
      >
        Dùng bản web
      </Button>
    </Box>
  );
}

export default ContentPCLandingTemplate;
