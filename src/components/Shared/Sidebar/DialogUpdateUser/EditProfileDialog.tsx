import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Box,
    IconButton,
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
      .matches(/^[A-Za-zA-Z\s]+$/, "Họ không hợp lệ (chỉ chứa chữ cái và khoảng trắng)"),
    
    firstName: Yup.string()
      .required("Vui lòng nhập tên")
      .matches(/^[A-Za-zA-Z\s]+$/, "Tên không hợp lệ (chỉ chứa chữ cái và khoảng trắng)"),
    dateOfBirth: Yup.date()
      .required("Vui lòng chọn ngày sinh")
      .max(dayjs().subtract(18, 'year').toDate(), "Bạn phải đủ 18 tuổi trở lên"),
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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                Chỉnh sửa thông tin
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
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
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Số điện thoại"
                            name="phone"
                            disabled
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                            fullWidth
                        />
                        <Button type="submit" variant="contained">
                            Lưu thay đổi
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    );
}
