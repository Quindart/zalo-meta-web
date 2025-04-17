import { useState, useRef } from "react";
import {
  TextField,
  IconButton,
  Box,
  Divider,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  InsertEmoticon,
  Image,
  Link,
  CropSquare,
  Send,
  ThumbUp,
} from "@mui/icons-material";
import ContactPage from "@mui/icons-material/ContactPage";
import DrawIcon from "@mui/icons-material/Draw";
import BoltIcon from "@mui/icons-material/Bolt";
import { useSnackbar } from "notistack";

/**
 * ChatInput Component - Handles message input and file/image uploads
 */
const ChatInput = ({
  channelId,
  sendMessage,
  uploadFile,
  channel,
}: {
  channelId: string | undefined;
  sendMessage: (channelId: string, message: string) => void;
  uploadFile: (channelId: string, file: File) => void;
  channel: any;
}) => {
  // Refs for input elements
  const inputRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  
  // State management
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Handles text message submission
   */
  const handleSubmitMessage = () => {
    if (!channelId) {
      enqueueSnackbar({
        variant: "error",
        message: "Không thể gửi tin nhắn do thiếu thông tin người nhận",
      });
      return;
    }

    if (!message.trim()) {
      return; // Không hiện thông báo lỗi khi chưa nhập tin nhắn
    }

    sendMessage(channelId, message);
    setMessage("");
  };

  /**
   * Handles file selection through the dialog
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar({
        variant: "error",
        message: "File quá lớn (tối đa 5MB)",
      });
      return;
    }

    if (!channelId) {
      enqueueSnackbar({
        variant: "error",
        message: "Không thể gửi file do thiếu thông tin người nhận",
      });
      return;
    }

    uploadFile(channelId, file);
    enqueueSnackbar({
      variant: "success",
      message: `Đang gửi file: ${file.name}`,
    });
    
    handleClosePopover();

    // Reset input để có thể chọn lại cùng một file
    if (event.target) {
      event.target.value = '';
    }
  };

  /**
   * Handles image selection through the dialog
   */
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar({
        variant: "error",
        message: "Hình ảnh quá lớn (tối đa 10MB)",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      enqueueSnackbar({
        variant: "error",
        message: "Vui lòng chọn một tệp hình ảnh hợp lệ",
      });
      return;
    }

    if (!channelId) {
      enqueueSnackbar({
        variant: "error",
        message: "Không thể gửi hình ảnh do thiếu thông tin người nhận",
      });
      return;
    }

    uploadFile(channelId, file);
    enqueueSnackbar({
      variant: "success",
      message: "Đang gửi hình ảnh...",
    });

    if (event.target) {
      event.target.value = '';
    }
  };

  // Popover handlers
  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  // File/Image selection handlers
  const handleSelectFile = () => {
    fileInputRef.current?.click();
    handleClosePopover();
  };

  const handleSelectImage = () => {
    imageInputRef.current?.click();
  };

  /**
   * Renders the disabled chat input when channel is deleted
   */
  const renderDeletedChannelWarning = () => (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(245, 245, 245, 0.8)",
        borderTop: "1px solid #e0e0e0",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "#d32f2f",
          fontWeight: 500,
          fontSize: "0.875rem",
          textAlign: "center",
        }}
      >
        Nhóm đã bị giải tán
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: "#757575",
          mt: 0.5,
          fontSize: "0.75rem",
          textAlign: "center",
        }}
      >
        Không thể gửi hoặc nhận tin nhắn trong nhóm này nữa.
      </Typography>
    </Box>
  );

  /**
   * Renders the active chat input controls
   */
  const renderActiveChatInput = () => (
    <>
      {/* Toolbar with icons */}
      <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
        <IconButton>
          <InsertEmoticon sx={{ color: "#666" }} />
        </IconButton>
        <IconButton onClick={handleSelectImage}>
          <Image sx={{ color: "#666" }} />
        </IconButton>
        <IconButton onClick={handleOpenPopover}>
          <Link sx={{ color: "#666" }} />
        </IconButton>
        <IconButton>
          <ContactPage sx={{ color: "#666" }} />
        </IconButton>
        <IconButton>
          <CropSquare sx={{ color: "#666" }} />
        </IconButton>
        <IconButton>
          <DrawIcon sx={{ color: "#666" }} />
        </IconButton>
        <IconButton>
          <BoltIcon sx={{ color: "#666" }} />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: "#e0e0e0" }} />

      {/* File selection popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiPopover-paper": {
            borderRadius: "4px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "150px",
            backgroundColor: "#fff",
            padding: "8px 8px",
          },
        }}
      >
        <List sx={{ padding: "0px 0px" }}>
          <ListItem
            component="li"
            onClick={handleSelectFile}
            sx={{
              "&:hover": { backgroundColor: "#f0f2f5" },
              cursor: 'pointer',
              padding: "0px 10px",
            }}
          >
            <ListItemText
              primary="Gửi file"
              primaryTypographyProps={{ fontSize: 14, fontWeight: 500, }}
            />
          </ListItem>
        </List>
      </Popover>

      {/* Hidden file inputs */}
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      {/* Message input */}
      <Box
        ref={inputRef}
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: 1,
          borderRadius: "20px",
          backgroundColor: "#fff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          px: 1,
        }}
      >
        <TextField
          fullWidth
          placeholder="Nhập tin nhắn..."
          variant="outlined"
          size="small"
          multiline
          minRows={1}
          maxRows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmitMessage();
            }
          }}
          sx={{
            flex: 1,
            fontSize: 14,
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              backgroundColor: "transparent",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        />
        <IconButton sx={{ padding: "6px" }}>
          <InsertEmoticon sx={{ color: "#666" }} />
        </IconButton>
        <IconButton onClick={handleSubmitMessage} sx={{ padding: "6px" }}>
          {message.trim() === "" ? (
            <ThumbUp sx={{ color: "#00a6ed" }} />
          ) : (
            <Send sx={{ color: "#00a6ed" }} />
          )}
        </IconButton>
      </Box>
    </>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderTop: "1px solid #ccc",
        gap: 1,
        px: 2,
        py: 1,
        backgroundColor: "#f5f6fa",
        minHeight: 120
      }}
    >
      {channel && channel.isDeleted 
        ? renderDeletedChannelWarning() 
        : renderActiveChatInput()
      }
    </Box>
  );
};

export default ChatInput;