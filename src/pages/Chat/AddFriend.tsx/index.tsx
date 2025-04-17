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
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import InfoDialog from "@/pages/ChatDetail/MainChat/InfoUser/InfoDialog";
import { useFriend } from "@/hook/api/useFriend";
import useAuth from "@/hook/api/useAuth";
import { useSnackbar } from "notistack";
import axiosConfig from "@/services/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useChat } from "@/hook/api/useChat";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatar: string;
  isFriend: boolean;
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
  const { inviteFriend } = useFriend(me.id);

  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSearch = async () => {
    const cleanPhone = phone?.replace(/\s+/g, "");

    if (!/^\d{10}$/.test(cleanPhone)) {
      handleError("Số điện thoại không đúng định dạng (10 chữ số)");
      return;
    }
    try {
      const response = await axiosConfig.get("/api/v1/users/search-friends", {
        params: {
          type: "phone",
          keywords: cleanPhone,
        },
      });
      const data: any = response;

      if (data?.totalItems === 0) {
        handleError("Không có người dùng hợp lệ để kết bạn");
      }
      if (data?.success === false) {
        handleError("Tìm kiếm người dùng thất bại, vui lòng thử lại");
      }

      if (data.totalItems > 0) {
        const user = data.users[0];
        setRecentResults((prev) => [
          user,
          ...prev.filter((u) => u.phone !== user?.phone),
        ]);
        setError(false);
        setErrorMessage("");
        setSelectedUser(user);
        setOpenInfoDialog(true);
      }
    } catch (error: any) {
      console.log("💲💲💲 ~ handleSearch ~ error:", error);
      handleError(
        "Số điện thoại này không đăng ký tài khoản hoặc không cho phép tìm kiếm",
      );
    }
  };
  const handleError = (mess: string) => {
    setError(true);
    setErrorMessage(`${mess}`);
  };
  const handleClose = () => {
    setPhone("");
    setError(false);
    onClose();
  };

  const handleRemoveUser = (phone: string) => {
    setRecentResults((prevResults) =>
      prevResults.filter((user) => user?.phone !== phone),
    );
  };

  const handleInviteFriend = async (userFriendId: string) => {
    inviteFriend(userFriendId);
    enqueueSnackbar({ variant: "success", message: "Đã gửi lời mời kết bạn" });
  };

  const handleAcceptFriend = async (userId: string) => { };
  //! Navigate to chat
  const navigate = useNavigate();
  const { findOrCreateChat, channel } = useChat(me.id);
  const [shouldNavigate, setShouldNavigate] = useState<string | null>(null);
  useEffect(() => {
    if (channel && shouldNavigate === channel.id) {
      navigate(`/chats/${channel.id}`);
      setShouldNavigate(null);
      handleClose();
    }
  }, [channel, navigate, shouldNavigate]);

  const handleFindChat = (receiverId: string) => {
    findOrCreateChat(receiverId);
    setShouldNavigate(null);
  };

  useEffect(() => {
    if (channel) {
      setShouldNavigate(channel.id);
    }
  }, [channel]);

  return (
    <Box sx={{ position: "relative" }}>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        PaperProps={{
          sx: {
            width: "400px",
            minHeight: "70vh",
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
            p: "6px 4px 6px 16px !important",
          }}
        >
          <Typography
            sx={{ fontWeight: "600", fontSize: 16, color: "#081b3a" }}
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
            py: 0,
            px: 2,
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
            size="small"
            sx={{
              mb: 0,
              "& .MuiInputBase-root": {
                height: 26,
                fontSize: 16,
              },
              "& .MuiInputLabel-root": {
                fontSize: 16,
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
          {recentResults.length === 0 && (
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                my: 20,
                flexDirection: "column",
              }}
            >
              <GroupAddIcon sx={{ mb: 2, fontSize: 40, color: "grey.400" }} />
              <Typography mx="auto" my="auto" variant="body1" color="grey.500">
                Thật trống trải, kết bạn ngay
              </Typography>
            </Box>
          )}
          {recentResults.length > 0 && (
            <>
              <Typography
                variant="subtitle2"
                mt={5}
                sx={{ color: grey[700], fontSize: 14 }}
              >
                Kết quả gần nhất
              </Typography>
              <Box
                sx={{
                  overflowY: "auto",
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
                          {user?.isFriend && (
                            <Button
                              onClick={() => {
                                handleFindChat(user?._id);
                              }}
                              sx={{
                                borderColor: "#005AE0",
                                border: 1,
                                borderRadius: 8,
                                mr: 1,
                                p: 0,
                              }}
                            >
                              Nhắn tin
                            </Button>
                          )}
                          {!user?.isFriend && (
                            <Button
                              onClick={() => {
                                handleInviteFriend(user?._id);
                              }}
                              sx={{
                                borderColor: "#005AE0",
                                border: 1,
                                borderRadius: 8,
                                mr: 1,
                                p: 0,
                              }}
                            >
                              Kết bạn
                            </Button>
                          )}
                          {isHovered && (
                            <IconButton
                              onClick={() => handleRemoveUser(user?.phone)}
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
                              width: 40,
                              height: 40,
                            },
                            mr: 1,
                          }}
                        >
                          <Avatar src={user?.avatar} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${user?.firstName} ${user?.lastName}`}
                          secondary={`(+84) ${user?.phone
                            ?.split("")
                            .map((c: string, i: number) =>
                              i === 4 || i === 7 ? ` ${c}` : c,
                            )
                            .join("")}`}
                          primaryTypographyProps={{ fontSize: 16 }}
                          secondaryTypographyProps={{ fontSize: 13 }}
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

        <Fade in={error}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#2b2b2b",
              color: "#fff",
              width: "80%",
              py: 2,
              px: 1,
              borderRadius: 2,
              boxShadow: 4,
              zIndex: 10,
              fontSize: 14,
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
