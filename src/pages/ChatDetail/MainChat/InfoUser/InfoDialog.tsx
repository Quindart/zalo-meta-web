import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import ShareIcon from "@mui/icons-material/Share";
import BlockIcon from "@mui/icons-material/Block";
import ReportIcon from "@mui/icons-material/Report";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { grey } from "@mui/material/colors";
import { useChat } from "@/hook/api/useChat";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface InfoDialogProps {
  open: boolean;
  onClose: () => void;
  user: {
    _id?: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender?: string;
    birthday?: string;
  } | null;
  parentClose?: () => void; // Added parentClose prop
}

const InfoDialog: React.FC<InfoDialogProps> = ({ open, onClose, user, parentClose }) => {
  const fullName = `${user?.lastName ?? ""} ${user?.firstName ?? ""}`.trim();
  const birthday = user?.birthday ?? "Không rõ";
  const phoneMasked = user?.phone
    ? user.phone.replace(/.(?=.{4})/g, "•")
    : "•".repeat(10);

  const navigate = useNavigate();
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  const { findOrCreateChat, channel } = useChat(me.id);
  const [shouldNavigate, setShouldNavigate] = useState<string | null>(null);

  useEffect(() => {
    if (channel && shouldNavigate === channel.id) {
      // Close both dialogs before navigation
      onClose();
      if (parentClose) parentClose();
      
      // Navigate after a short delay to allow dialogs to close
      setTimeout(() => {
        navigate(`/chats/${channel.id}`);
        setShouldNavigate(null);
      }, 100);
    }
  }, [channel, navigate, shouldNavigate, onClose, parentClose]);

  const handleFindChat = (receiverId: string) => {
    if (!receiverId) return;
    findOrCreateChat(receiverId);
    
    // If we already have a channel, we can close immediately
    if (channel) {
      onClose();
      if (parentClose) parentClose();
    }
  };

  useEffect(() => {
    if (channel) {
      setShouldNavigate(channel.id);
    }
  }, [channel]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          background: "white",
          boxShadow: 5,
          borderRadius: 2,
        },
      }}
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 15,
          fontWeight: "600",
        }}
      >
        Thông tin tài khoản
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{
          p: 0,
          maxHeight: "70vh",
          overflowY: "overlay",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            visibility: "hidden",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            visibility: "visible",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        }}
      >
        {/* Ảnh bìa */}
        <Box
          sx={{
            height: 150,
            backgroundImage: "url(/assets/images/bg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              paddingLeft: 2,
            }}
          >
            <Avatar
              src={user?.avatar || "/assets/images/zalo-icon.png"}
              sx={{ width: 80, height: 80, border: "2px solid #C3C5C8", mt: -3 }}
            />
            <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold" }}>
              {fullName || "Không rõ"}
            </Typography>
            <IconButton
              sx={{
                width: 30,
                height: 30,
                "&:hover": {
                  backgroundColor: grey[100],
                },
              }}
            >
              <EditIcon sx={{ color: "#1a2b44", fontSize: 20 }} />
            </IconButton>
          </Box>
          <Button
            onClick={() => {
              handleFindChat(user?._id || "");
            }}
            variant="contained"
            sx={{
              backgroundColor: "#E6F0FF",
              color: "#235DB2",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "5px",
              padding: "8px 16px",
              "&:hover": {
                backgroundColor: "#DBEBFF",
              },
              width: "90%",
              fontSize: 15,
              mt: 2,
            }}
          >
            Nhắn tin
          </Button>
        </Box>

        {/* Thông tin cá nhân */}
        <Box sx={{ mt: 2, p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
            Thông tin cá nhân
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "gray", minWidth: 100 }}>
              Ngày sinh
            </Typography>
            <Typography variant="body2">{birthday}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "gray", minWidth: 100 }}>
              Điện thoại
            </Typography>
            <Typography variant="body2">{phoneMasked}</Typography>
          </Box>
        </Box>

        <Divider />

        {/* Hình ảnh */}
        <Box sx={{ mt: 2, p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Hình ảnh
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 1,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              paddingBottom: 1,
            }}
          >
            {[
              "/assets/images/dog1.jpg",
              "/assets/images/dog2.jpg",
              "/assets/images/dog1.jpg",
              "/assets/images/dog2.jpg",
              "/assets/images/zalo-welcom.png",
              "/assets/images/check_welcom.png",
            ].map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Ảnh ${index + 1}`}
                width="100"
                height="100"
                style={{
                  borderRadius: 12,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ))}
          </Box>
        </Box>

        <Divider />

        <Box sx={{ mt: 2, p: 2 }}>
          <List>
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Nhóm chung (8)" />
            </ListItemButton>

            <ListItemButton>
              <ListItemIcon>
                <ShareIcon />
              </ListItemIcon>
              <ListItemText primary="Chia sẻ danh thiếp" />
            </ListItemButton>

            <ListItemButton>
              <ListItemIcon>
                <BlockIcon />
              </ListItemIcon>
              <ListItemText primary="Chặn tin nhắn và cuộc gọi" />
            </ListItemButton>

            <ListItemButton>
              <ListItemIcon>
                <ReportIcon />
              </ListItemIcon>
              <ListItemText primary="Báo xấu" />
            </ListItemButton>

            <ListItemButton sx={{ color: "red" }}>
              <ListItemIcon sx={{ color: "red" }}>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="Xóa khỏi danh sách bạn bè" />
            </ListItemButton>
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;