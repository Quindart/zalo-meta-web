import { getHourAndMinute } from "@/utils/formatTime";
import { MoreHoriz } from "@mui/icons-material";
import { Avatar, Box, IconButton, Popover, Typography } from "@mui/material";
import { useState } from "react";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ReplyIcon from "@mui/icons-material/Reply";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShareDialog from "./ShareDialog";
import FileCard from "../FileCard";
import {
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { useChatContext } from "@/Context/ChatContextType";

type MessPropsType = {
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  channelId: string;
  status: string;
  timestamp: string;
  emojis: string[];
  isMe: boolean;
  fileUrl?: string;
  fileName?: string;
  id?: string;
};
function MessageChat(props: Partial<MessPropsType>) {
  const { deleteMessage, recallMessage } = useChatContext();
  const [openShare, setOpenShare] = useState(false);
  const { content, sender, timestamp, emojis, isMe = true, id } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [emoList, setEmolist] = useState<Record<string, number>>({
    "😂": 0,
    "😍": 0,
    "👍": 0,
    "🔥": 0,
    "🎉": 0,
  });
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };
  let parsedContent = null;
  let isFile = false;
  let isImage = false;

  if (content) {
    try {
      const parsed = JSON.parse(content);
      if (parsed?.type === "file") {
        parsedContent = parsed;
        isFile = true;
      } else if (parsed?.type === "image") {
        parsedContent = parsed;
        isImage = true;
      }
    } catch {
      // không phải JSON, giữ nguyên là text
    }
  }
  const open = Boolean(anchorEl);
  return (
    <Box display={"flex"} gap={1} alignSelf={isMe ? "flex-end" : "flex-start"}>
      {!isMe && (
        <Box>
          <Avatar src={sender?.avatar} />
        </Box>
      )}
      <Box
        display="flex"
        flexDirection="column"
        gap={1}
        maxWidth={500}
        px={2}
        py={1}
        borderRadius={2}
        border={"1px"}
        borderColor={"grey.400"}
        alignSelf={isMe ? "flex-end" : "flex-start"}
        bgcolor={isMe ? "#DBEBFF" : "grey.50"}
        sx={{
          "&:hover": {
            boxShadow: "2px 2px 2px  #E8F3FF",
            transition: "all 0.2s ease-in",
            ".emoji-btn": {
              opacity: 1,
            },
            ".more-btn": {
              opacity: 1,
            },
          },
          position: "relative",
        }}
      >
        {isFile ? (
          <FileCard
            name={parsedContent.name}
            size={parsedContent.size}
            extension={parsedContent.extension}
          />
        ) : isImage ? (
          <Box
            component="img"
            src={parsedContent.url}
            alt={parsedContent.name || "image"}
            sx={{
              width: 220,
              borderRadius: 2,
              objectFit: "cover",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                opacity: 0.9,
              },
            }}
          />
        ) : (
          <Typography fontSize={15}>{content}</Typography>
        )}
        <Typography fontSize={14} color="grey.600" mb={1}>
          {getHourAndMinute(`${timestamp}`)}
        </Typography>
        <IconButton
          size="small"
          className="emoji-btn"
          onClick={handleOpen}
          sx={{
            position: "absolute",
            right: -4,
            opacity: 0,
            bottom: -12,
            transition: "opacity 0.2s ease-in",
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#f7f7f7",
            },
          }}
        >
          <ThumbUpOffAltIcon fontSize="small" />
        </IconButton>

        <Box
          className="more-btn"
          sx={{
            position: "absolute",
            [isMe ? "left" : "right"]: -36, // điều chỉnh khoảng cách từ khung tin nhắn ra ngoài
            top: "30%",
            transform: isMe ? "translateX(-60%)" : "translateX(60%)",
            opacity: 0,
            transition: "opacity 0.2s ease-in",
          }}
        >
          <Tooltip title="chia sẻ">
            <IconButton
              size="small"
              onClick={() => setOpenShare(true)}
              sx={{
                marginRight: 1,
                backgroundColor: "#fff",
                "&:hover": {
                  backgroundColor: "#f7f7f7",
                },
              }}
            >
              <ReplyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <>
            {isMe && (
              <Tooltip title="Thêm">
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{
                    backgroundColor: "#fff",
                    "&:hover": {
                      backgroundColor: "#f7f7f7",
                    },
                  }}
                >
                  <MoreHoriz fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </>
        </Box>

        {/* Popup chứa danh sách emoji */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Box px={"4px"} py={"2px"} display="flex" gap={"4px"}>
            {["😂", "😍", "👍", "🔥", "🎉"].map((emoji) => (
              <Typography
                key={emoji}
                fontSize={14}
                sx={{
                  cursor: "pointer",
                  "&:hover": { transform: "scale(1.2)" },
                }}
                onClick={() => {
                  const index = emoList[`${emoji}`];
                  emoList[index] += 1;
                  setEmolist(emoList);
                  handleClose();
                }}
              >
                {emoji}
              </Typography>
            ))}
          </Box>
        </Popover>
        <Typography
          position={"absolute"}
          px={1}
          borderRadius={4}
          bgcolor={"white"}
          right={0}
          fontSize={12}
          color="initial"
          boxShadow={"1px 1px 1px 1pxrgb(192, 193, 194)"}
        >
          {emojis}
        </Typography>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: isMe ? "right" : "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: isMe ? "right" : "left",
          }}
        >
          <MenuItem
            onClick={() => {
              deleteMessage(id as string);
              handleMenuClose();
            }}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <SettingsBackupRestoreIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Thu hồi</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              recallMessage(id as string);
              handleMenuClose();
            }}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <DeleteOutlineIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Xoá chỉ ở phía tôi</ListItemText>
          </MenuItem>
        </Menu>

        <ShareDialog
          open={openShare}
          onClose={() => setOpenShare(false)}
          messageToShare={content ?? ""}
        />
      </Box>{" "}
    </Box>
  );
}

export default MessageChat;
