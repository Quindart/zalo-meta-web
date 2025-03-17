import { useState, useRef } from "react";
import { 
  TextField, IconButton, Box, Divider, Popover, ToggleButtonGroup, ToggleButton 
} from "@mui/material";
import { 
  InsertEmoticon, Image, Link, CropSquare, Send, ThumbUp, FormatBold, FormatItalic, FormatUnderlined, 
  FormatStrikethrough 
} from "@mui/icons-material";
import ContactPage from "@mui/icons-material/ContactPage";
import DrawIcon from "@mui/icons-material/Draw";
import BoltIcon from "@mui/icons-material/Bolt";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [format, setFormat] = useState<string[]>([]);
  const inputRef = useRef<HTMLDivElement | null>(null);

  const handleOpenFormat = () => {
    if (inputRef.current) {
      setAnchorEl(inputRef.current);
    }
  };

  const handleCloseFormat = () => {
    setAnchorEl(null);
  };

  const handleFormatChange = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setFormat(newFormats);
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexDirection: "column",
        width: "100%",
        borderTop: "1px solid #ccc", 
        padding: "8px",
        gap: 1
      }}
    >
      {/* Hàng icon trên */}
      <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
        <IconButton><InsertEmoticon /></IconButton>
        <IconButton><Image /></IconButton>
        <IconButton><Link /></IconButton>
        <IconButton><ContactPage /></IconButton>
        <IconButton><CropSquare /></IconButton>
        <IconButton onClick={handleOpenFormat}><DrawIcon /></IconButton>
        <IconButton><BoltIcon /></IconButton>
      </Box>
      <Divider/>

      {/* Hộp chỉnh sửa văn bản */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseFormat}
        anchorOrigin={{ vertical: "top", horizontal: "left" }} // Hiển thị bên dưới
        transformOrigin={{ vertical: "bottom", horizontal: "left" }} // Căn chỉnh
      >
        <Box sx={{ display: "flex", flexDirection: "column", padding: "10px", gap: 1 }}>
          <ToggleButtonGroup value={format} onChange={handleFormatChange} aria-label="text formatting">
            <ToggleButton value="bold"><FormatBold /></ToggleButton>
            <ToggleButton value="italic"><FormatItalic /></ToggleButton>
            <ToggleButton value="underline"><FormatUnderlined /></ToggleButton>
            <ToggleButton value="strikethrough"><FormatStrikethrough /></ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Popover>

      {/* Ô nhập tin nhắn */}
      <Box ref={inputRef} sx={{ display: "flex", alignItems: "center", width: "100%", gap: 1, padding: "6px 12px", borderRadius: "20px" }}>
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
            textDecoration: format.includes("underline") ? "underline" : format.includes("strikethrough") ? "line-through" : "none",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              backgroundColor: "white",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            }
          }}
        />

        {/* Icon gửi hoặc like */}
        <IconButton sx={{ padding: "6px" }}><InsertEmoticon /></IconButton>
        <IconButton sx={{ padding: "6px" }}>
          {message.trim() === "" ? <ThumbUp /> : <Send sx={{ color: "blue" }} />}
        </IconButton>
      </Box>
    </Box>
  );
}
