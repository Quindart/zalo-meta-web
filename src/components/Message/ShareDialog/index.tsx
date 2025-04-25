import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Tabs,
  Tab,
  Box,
  ListItemButton,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { useChat } from "@/hook/api/useChat";
import useAuth from "@/hook/api/useAuth";
import { useEffect } from "react";
// import { useChatContext } from "@/Context/ChatContextType";

type Contact = {
  id: string;
  name: string;
  avatar?: string; // ✅ Cho phép undefined
  email: string;
  phone: string;
};
type ShareDialogProps = {
  open: boolean;
  onClose: () => void;
  messageToShare: string;
  messageId: string;
};
import axiosConfig from "@/services/axiosConfig";

const getFriends = async () => {
  try {
    const response = await axiosConfig.get("/api/v1/friends");
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bạn bè:", error);
  }
  return null;
};

const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onClose,
  messageToShare,
  messageId,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [note, setNote] = useState("");
  const [tab, setTab] = useState(0);
  const { me } = useAuth();
  const { forwardMessage } = useChat(me.id);
  const [contacts, setContacts] = useState<Contact[]>([]);
  // const { listChannel } = useChatContext();

  useEffect(() => {
    const fetchFriends = async () => {
      const res = await getFriends();
      console.log("hhhhh" + res?.data.friends);
      if (res?.data.friends) {
        setContacts(res?.data.friends);
      }
    };
    if (open) {
      fetchFriends();
    }
  }, [open]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleShare = () => {
    console.log("Chia sẻ với:", selectedIds);
    console.log("id nguoi gui:", me.id);
    console.log("Nội dung ghi chú:", note);
    forwardMessage(`${messageId}`, selectedIds[0]);
    onClose();
    console.log("💲💲💲 ~ handleShare ~ messageId:", messageId);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "6px 10px 6px 16px !important",
        }}
      >
        <Typography sx={{ fontWeight: "600", fontSize: 17, color: "#081b3a" }}>
          Chia sẻ
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ px: 2, pt: 1, overflowX: "hidden" }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="medium"
          sx={{ mb: 0 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            sx: {
              height: 40,
              fontSize: 16,
              pl: 1.5,
            },
          }}
          inputProps={{
            style: {
              fontSize: 16,
              padding: "10px 0",
            },
          }}
        />

        <Tabs
          value={tab}
          onChange={(_, val) => setTab(val)}
          TabIndicatorProps={{
            style: {
              height: 3,
            },
          }}
        >
          <Tab
            label="Gần đây"
            sx={{
              color: "black",
              "&.Mui-selected": {
                fontWeight: "bold",
              },
            }}
          />
          <Tab
            label="Nhóm trò chuyện"
            sx={{
              color: "black",
              "&.Mui-selected": {
                fontWeight: "bold",
              },
            }}
          />
          <Tab
            label="Bạn bè"
            sx={{
              color: "black",
              "&.Mui-selected": {
                fontWeight: "bold",
              },
            }}
          />
        </Tabs>
        <Box display={"flex"}>
          <Box
            flex={1}
            sx={{
              maxHeight: 300,
              overflow: "auto",
              width: selectedIds.length > 0 ? "60%" : "100%",
            }}
          >
            {filteredContacts.length > 0 ? (
              <List dense>
                {filteredContacts.map((contact) => (
                  <ListItem key={contact.id} component="div" disablePadding>
                    <ListItemButton
                      sx={{
                        height: 50,
                      }}
                      selected={selectedIds.includes(contact.id)}
                      onClick={() => handleToggle(contact.id)}
                    >
                      <Checkbox
                        checked={selectedIds.includes(contact.id)}
                        tabIndex={-1}
                        sx={{ mr: 1, border: 0 }}
                      />
                      <ListItemAvatar>
                        <Avatar src={contact.avatar} />
                      </ListItemAvatar>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: 16, color: "#081b3a" }}
                      >
                        {contact.name}
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={2}
                height={300}
              >
                <img
                  src="https://chat.zalo.me/assets/search-empty.a19dba60677c95d6539d26d2dc363e4e.png"
                  alt="Không tìm thấy"
                  style={{
                    width: 120,
                    height: 120,
                    objectFit: "cover",
                  }}
                />
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    Không tìm thấy kết quả
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Vui lòng thử lại từ khóa khác
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: selectedIds.length > 0 ? "40%" : "0",
              height: 300,
              transform:
                selectedIds.length > 0 ? "translateX(0)" : "translateX(200%)",
              transition: "transform 0.3s ease-in-out",
              position: "sticky",
              top: 0,
              overflow: "hidden",
              borderLeft: "1px solid #ddd",
            }}
          >
            <List dense sx={{ maxHeight: 300, overflow: "auto" }}>
              <Box sx={{ p: 1, borderBottom: "1px solid #ddd" }}>
                <Typography fontSize={14} fontWeight={600}>
                  Đã chọn ({selectedIds.length})
                </Typography>
              </Box>
              {selectedIds.length > 0 ? (
                filteredContacts
                  .filter((contact) => selectedIds.includes(contact.id))
                  .map((contact) => (
                    <ListItem key={contact.id} component="div" disablePadding>
                      <ListItemButton
                        sx={{
                          height: 40,
                          mt: 1,
                        }}
                        onClick={() => handleToggle(contact.id)}
                      >
                        <ListItemAvatar>
                          <Avatar src={contact.avatar} />
                        </ListItemAvatar>
                        <Typography
                          variant="body1"
                          sx={{ fontSize: 14, color: "#081b3a" }}
                        >
                          {contact.name}
                        </Typography>
                      </ListItemButton>
                    </ListItem>
                  ))
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height={200}
                >
                  <Typography variant="body2" color="text.secondary">
                    Chưa chọn liên hệ
                  </Typography>
                </Box>
              )}
            </List>
          </Box>
        </Box>

        <Box mt={2}>
          <Box
            bgcolor="#f5f5f5"
            px={2}
            py={1}
            borderRadius={1}
            fontSize={16}
            my={2}
          >
            <Typography
              sx={{ color: "#081b3a", fontSize: 14, fontWeight: "600" }}
            >
              Chia sẻ tin nhắn
            </Typography>
            <div
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: "50px",
                overflowY: "auto",
              }}
            >
              {messageToShare}
            </div>
          </Box>

          <TextField
            fullWidth
            placeholder="Nhập tin nhắn..."
            multiline
            rows={1}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Box>
      </DialogContent>
      <Divider />

      <DialogActions sx={{ px: 2, py: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            background: "#d5d9e2",
            color: "black",
            fontSize: 16,
            fontweight: "bold",
            "&:hover": {
              background: "#C6CAD2",
            },
            py: 1,
            px: 2,
            mr: 1,
          }}
        >
          Huỷ
        </Button>
        <Button
          onClick={handleShare}
          disabled={selectedIds.length === 0}
          variant="contained"
          sx={{
            background: "#005AE0",
            color: "#fff",
            fontSize: 16,
            py: 1,
            px: 2,
          }}
        >
          Chia sẻ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
