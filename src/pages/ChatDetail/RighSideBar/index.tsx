import { useChatContext } from "@/Context/ChatContextType";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import GroupMembersPage from "./GroupMembersPage";
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
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import InfoGroupDialog from "./InfoGroup/InfoGroupDialog.tsx";
import { useNavigate } from "react-router-dom";

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
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  const {
    channel,
    leaveRoom,
    dissolveGroup,
    deleteAllMessages,
  } = useChatContext();
  const [open, setOpen] = useState<boolean>(false);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [role, setRole] = useState<string>("member");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [clearHistoryDialogOpen, setClearHistoryDialogOpen] = useState<boolean>(false);
  const [showMembersPage, setShowMembersPage] = useState(false);

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

  const handleDisbandGroup = async () => {
    setConfirmDialogOpen(true);
  };

  const confirmDisbandGroup = async () => {
    try {
      dissolveGroup(channel.id);
      setConfirmDialogOpen(false);
      navigate('/chats');
    } catch (error) {
      console.error("Error confirming disband group:", error);
    }
  };

  const AvatarChannel = () => {
    if (channel) {
      if (channel.type === "group") {
        return channel.avatarGroup.map((src: string, index: number) => (
          <Avatar key={index} src={src} sx={{ width: 56, height: 56 }} />
        ));
      } else {
        return (
          <Avatar src={channel.avatar} sx={{ width: 56, height: 56 }} />
        );
      }
    }
  };

  const handleClearHistory = () => {
    setClearHistoryDialogOpen(true);
  };

  const confirmClearHistory = async () => {
    try {
      if (channel) {
        deleteAllMessages(channel.id);
        setClearHistoryDialogOpen(false);
        navigate('/chats');
      }
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  return (
    showMembersPage ? (
      <GroupMembersPage onBack={() => setShowMembersPage(false)} />
    ) : (
      <Drawer variant="permanent" anchor="right" sx={{ flexShrink: 0 }}>
        {/* Header */}
        <Box sx={{ py: 2, textAlign: "center", minWidth: 355 }}>
          <Typography fontWeight={"bold"} fontSize={20} color="#081B3A">
            Thông tin hội thoại
          </Typography>
        </Box>
        <Divider />

        {channel && (
          <>
            {!channel.isDeleted ? (
              <>
                {/* Avatar + Actions */}
                <Box sx={{ width: 340, textAlign: "center" }}>
                  <AvatarGroup
                    max={3}
                    sx={{ justifyContent: "center", mt: 3 }}
                    onClick={() => setOpen(true)}
                  >
                    {AvatarChannel()}
                  </AvatarGroup>

                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", my: 2 }}>
                    <Typography fontWeight={"bold"} fontSize={17} color="#081B3A" noWrap>
                      {channel.name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "center", gap: 2, my: 2 }}>
                    {actions.map(({ icon, label }, index) => (
                      <Stack key={index} alignItems="center">
                        <IconButton sx={{ bgcolor: "#e5e7eb", width: 40, height: 40, color: "#081B3A", "&:hover": { bgcolor: "#e0e0e0" } }}>
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
                        <ListItemButton
                          onClick={() => {
                            toggleSection(id);
                            if (id === "members") {
                              setShowMembersPage(true);
                            }
                          }}
                        >
                          <ListItemText sx={{ fontSize: 16, fontWeight: "bold" }} primary={title} />
                          {id !== "members" && (
                            openSections[id] ? <ExpandLess /> : <ExpandMore />
                          )}
                        </ListItemButton>
                        {id !== "members" && (
                          <Collapse in={openSections[id]} timeout="auto" unmountOnExit>
                            <Box sx={{ px: 3, py: 1 }}>
                              <ListItemText secondary={content} />
                            </Box>
                          </Collapse>
                        )}
                      </div>
                    ))}
                  </List>
                </Box>

                <Divider />
                {/* Media Preview */}
                <Box sx={{ p: 2 }}>
                  <Typography color="#081B3A">Ảnh/Video</Typography>
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
                  <ListItemButton onClick={handleClearHistory} sx={{ color: "#C62218" }}>
                    <ListItemText sx={{ ml: 2 }} primary={'Xóa lịch sử trò chuyện'} />
                  </ListItemButton>
                  {channel && channel.type === "group" && !channel.isDeleted && role === "captain" && (
                    <ListItemButton sx={{ color: "#C62218" }} onClick={handleDisbandGroup}>
                      <ListItemText sx={{ ml: 2 }} primary={'Giải tán nhóm'} />
                    </ListItemButton>
                  )}
                  {channel && channel.type === "group" && !channel.isDeleted && (
                    <ListItemButton onClick={() => leaveRoom(channel.id)} sx={{ color: "#C62218" }}>
                      <ListItemText sx={{ ml: 2 }} primary={'Rời nhóm'} />
                    </ListItemButton>
                  )}
                </List>
              </>
            ) : (
              <>
                <Box sx={{ p: 2, textAlign: "center", color: "gray" }}>
                  <ListItemButton onClick={handleClearHistory} sx={{ color: "#C62218" }}>
                    <ListItemText sx={{ ml: 2 }} primary={'Xóa lịch sử trò chuyện'} />
                  </ListItemButton>
                </Box>
              </>
            )}
          </>
        )}

        <InfoGroupDialog open={open} onClose={() => setOpen(false)} />

        {/* Confirm dialogs */}
        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: 2, width: { xs: '90%', sm: 400 }, maxWidth: 400 } }}>
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, fontSize: 18, pt: 3 }}>Giải tán nhóm</DialogTitle>
          <DialogContent sx={{ px: 3 }}>
            <DialogContentText sx={{ textAlign: 'center', fontSize: 15, color: '#343a40' }}>
              Mời tất cả mọi người rời nhóm và xóa tin nhắn? Nhóm đã giải tán sẽ KHÔNG THỂ khôi phục.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 2, gap: 1 }}>
            <Button onClick={() => setConfirmDialogOpen(false)} variant="outlined" fullWidth sx={{ borderRadius: 1.5, textTransform: 'none', py: 1, border: '1px solid #e0e0e0', color: '#616161' }}>
              Không
            </Button>
            <Button onClick={confirmDisbandGroup} variant="contained" fullWidth sx={{ borderRadius: 1.5, textTransform: 'none', py: 1, bgcolor: '#e53935', '&:hover': { bgcolor: '#d32f2f' } }}>
              Giải tán nhóm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Clear history dialog */}
        <Dialog open={clearHistoryDialogOpen} onClose={() => setClearHistoryDialogOpen(false)} PaperProps={{ sx: { borderRadius: 2, width: { xs: '90%', sm: 400 }, maxWidth: 400 } }}>
          <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, fontSize: 18, pt: 3 }}>Xóa lịch sử trò chuyện</DialogTitle>
          <DialogContent sx={{ px: 3 }}>
            <DialogContentText sx={{ textAlign: 'center', fontSize: 15, color: '#343a40' }}>
              Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện? Hành động này không thể hoàn tác.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 2, gap: 1 }}>
            <Button onClick={() => setClearHistoryDialogOpen(false)} variant="outlined" fullWidth sx={{ borderRadius: 1.5, textTransform: 'none', py: 1, border: '1px solid #e0e0e0', color: '#616161' }}>
              Hủy
            </Button>
            <Button onClick={confirmClearHistory} variant="contained" fullWidth sx={{ borderRadius: 1.5, textTransform: 'none', py: 1, bgcolor: '#e53935', '&:hover': { bgcolor: '#d32f2f' } }}>
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Drawer>
    )
  );
};

export default RightSideBar;
