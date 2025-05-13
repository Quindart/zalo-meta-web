/* eslint-disable prefer-const */
import { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  Popover,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Grid,
} from "@mui/material";
import { Close, MoreHoriz } from "@mui/icons-material";
import { useChatContext } from "@/Context/ChatContextType";
import React from "react";
import ShareDialog from "../Message/ShareDialog";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ReplyIcon from "@mui/icons-material/Reply";
import DownloadIcon from "@mui/icons-material/Download";

type ImageGroupProps = {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  emojis: any[];
  images: Array<{
    id: string;
    path: string;
    filename: string;
    size: number;
    extension: string;
  }>;
  channelId: string;
  status: string;
  timestamp: string;
  isMe: boolean;
  interactEmoji: (
    messageId: string,
    emoji: string,
    userId: string,
    channelId: string,
  ) => void;
  removeMyEmoji: (messageId: string, userId: string, channelId: string) => void;
};

function ImageGroupMessage({
  images,
  isMe,
  id,
  emojis = [],
  channelId,
  interactEmoji,
  removeMyEmoji,
  sender,
  timestamp,
}: ImageGroupProps) {
  const { deleteMessage, recallMessage } = useChatContext();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [openShare, setOpenShare] = useState(false);

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadCurrentImage = (e: React.MouseEvent) => {
    e.stopPropagation();


    if (selectedImageIndex === null) return;


    const image = images[selectedImageIndex];


    try {
      fetch(image.path)
        .then((response) => response.blob())
        .then((blob) => {
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `${image.filename || `image-${selectedImageIndex}`}.${image.extension || "jpg"}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        });
    } catch (error) {
      console.log("💲💲💲 ~ handleDownloadCurrentImage ~ error:", error)
      const link = document.createElement("a");
      link.href = image.path;
      link.download = `${image.filename || `image-${selectedImageIndex}`}.${image.extension || "jpg"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiClick = (emoji: string) => {
    if (interactEmoji && id && sender?.id && channelId) {
      interactEmoji(id, emoji, sender.id, channelId);
    }
    handleClose();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const emoji = event.dataTransfer.getData("text/plain");
    if (emoji && interactEmoji && id && sender?.id && channelId) {
      interactEmoji(id, emoji, sender.id, channelId);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Get grid columns based on number of images
  const getGridColumns = () => {
    const count = images.length;
    if (count === 1) return 12;
    if (count === 2) return 6;
    if (count === 3) return 4;
    if (count === 3) return 4;
    if (count === 4) return 3; // For 4 images
    if (count >= 5 && count <= 8) return 4; // For 5-8 images
    if (count > 8 && count <= 12) return 3; // For 9-12 images
    if (count > 12) return 3; // For more than 12 images
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: isMe ? "flex-end" : "flex-start",
          width: "100%",
          mb: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: 1,
            maxWidth: "70%",
          }}
        >
          {/* Avatar for non-my messages */}
          {!isMe && <Avatar src={sender.avatar} />}

          {/* Message container */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "12px",
              borderRadius: 2,
              backgroundColor: isMe ? "#E0EDFB" : "white",
              maxWidth: 400,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#d0e7f7",
                ".emoji-btn": { opacity: 1 },
                ".more-btn": { opacity: 1 },
              },
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <Grid
              container
              spacing={1}
            <Grid
              container
              spacing={1}
              sx={{
                width: images.length > 1 ? 300 : "auto",
                maxWidth: 300,
              }}
            >
              {images.map((image, index) => {
                let gridProps = { xs: getGridColumns() }; // Default: 2 columns


                return (
                  <Grid item {...gridProps} key={index}>
                    <Box
                      onClick={() => setSelectedImageIndex(index)}
                      sx={{
                        width: "100%",
                        paddingTop: "100%", // 1:1 aspect ratio
                        position: "relative",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        component="img"
                        src={image.path}
                        alt={image.filename}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            <Box
              sx={{
                alignSelf: "stretch",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.7rem",
                    color: "#999",
                    alignSelf: isMe ? "flex-end" : "flex-start",
                  }}
                >
                  {formatTime(timestamp)}
                </Typography>
              </Box>
            </Box>

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
                "&:hover": { backgroundColor: "#f7f7f7" },
              }}
            >
              <ThumbUpOffAltIcon fontSize="small" />
            </IconButton>

            <Box
              className="more-btn"
              sx={{
                position: "absolute",
                [isMe ? "left" : "right"]: -36,
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
                    "&:hover": { backgroundColor: "#f7f7f7" },
                  }}
                >
                  <ReplyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {isMe && (
                <Tooltip title="Thêm">
                  <IconButton
                    size="small"
                    onClick={handleMenuOpen}
                    sx={{
                      backgroundColor: "#fff",
                      "&:hover": { backgroundColor: "#f7f7f7" },
                    }}
                  >
                    <MoreHoriz fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClose}
              disableAutoFocus
              disableEnforceFocus
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box px={"4px"} py={"2px"} display="flex" gap={"4px"}>
                {["❤️", "👍", "😂", "😮", "😢", "😡", "❌"].map((emoji) => (
                  <Typography
                    key={emoji}
                    fontSize={14}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { transform: "scale(1.2)" },
                    }}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/plain", emoji)
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      handleEmojiClick(emoji);
                      if (
                        emoji === "❌" &&
                        removeMyEmoji &&
                        id &&
                        sender?.id &&
                        channelId
                      ) {
                        removeMyEmoji(id, sender.id, channelId);
                      }
                    }}
                  >
                    {emoji}
                  </Typography>
                ))}
              </Box>
            </Popover>

            {emojis && emojis.length > 0 && (
              <Box
                position="absolute"
                px={"2px"}
                sx={{
                  left: isMe ? "" : "",
                  right: isMe ? 30 : "auto",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                }}
                borderRadius={4}
                bgcolor="white"
                display="flex"
                bottom={-12}
                gap={0.5}
                alignItems="center"
                boxShadow="1px 1px 1px 1px rgb(220, 224, 227)"
              >
                {emojis
                  .filter((index) => index <= 2)
                  .filter((index) => index <= 2)
                  .map((e, index) => (
                    <Typography key={index} fontSize={12} color="initial">
                      {e.emoji}
                    </Typography>
                  ))}
                {emojis.length > 3 && (
                  <Typography
                    sx={{ display: "flex" }}
                    fontSize={12}
                    color="grey.600"
                  >
                    <span>+</span>
                    {emojis.length - 3}
                  </Typography>
                )}
              </Box>
            )}

            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem
                onClick={() => {
                  if (id && channelId) {
                    deleteMessage(id, channelId);
                  }
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
                  if (id) {
                    recallMessage(id);
                  }
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
          </Box>
        </Box>
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
        maxWidth="xl"
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.9)",
            boxShadow: "none",
            position: "relative",
          },
        }}
      >
        <IconButton
          onClick={() => setSelectedImageIndex(null)}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "white",
            bgcolor: "rgba(0,0,0,0.4)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.6)",
            },
            zIndex: 10,
          }}
        >
          <Close />
        </IconButton>


        {/* Download current image button */}
        <IconButton
          onClick={handleDownloadCurrentImage}
          sx={{
            position: "absolute",
            top: 10,
            right: 60, // Position it to the left of the close button
            color: "white",
            bgcolor: "rgba(0,0,0,0.4)",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.6)",
            },
            zIndex: 10,
          }}
        >
          <DownloadIcon />
        </IconButton>

        <DialogContent sx={{ p: 0, overflow: "hidden", textAlign: "center" }}>
          {selectedImageIndex !== null && (
            <Box
              component="img"
              src={images[selectedImageIndex].path}
              alt={images[selectedImageIndex].filename}
              sx={{
                maxWidth: "100vw",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <ShareDialog
        open={openShare}
        onClose={() => setOpenShare(false)}
        messageToShare={images.map((img) => img.path).join("\n")}
        messageId={id}
      />
    </>
  );
}

export default React.memo(ImageGroupMessage);
