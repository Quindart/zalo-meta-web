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
  Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
type Contact = {
  id: string;
  name: string;
  avatar: string;
};

type ShareDialogProps = {
  open: boolean;
  onClose: () => void;
  messageToShare: string;
};

const fakeContacts: Contact[] = [
  { id: "1", name: "Cloud của tôi", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: "2", name: "Nhóm 11 🌸 Công Nghệ Mới", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: "3", name: "Lê Minh Quang", avatar: "https://i.pravatar.cc/40?img=3" },
  { id: "4", name: "Làm đồ án vui vui", avatar: "https://i.pravatar.cc/40?img=4" },
];

const ShareDialog: React.FC<ShareDialogProps> = ({ open, onClose, messageToShare }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [note, setNote] = useState("");
  const [tab, setTab] = useState(0);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleShare = () => {
    console.log("Chia sẻ với:", selectedIds);
    console.log("Nội dung ghi chú:", note);
    onClose();
  };

  const filteredContacts = fakeContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm"  fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{fontWeight: "600", fontSize: 20}}>
            Chia sẻ
        </Typography>
        <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="large" />
        </IconButton>
        </DialogTitle>
        <Divider/>
      <DialogContent>
      <TextField
        fullWidth
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="medium"
        sx={{ mb: 2 }}
        InputProps={{
            startAdornment: (
            <InputAdornment position="start">
                <SearchIcon fontSize="small" />
            </InputAdornment>
            ),
            sx: {
                height: 50, // tăng chiều cao input
                fontSize: 16, // tăng font chữ
                pl: 1.5, // padding trái bên trong ô
            },
        }}
            inputProps={{
                style: {
                fontSize: 16, // font chữ trong input
                padding: "10px 0", // padding trên dưới
                },
            }}
        />


        <Tabs 
            value={tab} 
            onChange={(e, val) => setTab(val)} 
            sx={{ mb: 1 }} 
            TabIndicatorProps={{
                style: {
                height: 3, // độ dày
                },
            }}
        >
            <Tab
                label="Gần đây"
                sx={{
                color: "black", // màu mặc định
                "&.Mui-selected": {
                    fontWeight: "bold"
                }
                }}
            />
            <Tab
                label="Nhóm trò chuyện"
                sx={{
                color: "black",
                "&.Mui-selected": {
                    fontWeight: "bold"
                }
                }}
            />
            <Tab
                label="Bạn bè"
                sx={{
                color: "black",
                "&.Mui-selected": {
                    fontWeight: "bold"
                }
                }}
            />
        </Tabs>
        <Divider sx={{mt:-1}}/>


        {filteredContacts.length > 0 ? (
        <List dense sx={{ maxHeight: 150, overflow: "auto" }}>
            {filteredContacts.map((contact) => (
            <ListItem key={contact.id} component="div" disablePadding>
                <ListItemButton
                selected={selectedIds.includes(contact.id)}
                onClick={() => handleToggle(contact.id)}
                >
                <Checkbox
                    checked={selectedIds.includes(contact.id)}
                    tabIndex={-1}
                    sx={{ mr: 1 }}
                />
                <ListItemAvatar>
                    <Avatar src={contact.avatar} />
                </ListItemAvatar>
                <Typography variant="body1" sx={{ fontSize: 17 }}>
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
            height={150}
            mt={2}
        >
            <img
            src="https://chat.zalo.me/assets/search-empty.a19dba60677c95d6539d26d2dc363e4e.png"
            alt="Không tìm thấy"
            style={{ width: 120, height: 120, marginBottom: 8 }}
            />
            <Typography variant="body1" fontWeight={600}>
            Không tìm thấy kết quả
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Vui lòng thử lại từ khóa khác
            </Typography>
        </Box>
        )}


        <Box mt={2}>
          <Box
            bgcolor="#f5f5f5"
            px={2}
            py={1}
            borderRadius={1}
            fontSize={16}
            mb={1}
          >
            <Typography sx={{fontWeight:"600"}}>Chia sẻ tin nhắn</Typography>
            <div
                style={{
                    whiteSpace: 'pre-wrap',       // Cho phép xuống dòng khi cần (kể cả "\n")
                    wordBreak: 'break-word',      // Ngắt từ khi quá dài
                    maxHeight: '50px',           // Giới hạn chiều cao (tuỳ chỉnh theo nhu cầu)
                    overflowY: 'auto',            // Hiện thanh cuộn khi nội dung vượt quá
                }}
                >
                {messageToShare}
            </div>
          </Box>

          <TextField
            fullWidth
            placeholder="Nhập tin nhắn..."
            multiline
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Box>
      </DialogContent>
      <Divider/>

      <DialogActions>
        <Button 
            onClick={onClose} 
            sx={{
                background: "#d5d9e2",
                color: "#000",
                fontWeight: "600",
                fontSize: 18,
                "&:hover":{
                    background: "#C6CAD2",
                },
                py: 1.5,
                px: 3,
                mr:1

            }}
        >
            Huỷ
        </Button>
        <Button
          onClick={handleShare}
          disabled={selectedIds.length === 0}
          variant="contained"
          sx={{
            background: "#0190F3",
            color: "#fff",
            fontWeight: "600",
            fontSize: 18,
            py: 1.5,
            px: 3

        }}
        >
          Chia sẻ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
