import { useState, useEffect } from "react";
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
import { useFriend } from "@/hook/api/useFriend";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useChatContext } from "@/Context/ChatContextType";
import { useNavigate } from "react-router-dom";

type Contact = {
  id: string;
  name: string;
  avatar: string;
  phone: string;
};

const AddMember = ({
  open,
  onClose,
  users,
}: {
  open: boolean;
  onClose: () => void;
  users: Contact[];
}) => {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [foundUser, setFoundUser] = useState<Contact | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  const { listFriends, getListFriends } = useFriend(me.id);
  const { channel, addMember } = useChatContext();
  const navigate = useNavigate();

  useEffect(() => {
    getListFriends();
  }, []);

  const mockContacts = listFriends.filter(
    (friend) => !users.some((user) => user.id === friend.id)
  ).map((friend) => ({
    id: friend.id,
    name: friend.name,
    avatar: friend.avatar,
    phone: friend.phone,
  }));

  const handleAddMember = async () => {
    try {
      // Duyệt qua từng thành viên trong selectedIds và thêm vào nhóm
      for (const userid of selectedIds) {
        await addMember(channel.id, userid); // Chờ từng thành viên được thêm vào
        // Cập nhật UI ngay lập tức sau khi thêm mỗi thành viên
        setSelectedIds((prev) => [...prev, userid]);
      }
      // Sau khi tất cả thành viên đã được thêm, đóng dialog

      handleConfirmClose();
      navigate(`/chats/0000`)
    } catch (error) {
      console.error("Error adding members:", error);
    }
  };


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
        <Typography fontWeight={600} fontSize={17}>Thêm thành viên</Typography>
        <IconButton onClick={handleCloseAttempt} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ px: 2, pt: 1 }}>
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
              sx: { height: 42, borderRadius: 6 }
            }}
            sx={{ mb: 2, borderRadius: 4 }}
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
          onClick={handleAddMember}
          variant="contained"
          disabled={selectedIds.length === 0}
          sx={{
            background: "#005AE0",
            color: "#fff",
            fontSize: 16,
            py: 1,
            px: 2,
            "&:hover": { background: "#0041C3" },
          }}
        >
          Xác nhận
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
            Bạn muốn dừng thêm các thành viên vào nhóm?
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
            Tiếp tục
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
            Dừng
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default AddMember;
