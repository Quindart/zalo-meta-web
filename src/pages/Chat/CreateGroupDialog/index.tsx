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
  Box,
  ListItemButton,
  IconButton,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

type Contact = {
  id: string;
  name: string;
  avatar: string;
  phone: string;
};

const mockContacts: Contact[] = [
  { id: "1", name: "Lê Minh Quang", phone: "0364835692", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: "2", name: "Kiệt", phone: "0912345678", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: "3", name: "Tân", phone: "0987654321", avatar: "https://i.pravatar.cc/40?img=3" },
  { id: "4", name: "Nguyễn Chương", phone: "0977888999", avatar: "https://i.pravatar.cc/40?img=4" },
  { id: "5", name: "Vũ Quốc Huy", phone: "0909123456", avatar: "https://i.pravatar.cc/40?img=5" },
];

const CreateGroupDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [foundUser, setFoundUser] = useState<Contact | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Hàm tìm kiếm theo tên
  const searchByName = (query: string, contacts: Contact[]) => {
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Hàm tìm kiếm theo số điện thoại
  const searchByPhone = (query: string, contacts: Contact[]) => {
    const formattedQuery = query.replace(/\D/g, "");
    return contacts.find((contact) => contact.phone.replace(/\D/g, "") === formattedQuery) || null;
  };

  // Kiểm tra xem giá trị nhập vào có phải là số hay không
  const isNumeric = (value: string) => /^\d+$/.test(value);

  // Kiểm tra số điện thoại đúng định dạng 10 chữ số
  const isValidPhone = (value: string) => /^\d{10}$/.test(value);

  // Xử lý tìm kiếm
  const handleSearch = (value: string) => {
    setSearch(value);

    // Kiểm tra nếu người dùng nhập vào số điện thoại hợp lệ (10 chữ số)
    if (isNumeric(value) && isValidPhone(value)) {
      const user = searchByPhone(value, mockContacts);
      setFoundUser(user);
    } else {
      setFoundUser(null);
    }
  };

  // Danh sách liên hệ: chỉ lọc khi tìm kiếm bằng tên
  const filteredContacts = search && !isNumeric(search)
    ? searchByName(search, mockContacts)
    : mockContacts;

  // Xử lý khi bấm vào user trong hộp nổi để chọn
  const handleSelectFoundUser = () => {
    if (foundUser) {
      handleToggle(foundUser.id);
      setSearch(""); // Xóa ô tìm kiếm
      setFoundUser(null); // Ẩn hộp nổi
    }
  };

  // Xử lý toggle cho người dùng đã chọn
  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Hàm xử lý khi bấm Hủy hoặc X (hiển thị thông báo xác nhận)
  const handleCloseAttempt = () => {
    if (selectedIds.length === 0 && groupName.trim() === "") {
      handleConfirmClose();
    } else {
      setShowConfirmDialog(true);
    }
  };

  // Hàm đóng thông báo xác nhận mà không thoát Dialog
  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
  };

  // Hàm đóng cả thông báo và Dialog
  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    setGroupName("");
    setSearch("");
    setSelectedIds([]);
    setFoundUser(null);
    onClose(); // Đóng dialog
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      PaperProps={{
        sx: {
            minWidth: "700px",
            minHeight: "90vh",
            maxHeight: "90vh",
            position: "relative", // cần cho việc căn giữa alert
        },
    }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", p: 1.5 }}>
        <Typography fontWeight={600} fontSize={17}>Tạo nhóm</Typography>
        <IconButton onClick={handleCloseAttempt} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ px: 2, pt: 1 }}>
        {/* Nhập tên nhóm */}
        <TextField
          fullWidth
          placeholder="Nhập tên nhóm..."
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          size="medium"
          variant="standard" 
          sx={{
            mt:2,
            mb: 2,
            "& .MuiInputBase-root": {
                height: 40, // Matches the height in the image
                fontSize: 20, // Font size for the input text
            },
            "& .MuiInputLabel-root": {
                fontSize: 18, // Font size for the label
                transform: "translate(12px, 10px) scale(1)", // Adjust label position
            },
            "& .MuiInputLabel-shrink": {
                transform: "translate(12px, -6px) scale(0.75)", // Label position when shrunk
            },
            "& .MuiInputBase-input": {
                paddingLeft: 1.5, // Matches the padding (pl: 1.5)
            },
            "& .MuiInput-underline:before": {
                borderBottom: "1px solid rgba(0, 0, 0, 0.42)", // Default underline
            },
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                borderBottom: "2px solid #1976d2", // Hover effect (blue underline)
            },
            "& .MuiInput-underline:after": {
                borderBottom: "2px solid #1976d2", // Focused underline (blue)
            },
        }}
        />
        <Box sx={{ position: "relative" }}>
          {/* Tìm kiếm */}
          <TextField
            fullWidth
            placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton onClick={() => { setSearch(""); setFoundUser(null); }} size="small">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx:{height: 42}
            }}
            sx={{ mb: 2 }}
          />

          {/* Hộp nổi hiển thị kết quả tìm kiếm số điện thoại */}
          {foundUser && (
            <Box
              sx={{
                position: "absolute",
                top: "100%", // Hiển thị ngay dưới ô tìm kiếm
                left: 0,
                right: 0,
                zIndex: 10,
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: 1,
                boxShadow: 2,
                maxHeight: 250, // Giới hạn chiều cao hộp nổi nếu có quá nhiều kết quả
                overflowY: "auto", // Thêm cuộn dọc nếu danh sách quá dài
                mt: -1, // Khoảng cách nhỏ dưới ô tìm kiếm
              }}
            >
              <ListItem
                disablePadding
                sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
              >
                <ListItemButton onClick={handleSelectFoundUser}>
                  <Checkbox
                    checked={selectedIds.includes(foundUser.id)}
                    tabIndex={-1}
                    sx={{ mr: 1 }}
                  />
                  <ListItemAvatar>
                    <Avatar src={foundUser.avatar} />
                  </ListItemAvatar>
                  <Box>
                    <Typography>{foundUser.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {foundUser.phone}
                    </Typography>
                  </Box>
                </ListItemButton>
              </ListItem>
            </Box>
          )}


        </Box>


        {/* Danh sách người dùng */}
        <Box display="flex">
          <Box flex={1}>
            <Typography fontWeight={500} mb={1}>Trò chuyện gần đây</Typography>
            <List dense>
              {filteredContacts.map((c) => (
                <ListItem key={c.id} disablePadding>
                  <ListItemButton onClick={() => handleToggle(c.id)}>
                    <Checkbox
                      checked={selectedIds.includes(c.id)}
                      tabIndex={-1}
                      sx={{ mr: 1 }}
                    />
                    <ListItemAvatar>
                      <Avatar src={c.avatar} />
                    </ListItemAvatar>
                    <Typography>{c.name}</Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Hiển thị các liên hệ đã chọn */}
          <Box
            sx={{
              width: selectedIds.length > 0 ? "40%" : 0,
              transition: "all 0.3s ease",
              overflow: "hidden",
              pl: 2,
            }}
          >
            <List dense sx={{ maxHeight: 300, overflow: "auto", border: "1px solid #eee", borderRadius: 1 }}>
              <Box sx={{ p: 1, borderBottom: "1px solid #ddd", backgroundColor: "#fafafa" }}>
                <Typography fontSize={14} fontWeight={600}>
                  Đã chọn ({selectedIds.length}/100)
                </Typography>
              </Box>
              {selectedIds.length > 0 ? (
                selectedIds.map((id) => {
                  const contact = mockContacts.find((c) => c.id === id);
                  return contact && (
                    <ListItem key={contact.id} component="div" disablePadding>
                      <ListItemButton onClick={() => handleToggle(contact.id)}>
                        <ListItemAvatar>
                          <Avatar src={contact.avatar} />
                        </ListItemAvatar>
                        <Typography variant="body1" sx={{ fontSize: 14, color: "#081b3a" }}>
                          {contact.name}
                        </Typography>
                      </ListItemButton>
                    </ListItem>
                  );
                })
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height={200}>
                  <Typography variant="body2" color="text.secondary">Chưa chọn liên hệ</Typography>
                </Box>
              )}
            </List>
          </Box>
        </Box>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ px: 2, py: 1 }}>
        <Button
          onClick={handleCloseAttempt}
          sx={{
            background: "#d5d9e2",
            color: "black",
            fontSize: 16,
            fontWeight: "bold",
            "&:hover": { background: "#C6CAD2" },
            py: 1,
            px: 2,
            mr: 1,
          }}
        >
          Huỷ
        </Button>
        <Button
          variant="contained"
          disabled={!groupName.trim() || selectedIds.length === 0}
          sx={{
            background: "#005AE0",
            color: "#fff",
            fontSize: 16,
            py: 1,
            px: 2,
            "&:hover": { background: "#0041C3" },
          }}
        >
          Tạo nhóm
        </Button>
      </DialogActions>




      {/* Thông báo xác nhận giống ảnh */}
      <Dialog
        open={showConfirmDialog}
        onClose={handleCancelConfirm}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 300,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", p: 1.5 }}>
          <Typography fontWeight={600} fontSize={17}>Xác nhận</Typography>
          <IconButton onClick={handleCancelConfirm} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 2, py: 2 }}>
          <Typography variant="body1" sx={{ fontSize: 16 }}>
            Bạn muốn hủy tạo nhóm này?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1 }}>
          <Button
            onClick={handleCancelConfirm}
            sx={{
              background: "#d5d9e2",
              color: "black",
              fontSize: 16,
              fontWeight: "bold",
              "&:hover": {
                background: "#C6CAD2",
              },
              py: 1,
              px: 2,
              mr: 1,
            }}
          >
            Không
          </Button>
          <Button
            onClick={handleConfirmClose}
            variant="contained"
            sx={{
              background: "#005AE0",
              color: "#fff",
              fontSize: 16,
              py: 1,
              px: 2,
              "&:hover": {
                background: "#0041C3",
              },
            }}
          >
            Có
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default CreateGroupDialog;
