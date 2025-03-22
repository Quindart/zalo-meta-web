import {
  Box,
  Button,
  FormControl,
  FormGroup,
  Input,
  Typography,
} from "@mui/material";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import HttpsIcon from "@mui/icons-material/Https";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/constants";
import { setValueInLocalStorage } from "@/utils/localStorage";
function LoginTemplate() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate(APP_ROUTES.DASHBOARD);
    setValueInLocalStorage("accessToken", "12345678");
  };
  const handReserPassword =() => {
    navigate(APP_ROUTES.FORGOT_PASSWORD);
  }
  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="body2"
        textAlign={"center"}
        fontWeight={"600"}
        color="initial"
        pb={2}
        mt={2}
        borderBottom={"0.5px solid #d5d5d5"}
      >
        Đăng nhập với mật khẩu
      </Typography>
      <FormGroup sx={{ mt: 4, mb: 2, px: 10 }}>
        <FormControl style={{ marginBottom: 4 }}>
          <Input
            name="phone"
            id="phone"
            sx={{
              fontSize: 14,
            }}
            startAdornment={
              <PhoneAndroidIcon sx={{ width: 16, mr: 2, color: "grey.400" }} />
            }
            placeholder="Số điện thoại"
          />
          <Input
            sx={{
              fontSize: 14,
              mt: 2,
            }}
            name="password"
            type="password"
            id="password"
            startAdornment={
              <HttpsIcon sx={{ width: 16, mr: 2, color: "grey.400" }} />
            }
            placeholder="Mật khẩu"
          />
        </FormControl>

        <Button
          onClick={handleLogin}
          size="large"
          sx={{ mt: 4 }}
          variant="contained"
        >
          Đăng nhập với mật khẩu
        </Button>
        <Typography
          textAlign={"center"}
          fontSize={12}
          variant="body1"
          mt={2}
          color="initial"
          onClick={handReserPassword}
          style={{ cursor: "pointer"}}
        >
          Quên mật khẩu
        </Typography>
        <Typography
          mt={4}
          sx={{ cursor: "pointer" }}
          textAlign={"center"}
          fontSize={12}
          variant="body1"
          color="primary"
          onClick={() => navigate(APP_ROUTES.USER.LOGIN_QR)}
        >
          Đăng nhập qua mã QR
        </Typography>
      </FormGroup>
    </Box>
  );
}

export default LoginTemplate;
