import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

function AuthLayoutResetPassword() {
  return (
    <Box
      sx={{
        bgcolor: "#E8F3FF",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: " 4px 4px 10px #333",
        py: 8,
      }}
    >
      <Typography variant="h2" fontWeight={600} color="primary">
        Zalo
      </Typography>
      <Typography
        fontSize={18}
        textAlign={"center"}
        fontWeight={400}
        color="grey.800"
      >
        Khôi phục mật khẩu Zalo <br /> để kết nối với ứng dụng Zalo Web
      </Typography>
      <Box
        sx={{
          borderRadius: 4,
          boxShadow: "0px 0px 30px rgba(82, 138, 206, 0.3)",
          bgcolor: "white",
          p: 1.2,
          mt: 2,
          width: 400,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AuthLayoutResetPassword;
