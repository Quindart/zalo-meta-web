import { Box, Button, IconButton, Popover, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/constants";
import axiosConfig from "@/services/axiosConfig";

function LoginQRTemplate() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [image, setImage] = useState<string>('');
  const [expired, setExpired] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [timeLeft, setTimeLeft] = useState<number>(180);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response:any = await axiosConfig.post('/api/v1/auth/QR');
      setImage(response.url);
      setExpired(false);
      setTimeLeft(180);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (countdownRef.current) clearInterval(countdownRef.current);

      timerRef.current = setTimeout(() => {
        setExpired(true);
      }, 180000);

      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Lỗi khi gửi request:', error);
      return '';
    }
  };
  useEffect(() => {
    fetchData()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [])
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };
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
          mb: 2,
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
      {!expired && image ? (
        <>
          <img
            width={240}
            style={{ margin: "auto", marginBottom: 10 }}
            height={"auto"}
            src={image}
            alt="QR Code"
          />
          <Typography variant="caption" color="text.secondary">
            Mã QR hết hạn sau: {formatTime(timeLeft)}
          </Typography>
        </>
      ) : (
        <Box
          sx={{
            position: "relative",
            width: 240,
            height: 240,
            mb: 1,
          }}
        >
          <img
            width={240}
            height={240}
            style={{
              objectFit: "cover",
              borderRadius: 4,
              opacity: 0.3, // làm mờ QR
            }}
            src="/assets/images/QR_demo.PNG"
            alt="QR Code"
          />

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Button variant="contained" onClick={fetchData}>
              Tải lại mã QR
            </Button>
          </Box>
        </Box>
      )}

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
