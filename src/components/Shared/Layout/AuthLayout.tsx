import { Box, Button, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <Box
      sx={{
        bgcolor: "#E8F3FF",
        height: "100vh",
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: " 4px 4px 10px #333",
        py: 3,
      }}
    >
      <Typography variant="h3" fontWeight={600} color="primary">
        Zalo
      </Typography>
      <Typography
        variant="body2"
        textAlign={"center"}
        fontWeight={400}
        color="grey.700"
      >
        Đăng nhập tài khoản Zalo <br /> để kết nối với ứng dụng Zalo Web
      </Typography>
      <Box
        sx={{
          borderRadius: 4,
          boxShadow: "2px #333",
          bgcolor: "white",
          p: 1.2,
          mt: 2,
          width: 480,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Outlet />
        <Box
          sx={{
            mt: "auto",
            display: "flex",
            width: "100%",
            borderRadius: 2,
            border: "1px solid #D1D1D1FF",
            py: "2px",
            px: 2,
            boxSizing: "border-box",
            alignItems: "center",
          }}
        >
          <Box>
            <img src="/assets/images/banner_icon.svg" />
          </Box>
          <Box sx={{ flex: 1, mx: 1 }}>
            <Typography
              fontSize={12}
              variant="body2"
              fontStyle={"bold"}
              color="initial"
              fontWeight={"600"}
            >
              {" "}
              Nâng cao hiệu quả công việc với Zalo PC{" "}
            </Typography>
            <Typography fontSize={12} variant="body2" color="grey.600">
              Gửi file lớn lên đến 1 GB, chụp màn hình, gọi video và nhiều tiện
              ích hơn nữa
            </Typography>
          </Box>
          <Button sx={{ height: 40 }} variant="contained">
            {" "}
            Tải ngay
          </Button>
        </Box>
      </Box>
      {/* <Box sx={{ mt: 2, fontSize: 12, cursor: "pointer" }}>
        <Link sx={{ mx: 1 }}> Tiếng Việt</Link>
        <Link>English</Link>
      </Box> */}
    </Box>
  );
}

export default AuthLayout;
