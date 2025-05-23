import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  IconButton,
  Avatar,
  Typography,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import useAuth from "@/hook/api/useAuth";
import axiosConfig from "@/services/axiosConfig";
import * as Yup from "yup";
import { useFormik } from "formik";
import dayjs from "dayjs";

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  lastName: Yup.string()
    .required("Vui lòng nhập họ")
    .matches(/^[A-Za-zÀ-ỹ\s]+$/, "Họ không hợp lệ"),
  firstName: Yup.string()
    .required("Vui lòng nhập tên")
    .matches(/^[A-Za-zÀ-ỹ\s]+$/, "Tên không hợp lệ"),
  dateOfBirth: Yup.date()
    .required("Vui lòng chọn ngày sinh")
    .max(dayjs().subtract(18, "year").toDate(), "Bạn phải đủ 18 tuổi"),
});

export default function EditProfileDialog({ open, onClose }: EditProfileDialogProps) {
  const { me, handleGetMe } = useAuth();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          name: me.name,
          avatar: me.avatar,
        };
        await axiosConfig.put("/api/v1/me", payload);
        await handleGetMe();
        onClose();
      } catch (error) {
        console.error("Lỗi cập nhật:", error);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (me) {
      formik.setValues({
        firstName: me.firstName || "",
        lastName: me.lastName || "",
        phone: me.phone || "",
        dateOfBirth: me.dateOfBirth?.slice(0, 10) || "",
      });
    }
  }, [me]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box position="relative" p={2}>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
        >
          <CloseIcon />
        </IconButton>
        <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
          <Avatar
            src={me?.avatar}
            sx={{ width: 80, height: 80, mb: 1, boxShadow: 2 }}
          />
          <Typography variant="h6" fontWeight="bold">
            Chỉnh sửa thông tin
          </Typography>
        </Box>
      </Box>
      <DialogContent sx={{ pt: 1 }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Họ"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              fullWidth
            />
            <TextField
              label="Tên"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName}
              fullWidth
            />
            <TextField
              label="Ngày sinh"
              name="dateOfBirth"
              type="date"
              value={formik.values.dateOfBirth}
              onChange={formik.handleChange}
              error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
              helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Số điện thoại"
              name="phone"
              disabled
              value={formik.values.phone}
              fullWidth
            />
            <Box display="flex" justifyContent="flex-end" gap={2} mt={1}>
              <Button onClick={onClose} variant="outlined" color="inherit">
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Lưu
              </Button>
            </Box>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}
