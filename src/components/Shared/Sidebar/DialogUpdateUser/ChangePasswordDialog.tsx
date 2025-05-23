import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  IconButton,
  DialogActions,
  DialogContentText,
  Dialog as MuiDialog,
  Divider,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import axiosConfig from "@/services/axiosConfig";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Vui lòng nhập mật khẩu hiện tại"),
  newPassword: Yup.string()
    .required("Vui lòng nhập mật khẩu mới")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword") as any], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu mới"),
});

type FieldName = "currentPassword" | "newPassword" | "confirmPassword";

const fieldLabels: Record<FieldName, string> = {
  currentPassword: "Mật khẩu hiện tại",
  newPassword: "Mật khẩu mới",
  confirmPassword: "Xác nhận mật khẩu mới",
};

export default function ChangePasswordDialog({ open, onClose }: ChangePasswordDialogProps) {
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setFieldError }) => {
      try {
        if (values.currentPassword === values.newPassword) {
          setFieldError("newPassword", "Mật khẩu mới không được trùng với mật khẩu cũ");
          return;
        }

        await axiosConfig.put("/api/v1/me/change-password", {
          password: values.currentPassword,
          newPassword: values.newPassword,
        });

        setConfirmLogoutOpen(true);
        resetForm();
      } catch (error: any) {
        const status = error?.response?.status;
        const message = error?.response?.data?.message || "Đổi mật khẩu thất bại";

        if (status === 401) {
          setFieldError("currentPassword", "Mật khẩu hiện tại không đúng");
        } else {
          alert("Lỗi: " + message);
        }
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/auth/login";
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <Box display="flex" alignItems="center" justifyContent="space-between" p={2} pb={0}>
          <Typography variant="h6" fontWeight={600}>
            Đổi mật khẩu
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              {(Object.keys(fieldLabels) as FieldName[]).map((field) => (
                <TextField
                  key={field}
                  label={fieldLabels[field]}
                  name={field}
                  type="password"
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                  error={formik.touched[field] && Boolean(formik.errors[field])}
                  helperText={formik.touched[field] && formik.errors[field]}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      minHeight: '56px',
                      '& fieldset': { borderColor: 'grey.300' },
                      '&:hover fieldset': { borderColor: 'primary.main' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                      color: 'text.secondary',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'primary.main',
                    },
                  }}
                />
              ))}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ py: 1.5, fontSize: 16, fontWeight: 600 }}
              >
                Đổi mật khẩu
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>

      <MuiDialog open={confirmLogoutOpen} onClose={() => setConfirmLogoutOpen(false)}>
        <DialogTitle fontWeight={600}>🎉 Đổi mật khẩu thành công</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có muốn đăng xuất và đăng nhập lại không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmLogoutOpen(false);
              onClose();
            }}
          >
            Không
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Đăng xuất
          </Button>
        </DialogActions>
      </MuiDialog>
    </>
  );
}
