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
} from "@mui/material";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import ShareIcon from "@mui/icons-material/Share";
import BlockIcon from "@mui/icons-material/Block";
import ReportIcon from "@mui/icons-material/Report";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { grey } from "@mui/material/colors";

interface InfoDialogProps {
  open: boolean;
  onClose: () => void;
}

const InfoDialog: React.FC<InfoDialogProps> = ({ open, onClose }) => {
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
        style: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Màu nền mờ
      }}
    >
      {/* Tiêu đề có nút đóng */}
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" , fontSize: 15, fontWeight: "600"}}>
        Thông tin tài khoản
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider/>

      <DialogContent
        sx={{
          p: 0,
          maxHeight: "70vh", // Giới hạn chiều cao để xuất hiện thanh cuộn
          overflowY: "overlay", // Ẩn thanh cuộn khi không cần thiết
          "&::-webkit-scrollbar": {
            width: "8px", // Độ rộng của thanh cuộn
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            visibility: "hidden",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            visibility: "visible"
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)"
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent"
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

        {/* Ảnh đại diện + Tên */}
        <Box sx={{ textAlign: "center"}}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap:1,
                    paddingLeft:2
                }}
            >
                <Avatar
                    src="/assets/images/zalo-icon.png"
                    sx={{ width: 80, height: 80, border: "2px solid #C3C5C8", mt:-3}}
                />
                <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold" }}>
                    Nguyen Kim Ngoc Tuyen
                </Typography>
                <IconButton
                    sx={{
                        width: 30, 
                        height: 30, 
                        "&:hover": {
                        backgroundColor: grey[100], // Màu hover
                        },
                    }}
                    >
                    <EditIcon sx={{ color: "#1a2b44" , fontSize:20}} /> {/* Màu icon xanh đậm */}
                </IconButton>
          </Box>


            <Button
            variant="contained"
            sx={{
                backgroundColor: "#E6F0FF", // Màu nền xanh nhạt
                color: "#235DB2", // Màu chữ xanh đậm
                fontWeight: "bold",
                textTransform: "none", // Giữ nguyên chữ, không viết hoa
                borderRadius: "5px", // Bo góc mềm mại
                padding: "8px 16px", // Điều chỉnh padding cho nút
                "&:hover": {
                backgroundColor: "#DBEBFF", // Màu hover nhạt hơn một chút
                },
                width: "90%",
                fontSize: 15,
                mt:2
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
              Giới tính
            </Typography>
            <Typography variant="body2">Nữ</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "gray", minWidth: 100 }}>
              Ngày sinh
            </Typography>
            <Typography variant="body2">04 tháng 01, 2003</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "gray", minWidth: 100 }}>
              Điện thoại
            </Typography>
            <Typography variant="body2">{"•".repeat(10)}</Typography>
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
              overflowX: "auto",
              scrollbarWidth: "none", // Ẩn scrollbar trên Firefox
              "&::-webkit-scrollbar": {
                display: "none", // Ẩn scrollbar trên Chrome, Safari
              },
              paddingBottom: 1, // Thêm padding để tránh bị che mất hình ảnh
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
                  flexShrink: 0, // Tránh co lại khi cuộn
                }}
              />
            ))}
          </Box>
      </Box>


        <Divider />

        {/* Các tùy chọn khác */}

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
      </Box>;

      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
