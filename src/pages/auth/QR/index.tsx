import { Box, Button, IconButton, Popover, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/constants";
function LoginQRTemplate() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 400,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          borderBottom: "0.5px solid #cdcbcb",
          p: 1,
          mb: 4,
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="body2"
          fontWeight={"600"}
          textAlign={"center"}
          color="initial"
          flex={1}
        >
          Đăng nhập qua mã QR
        </Typography>
        <IconButton
          sx={{
            border: "0.5px solid #adabab",
            borderRadius: 1,
            px: "6px",
            py: 0,
          }}
          size="small"
          onClick={handleClick}
        >
          <MenuIcon width={2} />
        </IconButton>
      </Box>
      <img
        width={240}
        style={{ margin: "auto" }}
        height={"auto"}
        src="/assets/images/QR_demo.PNG"
      />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Button onClick={() => navigate(APP_ROUTES.USER.LOGIN)} color="inherit">
          <Typography sx={{ px: 2, py: 0.5, cursor: "pointer" }} fontSize={12}>
            Đăng nhập với mật khẩu
          </Typography>
        </Button>
      </Popover>
    </Box>
  );
}

export default LoginQRTemplate;
