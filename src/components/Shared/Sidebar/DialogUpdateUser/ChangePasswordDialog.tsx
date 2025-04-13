import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Box,
    Divider,
    IconButton,
    DialogActions,
    DialogContentText,
    Dialog as MuiDialog,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import axiosConfig from "@/services/axiosConfig";
import { useEffect } from "react";


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
                const payload = {
                    password: values.currentPassword,
                    newPassword: values.newPassword,
                };
                if (values.currentPassword === values.newPassword) {
                    setFieldError("newPassword", "Mật khẩu mới không được trùng với mật khẩu cũ");
                }
                else {
                    await axiosConfig.put("/api/v1/me/change-password", payload);
                    setConfirmLogoutOpen(true);
                    resetForm();
                }

            } catch (error: any) {
                const status = error?.response?.status;
                const message = error?.response?.data?.message || "Đổi mật khẩu thất bại";
                console.log("🔥 Response:", error?.response);
                console.log("🔥 Message:", error?.response?.data?.message);

                if (status === 401) {
                    setFieldError("currentPassword", "Mật khẩu hiện tại không đúng");
                } else {
                    alert("Lỗi khác: " + message);
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
        // Xóa token trong localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Chuyển hướng về trang login
        window.location.href = "/auth/login";
    };


    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="xs" sx={{ padding: 0 }} >
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                    Thay đổi mật khẩu
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <form onSubmit={formik.handleSubmit}>
                        <Box display="flex" flexDirection="column" gap={3} mt={1}>
                            <TextField
                                label="Mật khẩu hiện tại"
                                name="currentPassword"
                                type="password"
                                value={formik.values.currentPassword}
                                onChange={formik.handleChange}
                                error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                                helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                                fullWidth
                                sx={{
                                    // Make the TextField taller by adjusting padding and minHeight
                                    '& .MuiOutlinedInput-root': {
                                        padding: '12px 14px', // Increase padding to make the input area taller
                                        minHeight: '56px', // Set a minimum height for the input field
                                        '& fieldset': {
                                            borderColor: 'grey.400',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'primary.main',
                                    },
                                }}
                            />
                            <TextField
                                label="Mật khẩu mới"
                                name="newPassword"
                                type="password"
                                value={formik.values.newPassword}
                                onChange={formik.handleChange}
                                error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                helperText={formik.touched.newPassword && formik.errors.newPassword}
                                fullWidth
                                sx={{
                                    // Make the TextField taller by adjusting padding and minHeight
                                    '& .MuiOutlinedInput-root': {
                                        padding: '12px 14px', // Increase padding to make the input area taller
                                        minHeight: '56px', // Set a minimum height for the input field
                                        '& fieldset': {
                                            borderColor: 'grey.400',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'primary.main',
                                    },
                                }}
                            />
                            <TextField
                                label="Xác nhận mật khẩu mới"
                                name="confirmPassword"
                                type="password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                fullWidth
                                sx={{
                                    // Make the TextField taller by adjusting padding and minHeight
                                    '& .MuiOutlinedInput-root': {
                                        padding: '12px 14px', // Increase padding to make the input area taller
                                        minHeight: '56px', // Set a minimum height for the input field
                                        '& fieldset': {
                                            borderColor: 'grey.400',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: 'primary.main',
                                    },
                                }}
                            />
                            <Button type="submit" variant="contained" sx={{fontSize: 16, fontWeight: "500"}}>
                                Đổi mật khẩu
                            </Button>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>

            <MuiDialog open={confirmLogoutOpen} onClose={() => setConfirmLogoutOpen(false)}>
                <DialogTitle>Đổi mật khẩu thành công</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có muốn đăng xuất và đăng nhập lại không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setConfirmLogoutOpen(false); onClose() }} color="primary">
                        Không
                    </Button>
                    <Button onClick={handleLogout} sx={{backgroundColor: "#0190F3"}} variant="contained">
                        Đăng xuất
                    </Button>
                </DialogActions>
            </MuiDialog>
        </>
    );
}
