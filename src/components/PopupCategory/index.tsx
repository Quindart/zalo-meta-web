import React, { useState } from "react";
import { Menu, MenuItem, Button, ListItemIcon, ListItemText, Checkbox, Box } from "@mui/material";
import LabelIcon from "@mui/icons-material/Label";
import { ExpandMore } from "@mui/icons-material";
import { BsPersonFillExclamation } from "react-icons/bs";

const categories = [
  { label: "Khách hàng", color: "#D91B1B" },
  { label: "Gia đình", color: "#F31BC8" },
  { label: "Công việc", color: "#FF6905" },
  { label: "Bạn bè", color: "#FAC000" },
  { label: "Trả lời sau", color: "#4BC377" },
  { label: "Đồng nghiệp", color: "#0068FF" },
  { label: "Tin nhắn từ người lạ", icon: <BsPersonFillExclamation /> },
];

const PopupCategory = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (label: string) => {
    setSelected((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]));
  };

  return (
    <Box className="relative">
      <Button size="small" color="inherit" variant="text" endIcon={<ExpandMore />} onClick={handleOpen}>
        Phân loại
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem disabled>
          <span style={{ color: "black" }}>Theo thẻ phân loại</span>
        </MenuItem>

        {categories.map(({ label, color, icon }, index) => (
          <MenuItem key={index} onClick={() => handleToggle(label)}>
            <Checkbox checked={selected.includes(label)} />
            <ListItemIcon>{icon ? <span style={{fontSize:'1.5em', color: 'black'}}>{icon}</span> : <LabelIcon className={`mr-2`} style={{ color }} />}</ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}
        <MenuItem style={{ color: "black", textAlign: "center",borderTop: "1px solid #e0e0e0", marginLeft: "15px", marginRight: "15px" }}>
          <ListItemText primary="Quản lý thẻ phân loại" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PopupCategory;