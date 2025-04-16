import { useState, useRef } from "react";
import {
  TextField,
  IconButton,
  Box,
  Divider,
  Popover,
  ToggleButtonGroup,
  ToggleButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import {
  InsertEmoticon,
  Image,
  Link,
  CropSquare,
  Send,
  ThumbUp,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
} from "@mui/icons-material";
import ContactPage from "@mui/icons-material/ContactPage";
import DrawIcon from "@mui/icons-material/Draw";
import BoltIcon from "@mui/icons-material/Bolt";
import { useSnackbar } from "notistack";

const ChatInput = ({
  channelId,
  sendMessage,
  uploadFile,
}: {
  channelId: any;
  sendMessage: (channelId: string, message: string) => void;
  uploadFile: (channelId: string, file: File) => void;
}) => {
  const format: string[] = [];
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  // State cho Popover và file
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmitMessage = () => {
    if (channelId) {
      if (message.trim()) {
        sendMessage(channelId, message);
        setMessage("");
      } else {
        enqueueSnackbar({
          variant: "error",
          message: "Vui lòng nhập tin nhắn hoặc chọn file",
        });
      }
    } else {
      enqueueSnackbar({
        variant: "error",
        message: "Vui lòng nhập ID người nhận",
      });
    }
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar({
          variant: "error",
          message: "File quá lớn (tối đa 10MB)",
        });
        return;
      }
      uploadFile(channelId, file);
      enqueueSnackbar({
        variant: "success",
        message: `Đang gửi file: ${file.name}`,
      });
      setMessage("");
      handleClosePopover();
      
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

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
      }}
    >
      {/* Hàng icon trên */}
      <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
        <IconButton>
          <InsertEmoticon sx={{ color: "#666" }} />
        </IconButton>
        <IconButton>
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

      {/* Popover giống menu Zalo */}
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

      {/* Input file ẩn */}
      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt" // Chỉ cho phép file văn bản
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Hộp chỉnh sửa văn bản */}
      <Popover
        open={false} // Vô hiệu hóa tạm thời để tập trung vào giao diện Zalo
        anchorEl={null}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <ToggleButtonGroup value={format} aria-label="text formatting">
            <ToggleButton value="bold">
              <FormatBold />
            </ToggleButton>
            <ToggleButton value="italic">
              <FormatItalic />
            </ToggleButton>
            <ToggleButton value="underline">
              <FormatUnderlined />
            </ToggleButton>
            <ToggleButton value="strikethrough">
              <FormatStrikethrough />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Popover>

      {/* Ô nhập tin nhắn */}
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
            <ThumbUp sx={{ color: "#00a6ed" }} /> // Màu xanh Zalo
          ) : (
            <Send sx={{ color: "#00a6ed" }} />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatInput;