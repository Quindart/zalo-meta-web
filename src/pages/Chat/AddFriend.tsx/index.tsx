import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Avatar,
  ListItemText,
  Typography,
  Box,
  Fade,
  IconButton,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import axios from "axios";
import InfoDialog from "@/pages/ChatDetail/MainChat/InfoUser/InfoDialog";
import { useFriend } from "@/hook/api/useFriend";
import useAuth from "@/hook/api/useAuth";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const AddFriendDialog = ({ open, onClose }: Props) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [recentResults, setRecentResults] = useState<User[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { me } = useAuth();
  const { sendFriends, getSendFriends, inviteFriend } = useFriend(me.id);
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSearch = async () => {
    const cleanPhone = phone.replace(/\s+/g, "");

    if (!/^\d{10}$/.test(cleanPhone)) {
      setErrorMessage("Số điện thoại không đúng định dạng (10 chữ số)");
      setError(true);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/users/search",
        {
          params: {
            type: "phone",
            keywords: cleanPhone,
          },
        },
      );

      const data = response.data;

      if (data.success && data.users.length > 0) {
        const user = data.users[0];

        setRecentResults((prev) => [
          user,
          ...prev.filter((u) => u.phone !== user.phone),
        ]);
        setError(false);
        setErrorMessage("");
        setSelectedUser(user);
        setOpenInfoDialog(true);
      }
    } catch (error) {
      console.error("Lỗi khi tìm người dùng:", error);
      setError(true);
      setErrorMessage(
        "Số điện thoại này không đăng ký tài khoản hoặc không cho phép tìm kiếm",
      );
    }
  };
  const handleClose = () => {
    setPhone("");
    setError(false);
    onClose();
  };
  const handleRemoveUser = (phone: string) => {
    setRecentResults((prevResults) =>
      prevResults.filter((user) => user.phone !== phone),
    );
  };

  const handleInviteFriend = async (userFriendId: string) => {
    inviteFriend(userFriendId);
    getSendFriends();
  };

  const handleAcceptFriend = async (userId: string) => { };
  return (
    <Box sx={{ position: "relative" }}>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        PaperProps={{
          sx: {
            width: "540px",
            minHeight: "75vh",
            maxHeight: "90vh",
            position: "relative",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: "6px 10px 6px 16px !important",
          }}
        >
          <Typography
            sx={{ fontWeight: "600", fontSize: 17, color: "#081b3a" }}
          >
            Thêm bạn
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="large" />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent
          sx={{
            paddingY: 0,
            maxHeight: "60vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TextField
            fullWidth
            label="Số điện thoại"
            value={phone}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              setPhone(numericValue);
            }}
            margin="normal"
            placeholder="Nhập số điện thoại"
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 10,
            }}
            size="medium"
            sx={{
              mb: 0,
              "& .MuiInputBase-root": {
                height: 30,
                fontSize: 18,
              },
              "& .MuiInputLabel-root": {
                fontSize: 18,
                transform: "translate(12px, 10px) scale(1)",
              },
              "& .MuiInputLabel-shrink": {
                transform: "translate(12px, -6px) scale(0.75)",
              },
              "& .MuiInputBase-input": {
                paddingLeft: 1.5,
              },
              "& .MuiInput-underline:before": {
                borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
              },
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                borderBottom: "2px solid #1976d2",
              },
              "& .MuiInput-underline:after": {
                borderBottom: "2px solid #1976d2",
              },
            }}
            variant="standard"
          />

          {recentResults.length > 0 && (
            <>
              <Typography
                variant="subtitle2"
                mt={5}
                sx={{ color: grey[700], fontSize: 16 }}
              >
                Kết quả gần nhất
              </Typography>
              <Box
                sx={{
                  overflowY: "auto",
                  mt: 1,
                  ml: -2,
                  flex: 1,
                }}
              >
                <List>
                  {recentResults.map((user, idx) => (
                    <ListItem
                      key={idx}
                      disablePadding
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      secondaryAction={
                        <Box>
                          <Button
                            onClick={() => {
                              handleInviteFriend(user._id);
                              console.log(user._id);
                              alert(user._id);
                            }}
                            sx={{
                              borderColor: "#005AE0",
                              border: 1,
                              mr: 1,
                            }}
                          >
                            Kết bạn
                          </Button>
                          {isHovered && (
                            <IconButton
                              onClick={() => handleRemoveUser(user.phone)}
                              size="small"
                            >
                              <CloseIcon fontSize="medium" />
                            </IconButton>
                          )}
                        </Box>
                      }
                    >
                      <ListItemButton
                        onClick={() => {
                          setSelectedUser(user);
                          setOpenInfoDialog(true);
                        }}
                      >
                        <ListItemAvatar
                          sx={{
                            "& .MuiAvatar-root": {
                              width: 50,
                              height: 50,
                            },
                            mr: 1,
                          }}
                        >
                          <Avatar src={user.avatar} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${user.firstName} ${user.lastName}`}
                          secondary={`(+84) ${user.phone}`}
                          primaryTypographyProps={{ fontSize: 20 }}
                          secondaryTypographyProps={{ fontSize: 16 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 2, py: 1 }}>
          <Button
            onClick={handleClose}
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
            Hủy
          </Button>
          <Button
            onClick={handleSearch}
            variant="contained"
            sx={{
              background: "#005AE0",
              color: "#fff",
              fontSize: 16,
              py: 1,
              px: 2,
            }}
          >
            Tìm kiếm
          </Button>
        </DialogActions>

        {/* THÔNG BÁO TRUNG TÂM DIALOG */}
        <Fade in={error}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#2b2b2b",
              color: "#fff",
              px: 3,
              py: 2,
              borderRadius: 2,
              boxShadow: 4,
              zIndex: 10,
              textAlign: "center",
            }}
          >
            {errorMessage}
          </Box>
        </Fade>
      </Dialog>
      {selectedUser && (
        <InfoDialog
          open={openInfoDialog}
          onClose={() => setOpenInfoDialog(false)}
          user={selectedUser}
          parentClose={handleClose} // Pass the parent dialog close handler
        />
      )}
    </Box>
  );
};

export default AddFriendDialog;
