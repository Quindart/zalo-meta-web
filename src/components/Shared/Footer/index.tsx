import { Box, Link, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        padding: "10px 0",
        borderTop: "1px solid #ddd",
      }}
    >
      <Typography variant="body2">
        © 2012 - 2025 Một sản phẩm của Zalo Group -{" "}
        <Link
          href="#"
          underline="none"
          sx={{
            color: "primary.main",
            "&:hover": {
              color: "#084ea6",
            },
          }}
        >
          Điều khoản sử dụng dịch vụ
        </Link>{" "}
        -{" "}
        <Link
          href="#"
          underline="none"
          sx={{
            color: "primary.main",
            "&:hover": {
              color: "#084ea6",
            },
          }}
        >
          Thông báo xử lý dữ liệu
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
