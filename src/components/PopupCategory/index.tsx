import React, { useState } from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Checkbox, Box } from "@mui/material";

const categories = [
  { label: "Tin Người thân quen", color: "bg-teal-400" },
  { label: "Công việc", color: "bg-red-500" },
  { label: "Code ngoài", color: "bg-yellow-400" },
  { label: "Học trên lớp", color: "bg-green-500" },
  { label: "Tin nhắn từ người lạ", icon: "🤷‍♂️" },
];

interface PopupCategoryProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
}

const PopupCategory: React.FC<PopupCategoryProps> = ({ anchorEl, onClose }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (label: string) => {
    setSelected((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]));
  };

  return (
    <Box className="relative ">
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
        <MenuItem disabled>
          Theo thẻ phân loại
        </MenuItem>
        {categories.map(({ label, color, icon }, index) => (
          <MenuItem key={index} onClick={() => handleToggle(label)}>
            <ListItemIcon>{icon ? <span>{icon}</span> : <span className={` ${color}`}></span>}</ListItemIcon>
            <ListItemText>{label}</ListItemText>
            <Checkbox checked={selected.includes(label)} />
          </MenuItem>
        ))}
        <MenuItem>
          <ListItemText primary="Quản lý thẻ phân loại" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PopupCategory;
