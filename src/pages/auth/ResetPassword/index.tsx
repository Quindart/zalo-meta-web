import React, { useState } from "react";
import {
  Typography,
  Button,
  Box,
  FormControl,
  FormGroup,
  Input,
  InputAdornment
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate, useLocation } from "react-router-dom";
import { APP_ROUTES } from "@/constants";
import { MuiOtpInput } from 'mui-one-time-password-input';
import { verifyOTP, resetPassword } from "@/services/Auth"
import { useSnackbar } from 'notistack';
function ResetPasswordTemplate() {
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const email = location.state?.email || "";
  const navigate = useNavigate();
  console.log("email from reset password: ", email);
  console.log("OTP from reset password: ", otp);
  const handleOtpChange = (newValue: string) => {
    setOtp(newValue);
    setErrorMessage('');
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPass(e.target.value);
  };
  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassConfirm(e.target.value);
  };

  // Form submission handlers
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setErrorMessage('OTP phải có 6 ký tự');
      return;
    }
    const result = await verifyOTP(otp, email);
    console.log("check response OTP: ", result);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }
    setResetToken(result.reset_token);
    setIsOtpVerified(true);
    setErrorMessage('');
  };

  const handleResetPassword = async () => {
    // Form validation
    if (!isOtpVerified) {
      setErrorMessage('Vui lòng xác thực OTP trước');
      return;
    }

    if (!newPass) {
      setErrorMessage('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (newPass !== newPassConfirm) {
      setErrorMessage('Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPass.length < 8) {
      setErrorMessage('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    setIsSubmitting(true);
    const responseReset = await resetPassword(email, newPass, resetToken);
    if (responseReset.success) {
      enqueueSnackbar({ variant: 'success', message: "Reset password success !" })
      navigate(APP_ROUTES.USER.LOGIN)
    }
    else {
      enqueueSnackbar({ variant: 'error', message: "Reset password failed !" })
      return;
    }
  };
  console.log("check otp: ", otp);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: 'center',
        padding: 3,
        maxWidth: 400,
        margin: '0 auto',
      }}
    >
      {/* OTP Section */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
        {isOtpVerified ? 'Đặt mật khẩu mới' : 'Nhập mã OTP'}
      </Typography>

      {!isOtpVerified && (
        <>
          <MuiOtpInput
            value={otp}
            onChange={handleOtpChange}
            length={6}
            sx={{
              width: '100%',
              '& .MuiOtpInput-TextField': {
                '& .MuiOutlinedInput-root': {
                  height: '50px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  '&:hover': {
                    border: '1px solid #666',
                  },
                  '&.Mui-focused': {
                    border: '1px solid #169bf4',
                  }
                }
              }
            }}
          />
          <Button
            onClick={() => handleVerifyOtp()}
            size="large"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: "#169bf4",
              fontSize: 14,
              '&:hover': {
                backgroundColor: "#0d8ae3",
              }
            }}
            variant="contained"
          >
            Xác thực OTP
          </Button>
        </>
      )}

      {/* Password Section - Only shown after OTP verification */}
      {isOtpVerified && (
        <FormGroup sx={{ width: '100%', mt: 2 }}>
          <FormControl sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: '4px',
                padding: '8px 12px',
                mb: 2
              }}
            >
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: '#666' }} />
              </InputAdornment>
              <Input
                fullWidth
                type="password"
                placeholder="Mật khẩu mới"
                value={newPass}
                onChange={handlePasswordChange}
                disableUnderline
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: '4px',
                padding: '8px 12px'
              }}
            >
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: '#666' }} />
              </InputAdornment>
              <Input
                fullWidth
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={newPassConfirm}
                onChange={handlePasswordConfirmChange}
                disableUnderline
              />
            </Box>
          </FormControl>

          <Button
            onClick={handleResetPassword}
            size="large"
            fullWidth
            disabled={isSubmitting}
            sx={{
              mt: 3,
              backgroundColor: "#169bf4",
              fontSize: 14,
              '&:hover': {
                backgroundColor: "#0d8ae3",
              }
            }}
            variant="contained"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          </Button>
        </FormGroup>
      )}

      {/* Error message */}
      {errorMessage && (
        <Typography
          color="error"
          sx={{ mt: 2, textAlign: 'center' }}
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
}

export default ResetPasswordTemplate;