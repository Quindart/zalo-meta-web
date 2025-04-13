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
import { useChat } from "@/hook/api/useChat";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function ChatInput({ channelId }: { channelId: any }) {
  const format: string[] = [];
  const anchorEl = null;
  const inputRef = useRef<HTMLDivElement | null>(null);
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;

  //TODO: phong
  const params = useParams();
  const receiverId = params.id;
  const { sendMessage } = useChat(me.id);
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
        <IconButton>
          <Image />
        </IconButton>
        <IconButton>
          <Link />
        </IconButton>
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
