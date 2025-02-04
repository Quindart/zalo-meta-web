import React, { useState } from "react";
import { Menu, MenuItem, Button, ListItemIcon, ListItemText, Checkbox } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const categories = [
  { label: "Tin Người thân quen", color: "bg-teal-400" },
  { label: "Công việc", color: "bg-red-500" },
  { label: "Code ngoài", color: "bg-yellow-400" },
  { label: "Học trên lớp", color: "bg-green-500" },
  { label: "Tin nhắn từ người lạ", icon: "🤷‍♂️" },
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
    <div className="relative">
      <Button variant="contained" className="bg-blue-500 hover:bg-blue-600 text-white" endIcon={<ExpandMore />} onClick={handleOpen}>
        Phân loại
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem disabled className="font-semibold opacity-70">
          Theo thẻ phân loại
        </MenuItem>
        {categories.map(({ label, color, icon }, index) => (
          <MenuItem key={index} onClick={() => handleToggle(label)}>
            <ListItemIcon>{icon ? <span className="text-lg">{icon}</span> : <span className={`w-3 h-3 ${color} rounded-full`}></span>}</ListItemIcon>
            <ListItemText>{label}</ListItemText>
            <Checkbox checked={selected.includes(label)} />
          </MenuItem>
        ))}
        <MenuItem className="text-blue-500 hover:bg-gray-100">
          <ListItemText primary="Quản lý thẻ phân loại" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default PopupCategory;
