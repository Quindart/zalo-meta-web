import { useState, useRef } from "react";
import {
  TextField,
  IconButton,
  Box,
  Divider,
  Popover,
  ToggleButtonGroup,
  ToggleButton,
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
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";


const ChatInput = ({
  channelId,
  sendMessage,
}: {
  channelId: any;
  sendMessage: (channelId: string, message: string) => void;
}) => {
  const format: string[] = [];
  const anchorEl = null;
  const inputRef = useRef<HTMLDivElement | null>(null);


  //TODO: phong
  const params = useParams();
  const receiverId = params.id;
  const [message, setMessage] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmitMessage = () => {
    if (receiverId && message) {
      sendMessage(channelId, message);
      setMessage("");
    } else {
      enqueueSnackbar({
        variant: "error",
        message: "Vui lòng nhập ID người nhận và nội dung tin nhắn",
      });
    }
  };


  const hiddenFileInput = useRef<HTMLInputElement | null>(null);
  const handleClickLink = () => {
    hiddenFileInput.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "default";
      const sizeInKB = (file.size / 1024).toFixed(2) + " KB";

      // 🧠 Gửi tin nhắn dạng file (ở đây chỉ ví dụ là hiển thị thông tin)
      const fileMessage = {
        type: "file",
        name: file.name.replace(/\.[^/.]+$/, ""),
        extension,
        size: sizeInKB,
      };
      setMessage(JSON.stringify(fileMessage));
      sendMessage(channelId, JSON.stringify({
        type: "file",
        name: file.name.replace(/\.[^/.]+$/, ""),
        extension,
        size: sizeInKB,
      }));

    }
  };


  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleClickImage = () => {
    imageInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const images: File[] = Array.from(files);

    // Gửi tin nhắn kiểu ảnh (ở đây demo: gửi mỗi ảnh là 1 object đơn giản, có thể mở rộng ra upload lên S3,...)
    images.forEach((image) => {
      const imageMessage = {
        type: "image",
        name: image.name,
        size: `${(image.size / 1024).toFixed(2)} KB`,
        url: URL.createObjectURL(image), // hoặc upload lên server rồi lấy URL thật
      };
      sendMessage(channelId, JSON.stringify(imageMessage));
    });
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
      }}
    >
      {/* Hàng icon trên */}
      <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
        <IconButton>
          <InsertEmoticon />
        </IconButton>
        <IconButton  onClick={handleClickImage}>
          <Image />
        </IconButton>
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          onChange={handleImageUpload}
          style={{ display: "none" }}
          multiple // nếu muốn chọn nhiều ảnh cùng lúc
        />
        <IconButton onClick={handleClickLink}>
          <Link />
        </IconButton>
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".pdf,.doc,.docx,.txt,.xlsx,.csv,.zip,.rar,.ppt,.pptx"
        />
        <IconButton>
          <ContactPage />
        </IconButton>
        <IconButton>
          <CropSquare />
        </IconButton>
        <IconButton>
          <DrawIcon />
        </IconButton>
        <IconButton>
          <BoltIcon />
        </IconButton>
      </Box>
      <Divider />

      {/* Hộp chỉnh sửa văn bản */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
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
            fontSize: 16,
            fontWeight: format.includes("bold") ? "bold" : "normal",
            fontStyle: format.includes("italic") ? "italic" : "normal",
            textDecoration: format.includes("underline")
              ? "underline"
              : format.includes("strikethrough")
                ? "line-through"
                : "none",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              backgroundColor: "white",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        />

        {/* Icon gửi hoặc like */}
        <IconButton sx={{ padding: "6px" }}>
          <InsertEmoticon />
        </IconButton>
        <IconButton onClick={handleSubmitMessage} sx={{ padding: "6px" }}>
          {message.trim() === "" ? (
            <ThumbUp sx={{ color: "#F8D171" }} />
          ) : (
            <Send sx={{ color: "blue" }} />
          )}
        </IconButton>
      </Box>
    </Box>
  );
}

export default ChatInput;