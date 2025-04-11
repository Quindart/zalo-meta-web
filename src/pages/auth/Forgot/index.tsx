import React, { useState } from "react";
import { Typography, Button, Box, FormControl, FormGroup } from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css"
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/constants";
import { findUserByPhone } from "@/services/User"
import { sendOTP } from "@/services/Auth"
function ForgotPasswordTemplate() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const verifyPhone = async (phone: string) => {
    phone = phone.replace("84", "0");
    const response = await findUserByPhone(phone);
    console.log("Check data: ", response);
    if (response && response.status === 200 && response.user) {
      const email = response.user?.email;
      const otpResult = await sendOTP(email);
      console.log("check result:", otpResult);

      navigate(APP_ROUTES.RESET_PASSWORD, { state: { email } });
    }
    else {
      setErrMessage(response.message);
      setIsSubmitted(!isSubmitted)
    }
  }
  console.log("check phonenumber: ", phoneNumber);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: 'center',
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
          {
            isSubmitted ?
              <Typography sx={{ color: 'red', mt: 2 }}>
                {errMessage}
              </Typography> : <></>
          }
        </FormControl>
        <Button
          onClick={() => verifyPhone(phoneNumber)}
          size="large"
          sx={{ my: 2, backgroundColor: "#169bf4", fontSize: 14 }}
          variant="contained"
        >
          Tiếp tục
        </Button>
        <Typography
          onClick={() => navigate(APP_ROUTES.USER.LOGIN)}
          sx={{
            color: grey[800],
            fontSize: 14,
            cursor: "pointer"
          }}
        >
          « Quay lại
        </Typography>
      </FormGroup>
    </Box>
  );
};

export default ForgotPasswordTemplate;