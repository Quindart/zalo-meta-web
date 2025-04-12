import {
  Box,
  Button,
  FormControl,
  FormGroup,
  Input,
  Typography,
  CircularProgress,
} from "@mui/material";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import HttpsIcon from "@mui/icons-material/Https";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/constants";
import { useState, ChangeEvent, KeyboardEvent } from "react";
import useAuth from "@/hook/api/useAuth";

interface FormState {
  phone: string;
  password: string;
  isLoading: boolean;
}

function LoginTemplate() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>({
    phone: "",
    password: "",
    isLoading: false,
  });


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handReserPassword = () => {
    navigate(APP_ROUTES.FORGOT_PASSWORD);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin(formState.phone, formState.password);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        textAlign="center"
        fontWeight={600}
        color="grey.800"
        pb={2}
        mt={1}
        borderBottom="0.5px solid #d5d5d5"
      >
        Đăng nhập với mật khẩu
      </Typography>
      <FormGroup sx={{ mt: 4, mb: 2, px: 10 }}>
        <FormControl sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #ccc",
            }}
          >
          </Box>
          <Input
            name="phone"
            id="phone"
            value={formState.phone}
            disableUnderline
            onChange={handleInputChange}
            sx={{
              fontSize: 16,
              "& .MuiInputBase-input": {
                backgroundColor: "transparent",
              },
              pb: 1,
              borderBottom: "1px solid rgb(220, 222, 225)",
              mt: 4,
            }}
            startAdornment={
              <PhoneAndroidIcon sx={{ width: 16, mr: 2, color: "grey.400" }} />
            }
            placeholder="Số điện thoại"
            disabled={formState.isLoading}
          />
          <Input
            sx={{
              fontSize: 16,
              "& .MuiInputBase-input": {
                backgroundColor: "transparent",
              },
              pb: 1,
              borderBottom: "1px solid rgb(220, 222, 225)",
              mt: 4,
            }}
            name="password"
            disableUnderline
            type="password"
            value={formState.password}
            onChange={handleInputChange}
            id="password"
            startAdornment={
              <HttpsIcon sx={{ width: 16, mr: 2, color: "grey.400" }} />
            }
            placeholder="Mật khẩu"
            disabled={formState.isLoading}
            onKeyPress={handleKeyPress}
          />
        </FormControl>
        <Button
          onClick={() => {
            handleLogin(formState.phone, formState.password);
          }}
          size="large"
          sx={{ mt: 2, fontSize: 14, background: "#0190F3" }}
          variant="contained"
          disabled={formState.isLoading}
        >
          {formState.isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Đăng nhập với mật khẩu"
          )}
        </Button>
        <Typography
          textAlign={"center"}
          fontSize={14}
          variant="body1"
          mt={2}
          color="grey.800"
          onClick={handReserPassword}
          style={{ cursor: "pointer" }}
        >
          Quên mật khẩu
        </Typography>
        <Typography
          mt={4}
          sx={{ cursor: "pointer", color: "#0190F3", fontWeight: 600 }}
          textAlign={"center"}
          fontSize={14}
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
