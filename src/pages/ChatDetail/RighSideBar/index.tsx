import { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Button,
  Box,
  AvatarGroup,
  Stack,
  IconButton,
  Collapse,
  ListItemIcon,
} from "@mui/material";
import {
  NotificationsOff,
  PersonAdd,
  PushPin,
  Settings,
  ExpandLess,
  ExpandMore,
  Groups,
  Newspaper,
  PhotoLibrary,
  InsertDriveFile,
  Link,
  Security,
  DeleteOutline,
  ExitToApp,
  BorderColor,
} from "@mui/icons-material";
import InfoGroupDialog from "./InfoGroup/InfoGroupDialog.tsx"
const sections = [
  {
    id: "members",
    title: "Thành viên nhóm",
    icon: <Groups />,
    content: "5 thành viên",
  },
  {
    id: "news",
    title: "Bảng tin nhóm",
    icon: <Newspaper />,
    content: "Không có bài viết mới",
  },
  {
    id: "media",
    title: "Ảnh/Video",
    icon: <PhotoLibrary />,
    content: "20 ảnh, 5 video",
  },
  {
    id: "files",
    title: "File",
    icon: <InsertDriveFile />,
    content: "10 file được chia sẻ",
  },
  {
    id: "links",
    title: "Link",
    icon: <Link />,
    content: "3 liên kết được lưu",
  },
  {
    id: "security",
    title: "Thiết lập bảo mật",
    icon: <Security />,
    content: "Cài đặt quyền riêng tư",
  },
];

const actions = [
  { icon: <NotificationsOff />, label: "Tắt thông báo" },
  { icon: <PushPin />, label: "Ghim hội thoại" },
  { icon: <PersonAdd />, label: "Thêm thành viên" },
  { icon: <Settings />, label: "Quản lý nhóm" },
];

const RightSideBar = () => {
  const [open, setOpen] =useState<boolean>(false);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {},
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{ width: 300, flexShrink: 0 }}
    >
      {/* Header */}
      <Box sx={{ py: 3, textAlign: "center" }}>
        
        <Typography variant="body1">Thông tin nhóm</Typography>
      </Box>

      {/* Avatar + Actions */}
      <Box sx={{ width: 340, p: 1, textAlign: "center" }}>
        <AvatarGroup max={3} sx={{ justifyContent: "center", mt: 1 }} onClick={()=>setOpen(true)} >
          {[
            "/static/avatar1.jpg",
            "/static/avatar2.jpg",
            "/static/avatar3.jpg",
            "/static/avatar4.jpg",
          ].map((src, index) => (
            <Avatar key={index} src={src} />
          ))}
        </AvatarGroup>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography variant="body1" noWrap>
            Nhóm 🔥 Công Nghệ Mới
          </Typography>
          <IconButton sx={{ marginLeft: 3 }}>
            <BorderColor sx={{ color: "black" }} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
          {actions.map(({ icon, label }, index) => (
            <Stack key={index} alignItems="center">
              <IconButton
                sx={{
                  bgcolor: "#f0f0f0",
                  width: 40,
                  height: 40,
                  color: "black",
                  "&:hover": { bgcolor: "#e0e0e0" },
                }}
              >
                {icon}
              </IconButton>
              <Typography sx={{ fontSize: "12px", mt: 1 }}>{label}</Typography>
            </Stack>
          ))}
        </Box>
      </Box>

      <Divider />

      {/* Menu Sections */}
      <Box sx={{ width: "100%", bgcolor: "white" }}>
        <List>
          {sections.map(({ id, title, icon, content }) => (
            <div key={id}>
              <ListItemButton onClick={() => toggleSection(id)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText sx={{ fontSize: 10 }} primary={title} />
                {openSections[id] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openSections[id]} timeout="auto" unmountOnExit>
                <Box sx={{ px: 3, py: 1 }}>
                  <ListItemText secondary={content} />
                </Box>
              </Collapse>
            </div>
          ))}
        </List>
      </Box>

      <Divider />

      {/* Media Preview */}
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">Ảnh/Video</Typography>
        {/* <img
          src="/static/sample-image.jpg"
          alt="Ảnh nhóm"
          style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
        /> */}
        <Button variant="text" fullWidth>
          Xem tất cả
        </Button>
      </Box>
      <Divider />

      {/* Empty File Section */}
      <Box sx={{ p: 2, textAlign: "center", color: "gray" }}>
        <Typography variant="body2">
          Chưa có File được chia sẻ trong hội thoại này
        </Typography>
      </Box>

      <Divider />

      {/* Danger Zone */}
      <List sx={{ bgcolor: "white", borderRadius: 1, boxShadow: 2 }}>
        {[
          { icon: <DeleteOutline />, text: "Xóa lịch sử trò chuyện" },
          { icon: <ExitToApp />, text: "Rời nhóm" },
        ].map(({ icon, text }, index) => (
          <ListItemButton
            key={index}
            sx={{ color: "red" }}
            onClick={() => alert(text)}
          >
            <ListItemIcon sx={{ color: "red", minWidth: "40px" }}>
              {icon}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
      <InfoGroupDialog open={open} onClose={() => setOpen(false)}/>
    </Drawer>
  );
};

export default RightSideBar;
