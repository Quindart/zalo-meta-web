import { Box, Link, AppBar, Toolbar } from "@mui/material";
const HeaderLanding = () => {
  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: "1px solid #ddd" }}
    >
      <Toolbar sx={{ justifyContent: "space-between", padding: "0 20px" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={"/assets/images/Logo.svg"}
            alt="Logo"
            style={{ height: "30px" }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 3 }}>
          <Link href="#" underline="none" sx={linkStyle}>
            ZALO PC
          </Link>
          <Link href="#" underline="none" sx={linkStyle}>
            OFFICIAL ACCOUNT
          </Link>
          <Link href="#" underline="none" sx={linkStyle}>
            NHÀ PHÁT TRIỂN
          </Link>
          <Link href="#" underline="none" sx={linkStyle}>
            BẢO MẬT
          </Link>
          <Link href="#" underline="none" sx={linkStyle}>
            TRỢ GIÚP
          </Link>
          <Link href="#" underline="none" sx={linkStyle}>
            LIÊN HỆ
          </Link>
          <Link href="#" underline="none" sx={linkStyle}>
            BÁO CÁO VI PHẠM
          </Link>
          <Link
            href="#"
            underline="none"
            sx={{ ...linkStyle, color: "#0078FF", fontWeight: "bold" }}
          >
            ĐĂNG NHẬP
          </Link>
        </Box>
        <Box></Box>
      </Toolbar>
    </AppBar>
  );
};

const linkStyle = {
  fontSize: "13px",
  color: "#000",
  fontWeight: "600",
  "&:hover": {
    color: "#0078FF",
  },
};

export default HeaderLanding;
