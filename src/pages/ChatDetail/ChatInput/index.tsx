import { useState } from "react";
import { Box, InputBase, IconButton } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ImageIcon from "@mui/icons-material/Image";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import CropFreeIcon from "@mui/icons-material/CropFree";

export default function ChatInput({onChangeInput}: any) {

  const handleSendMessage = (message:string) => {
    if (message.trim()) {
      onChangeInput(message)
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        borderTop: "1px solid #ccc",
        backgroundColor: "#fff",
      }}
    >
      {/* Icon buttons */}
      <IconButton size="small">
        <InsertEmoticonIcon />
      </IconButton>
      <IconButton size="small">
        <ImageIcon />
      </IconButton>
      <IconButton size="small">
        <AttachFileIcon />
      </IconButton>
      <IconButton size="small">
        <CropFreeIcon />
      </IconButton>
      <IconButton size="small">
        <FormatBoldIcon />
      </IconButton>
      <IconButton size="small">
        <MoreVertIcon />
      </IconButton>
      <IconButton size="small">
        <FlashOnIcon />
      </IconButton>

      {/* Input */}
      <InputBase
        sx={{
          flex: 1,
          mx: 1,
          fontSize: "14px",
          color: "#333",
        }}
        placeholder="Nhập @, tin nhắn tới Nhóm 11 Công Nghệ Mới"
        onChange={(e)=>handleSendMessage(e.target.value)}
      />

      {/* Send options */}
      <IconButton size="small">
        <InsertEmoticonIcon />
      </IconButton>
    </Box>
  );
}
