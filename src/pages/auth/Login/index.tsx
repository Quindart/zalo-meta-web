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
import { useFormik } from "formik";
import useAuth from "@/hook/api/useAuth";
import { loginValidationSchema } from "../context";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function LoginTemplate() {
  const { handleLogin, handleLoginGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      await handleLogin(values.phone, values.password);
    },
  });
  const handResetPassword = () => {
    navigate(APP_ROUTES.FORGOT_PASSWORD);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        textAlign="center"
        fontWeight={600}
        color="grey.800"
        fontSize={20}
        pb={2}
        mt={1}
        borderBottom="0.5px solid #d5d5d5"
      >
        Đăng nhập với mật khẩu
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <FormGroup sx={{ mb: 2, px: 6, mt: 2 }}>
          <FormControl sx={{ mb: 2 }}>
            <Input
              name="phone"
              id="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disableUnderline
              placeholder="Số điện thoại"
              startAdornment={
                <PhoneAndroidIcon
                  sx={{ width: 20, mr: 1, color: "grey.600" }}
                />
              }
              sx={{
                fontSize: 16,
                "& .MuiInputBase-input": {
                  backgroundColor: "transparent",
                  color: "grey.700",
                },
                pb: 1,
                borderBottom: "3px solid rgb(220, 222, 225)",
                mt: 2,
              }}
              disabled={formik.isSubmitting}
            />
            {formik.touched.phone && formik.errors.phone && (
              <Typography fontSize={12} color="error" mt={0.5}>
                {formik.errors.phone}
              </Typography>
            )}

            <Input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disableUnderline
              placeholder="Mật khẩu"
              startAdornment={
                <HttpsIcon sx={{ width: 20, mr: 1, color: "grey.600" }} />
              }
              endAdornment={
                <Box
                  onClick={() => setShowPassword((prev) => !prev)}
                  sx={{ cursor: "pointer", ml: 1 }}
                >
                  {showPassword ? (
                    <VisibilityOff sx={{ width: 20, color: "grey.600" }} />
                  ) : (
                    <Visibility sx={{ width: 20, color: "grey.600" }} />
                  )}
                </Box>
              }
              sx={{
                fontSize: 16,
                "& .MuiInputBase-input": {
                  backgroundColor: "transparent",
                },
                pb: 1,
                borderBottom: "1px solid rgb(220, 222, 225)",
                mt: 4,
              }}
              disabled={formik.isSubmitting}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  formik.handleSubmit();
                }
              }}
            />

            {formik.touched.password && formik.errors.password && (
              <Typography fontSize={12} color="error" mt={0.5}>
                {formik.errors.password}
              </Typography>
            )}
          </FormControl>
          <Typography
            textAlign="right"
            fontSize={14}
            mb={2}
            variant="body1"
            color="primary"
            onClick={handResetPassword}
            style={{ cursor: "pointer" }}
          >
            Quên mật khẩu?
          </Typography>
          <Button
            type="submit"
            size="large"
            sx={{ mt: 2, fontSize: 14, background: "#0190F3" }}
            variant="contained"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Đăng nhập với mật khẩu"
            )}
          </Button>
          <Typography
            sx={{ my: 1 }}
            variant="body1"
            textAlign={"center"}
            color="grey.600"
          >
            Hoặc
          </Typography>

          <Button
            onClick={handleLoginGoogle}
            size="large"
            sx={{ fontSize: 14, color: "grey.800", background: "white" }}
            variant="contained"
            disabled={formik.isSubmitting}
          >
            <img
              width={20}
              src="/assets/images/google-icon-logo-svgrepo-com.svg"
              alt=""
              style={{ marginRight: 4 }}
            />{" "}
            Đăng nhập với Google
          </Button>

          <Typography
            mt={2}
            sx={{
              cursor: "pointer",
              fontWeight: 500,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            textAlign="center"
            fontSize={14}
            variant="body1"
            onClick={() => navigate(APP_ROUTES.USER.LOGIN_QR)}
          >
            <img
              style={{
                marginRight: 5,
              }}
              src="/assets/images/qr-code-scan-svgrepo-com.svg"
              width={20}
              alt=""
            />
            Đăng nhập qua mã QR
          </Typography>
        </FormGroup>
      </form>
    </Box>
  );
}

export default LoginTemplate;
