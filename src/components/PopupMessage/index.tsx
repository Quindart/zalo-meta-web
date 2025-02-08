import React, { useState } from "react";
import { Menu, MenuItem, Divider, ListItemIcon } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from "@mui/icons-material/Delete";
import ReportIcon from "@mui/icons-material/Report";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";



const PopupMessage: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <div style={{ position: "absolute", right: "0", top: "0" }}>
      <button onClick={handleClick} style={{ border: "none", background: "none", cursor: "pointer" }}>
        <MoreHorizIcon fontSize="small" />
      </button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>📌 Ghim hội thoại</MenuItem>
        <MenuItem
        >
          📂 Phân loại <ArrowRightIcon style={{ marginLeft: "auto" }} />
        </MenuItem>
        <MenuItem onClick={handleClose}>✅ Đánh dấu chưa đọc</MenuItem>
        <MenuItem onClick={handleClose}>👥 Thêm vào nhóm</MenuItem>

        <Divider />

        <MenuItem onClick={handleClose}>🔕 Tắt thông báo</MenuItem>
        <MenuItem onClick={handleClose}>🙈 Ẩn trò chuyện</MenuItem>
        <MenuItem onClick={handleClose}>⏳ Tin nhắn tự xóa</MenuItem>

        <Divider />

        <MenuItem onClick={handleClose} sx={{ color: "red" }}>
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          Xóa hội thoại
        </MenuItem>

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ReportIcon />
          </ListItemIcon>
          Báo xấu
        </MenuItem>
      </Menu>


    </div>
  );
};

export default PopupMessage;