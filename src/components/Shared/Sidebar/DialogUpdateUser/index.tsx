import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Divider,
  CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import useAuth from "@/hook/api/useAuth";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useEffect, useState } from "react";
import EditProfileDialog from "./EditProfileDialog"
import axiosConfig from "@/services/axiosConfig";
interface ProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileDialog({ open, onClose }: ProfileDialogProps) {
  const { me, handleGetMe } = useAuth();
  const [loading, setLoading] = useState(false)
  const [openEdit, setOpenEdit] = useState(false);
  function formatVietnameseDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day} tháng ${month}, ${year}`;
  }
  useEffect(() => {
    handleGetMe();
  }, []);
  const onLoadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      setLoading(true)
      await axiosConfig.put("/api/v1/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      await handleGetMe();
      setLoading(false)
    } catch (err) {
      console.error("Upload avatar lỗi:", err);
    }
  }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" >
      {/* Dialog Title */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 16,
          fontWeight: "600",
          padding: '0px 0px 0px px!important'
        }}
      >
        Thông tin tài khoản
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ padding: 0 }}>
       { loading ? <Box height={300} alignItems={'center'}  justifyContent={'center'} display={'flex'}> 

        <CircularProgress size={30}/>
       </Box> :<>
      
        <Box sx={{ position: "relative" }}>
          <img
            src="/assets/images/bg.png"
            alt="cover"
            style={{ width: "100%", height: 120, objectFit: "cover" }}
          />

          {/* Avatar and Name */}
          <Box
            sx={{
              position: "absolute",
              bottom: -50,
              left: 16,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={me.avatar || "/assets/images/avatar_demo.jpg"}
                sx={{ width: 80, height: 80, border: "2px solid white" }}
              />
              <IconButton
                component="label"
                size="small"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                <CameraAltIcon fontSize="small" />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onLoadAvatar}
                />

              </IconButton>
            </Box>
            <Typography fontWeight={600} fontSize={18} ml={2} mt={4}>
              {me.lastName + " " + me.firstName || "Ko load ten len"}
            </Typography>
          </Box>
        </Box>

        {/* User Info Section */}
        <Box sx={{ mt: 8, px: 2 }}>
          <Divider sx={{ borderBottomWidth: 2, my: 3 }} />
          <Typography
            fontSize={16}
            fontWeight={600}
            color="text.primary"
            mb={1}
          >
            Thông tin cá nhân
          </Typography>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="text.secondary">Ngày sinh</Typography>
            <Typography>{formatVietnameseDate(me.dateOfBirth) || ""}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography color="text.secondary">Điện thoại</Typography>
            <Typography>{me.phone || ""}</Typography>
          </Box>

          <Typography mt={2} fontSize={12} color="text.secondary">
            Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số này
          </Typography>
          <Divider sx={{ mt: 3 }} />

          {/* Update Button */}
          <Button
            fullWidth
            variant="outlined"
            sx={{
              border: "none",
              textTransform: "none",
              color: "#000",
              fontSize: 18,
              fontWeight: "500",
              my: 1,
              '&:hover': {
                backgroundColor: '#f0f0f0'
              }
            }}
            startIcon={<BorderColorIcon />}
            onClick={() => setOpenEdit(true)}
          >
            Cập nhật
          </Button>
        </Box>
        <EditProfileDialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
        />  </>}
      </DialogContent>
    </Dialog>
  );
}