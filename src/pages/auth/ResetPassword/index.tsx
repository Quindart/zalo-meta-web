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
   <div>
    <h1>hello</h1>
   </div>
  );
}

export default ResetPasswordTemplate;