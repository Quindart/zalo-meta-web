import { getHourAndMinute } from "@/utils/formatTime";
import { MoreHoriz } from "@mui/icons-material";
import { Avatar, Box, IconButton, Popover, Typography } from "@mui/material";
import { useState } from "react";

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
};
function MessageChat(props: Partial<MessPropsType>) {
  const { content, sender, timestamp, emojis, isMe = true } = props;
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

  const open = Boolean(anchorEl);
  return (
    <Box display={"flex"} gap={1} alignSelf={isMe ? "flex-end" : "flex-start"}>
      {!isMe && (
        <Box>
          <Avatar src={sender?.avatar} />
        </Box>
      )}
      <Box
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
          },
          position: "relative",
        }}
      >
        <Typography fontSize={15}>{content}</Typography>
        <Typography fontSize={14} color="grey.600">
          {getHourAndMinute(`${timestamp}`)}
        </Typography>
        <IconButton
          size="small"
          className="emoji-btn"
          onClick={handleOpen}
          sx={{
            position: "absolute",
            left: -4,
            opacity: 0,
            bottom: -12,
            transition: "opacity 0.2s ease-in",
          }}
        >
          <MoreHoriz fontSize="small" />
        </IconButton>

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
      </Box>{" "}
    </Box>
  );
}

export default MessageChat;
