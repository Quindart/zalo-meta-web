import { useEffect, useState } from "react";
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
} from "@mui/icons-material";
import InfoGroupDialog from "./InfoGroup/InfoGroupDialog.tsx";
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

const RightSideBar = ({
  channel,
  leaveRoom,
  me,
}: {
  channel: any;
  leaveRoom: (channelId: string) => void;
  me: any;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [role, setRole] = useState<string>("member");

  useEffect(() => {
    if (channel && channel.members) {
      const currentUser = channel.members.find(
        (member: any) => member.userId === me.id,
      );
      if (currentUser) {
        setRole(currentUser.role);
      }
    }
  }, [channel]);

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
        <Typography fontWeight={"bold"} fontSize={20} color="#081B3A">
          Thông tin hội thoại
        </Typography>
      </Box>
      <Divider />

      {/* Avatar + Actions */}
      <Box sx={{ width: 340, textAlign: "center" }}>
        <AvatarGroup
          max={3}
          sx={{ justifyContent: "center", mt: 3 }}
          onClick={() => setOpen(true)}
        >
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
            my: 2,
          }}
        >
          <Typography fontWeight={"bold"} fontSize={17} color="#081B3A" noWrap>
            Nhóm Công Nghệ Mới
          </Typography>
          {/* <IconButton sx={{ marginLeft: 1 }}>
            <BorderColor sx={{ color: "#081B3A" }} />
          </IconButton> */}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, my: 2 }}>
          {actions.map(({ icon, label }, index) => (
            <Stack key={index} alignItems="center">
              <IconButton
                sx={{
                  bgcolor: "#e5e7eb",
                  width: 40,
                  height: 40,
                  color: "#081B3A",
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
          {sections.map(({ id, title, content }) => (
            <div key={id}>
              <ListItemButton onClick={() => toggleSection(id)}>
                <ListItemText
                  sx={{ fontSize: 16, fontWeight: "bold" }}
                  primary={title}
                />
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
        <Typography color="#081B3A">Ảnh/Video</Typography>
        {/* <img
          src="/static/sample-image.jpg"
          alt="Ảnh nhóm"
          style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
        /> */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "#E5E7EB",
            color: "#081b3a",
            boxShadow: "none",
            height: 40,
            border: 0,
            fontSize: 16,
            fontWeight: 600,
            mt: 1,
          }}
        >
          Xem tất cả
        </Button>
      </Box>
      <Divider />

      <Box sx={{ p: 2, textAlign: "center", color: "gray" }}>
        <Typography variant="body2">
          Chưa có File được chia sẻ trong hội thoại này
        </Typography>
      </Box>

      <Divider />
      <List sx={{ bgcolor: "white", borderRadius: 1 }}>
        <ListItemButton
          sx={{ color: "#C62218" }}
        >
          <ListItemText sx={{ ml: 2 }} primary={'Xóa lịch sử trò chuyện'} />
        </ListItemButton>

        {
          role === "captain" && (
            <ListItemButton
              onClick={() => leaveRoom(channel.id)}
              sx={{ color: "#C62218" }}
            >
              <ListItemText sx={{ ml: 2 }} primary={'Giải tán nhóm'} />
            </ListItemButton>
          )
        }


        {
          channel && channel.type === "group" && (
            <ListItemButton
              onClick={() => leaveRoom(channel.id)}
              sx={{ color: "#C62218" }}
            >
              <ListItemText sx={{ ml: 2 }} primary={'Rời nhóm'} />
            </ListItemButton>
          )
        }

      </List>
      <InfoGroupDialog open={open} onClose={() => setOpen(false)} />
    </Drawer>
  );
};

export default RightSideBar;
