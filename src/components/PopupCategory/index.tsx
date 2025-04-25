import { useState } from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Checkbox, Box } from "@mui/material";
// import { ExpandMore } from "@mui/icons-material";

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

  // const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (label: string) => {
    setSelected((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]));
  };

  return (
    <Box className="relative">
      {/* <Button size="small" color="inherit" variant="text" endIcon={<ExpandMore />} onClick={handleOpen}>
        Phân loại
      </Button> */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
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
