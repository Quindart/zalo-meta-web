import React from "react";
import {Typography, Button, Box, FormControl, FormGroup } from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css"
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/constants";

function ForgotPasswordTemplate() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const handleLogin = () => {
    navigate(APP_ROUTES.USER.LOGIN)
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 5,
      }}
    >
      <Typography variant="body1" sx={{ mb: 1 }}>
        Nhập số điện thoại của bạn
      </Typography>
      <FormGroup sx={{ mt: 3, mb: 2 }}>
        <FormControl style={{ marginBottom: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #ccc",
            }}
          >
            <PhoneIphoneIcon sx={{ color: grey[800], fontSize: 15 }} />
            <PhoneInput
              country={"vn"} // Mặc định là Việt Nam (+84)
              value={phoneNumber}
              onChange={(phone) => setPhoneNumber(phone)}
              inputStyle={{
                width: "100%",
                height: "30px",
                fontSize: "14px",
                borderRadius: "8px",
                border: "none",
                boxShadow: "none",
              }}
              dropdownStyle={{
                borderRadius: "10px",
                fontSize: "14px",
              }}
            />
          </Box>
        </FormControl>
        <Button
          // onClick={}
          size="large"
          sx={{ mt: 3, mb: 2, backgroundColor: "#0190F3", fontSize: 14 }}
          variant="contained"
        >
          Tiếp tục
        </Button>
        <Typography
          onClick={handleLogin}
          sx={{
            color: grey[800],
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          «Quay lại
        </Typography>
      </FormGroup>
    </Box>
  );
};

export default ForgotPasswordTemplate;
