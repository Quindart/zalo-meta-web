import {
  Avatar,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";
import { formatFileSize } from "@/utils";
import {
  Popover,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";
import { useChatContext } from "@/Context/ChatContextType";
import React from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import ShareDialog from "../Message/ShareDialog";

const fileColors: Record<string, { bg: string; color: string }> = {
  doc: { bg: "#1779F7", color: "white" },
  docx: { bg: "#1779F7", color: "white" },
  pdf: { bg: "#D32F2F", color: "white" },
  xls: { bg: "#388E3C", color: "white" },
  xlsx: { bg: "#388E3C", color: "white" },
  ppt: { bg: "#F57C00", color: "white" },
  pptx: { bg: "#F57C00", color: "white" },
  txt: { bg: "#616161", color: "white" },
  default: { bg: "#757575", color: "white" },
};

type FileCardProps = {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  emojis: any[];
  file: {
    filename: string;
    size: number;
    path: string;
    extension: string;
  };
  channelId: string;
  status: string;
  timestamp: string;
  isMe: boolean;
  interactEmoji?: (
    messageId: string,
    emoji: string,
    userId: string,
    channelId: string,
  ) => void;
  removeMyEmoji?: (
    messageId: string,
    userId: string,
    channelId: string,
  ) => void;
};

function FileCard({
  file,
  isMe,
  id,
  emojis = [],
  channelId,
  interactEmoji,
  removeMyEmoji,
  sender,
  content,
}: FileCardProps) {
  const { deleteMessage, recallMessage } = useChatContext();
  const { bg, color } = fileColors[file.extension] || fileColors.default;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [openShare, setOpenShare] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!file.path) {
      console.error("Download path is missing");
      return;
    }

    try {
      new URL(file.path);
      fetch(file.path)
        .then((response) => response.blob())
        .then((blob) => {
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `${file.filename}.${file.extension}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        })
        .catch((error) => {
          console.error("Error downloading file:", error);
        });
    } catch (error) {
      console.log("💲💲💲 ~ handleDownload ~ error:", error)
      const link = document.createElement("a");
      link.href = file.path;
      link.download = `${file.filename}.${file.extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openFilePreview = () => {
    setPreviewOpen(true);
    setLoading(true);
    setPreviewError("");

    if (file.extension === "pdf") {
      setPreviewUrl(file.path);
      setLoading(false);
      return;
    }

    if (file.extension === "txt") {
      fetch(file.path)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((text) => {
          const blob = new Blob([text], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading text file:", error);
          setPreviewError("Không thể xem trước file này.");
          setLoading(false);
        });
      return;
    }

    if (
      ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(file.extension)
    ) {
      try {
        const encoded = encodeURIComponent(file.path);
        setPreviewUrl(
          `https://docs.google.com/viewer?url=${encoded}&embedded=true`,
        );
        setLoading(false);
      } catch (error) {
        console.error("Error setting up preview:", error);
        setPreviewError("Không thể xem trước file này.");
        setLoading(false);
      }
    } else {
      setPreviewError("Loại file này không hỗ trợ xem trực tuyến.");
      setLoading(false);
    }
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewUrl("");
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiClick = (emoji: string) => {
    if (interactEmoji && id && sender.id && channelId) {
      interactEmoji(id, emoji, sender.id, channelId);
    }
    handleClose();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const emoji = event.dataTransfer.getData("text/plain");
    if (emoji && interactEmoji && id && sender.id && channelId) {
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

  const renderPreviewContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (previewError) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography color="error">{previewError}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Vui lòng tải file về để xem.
          </Typography>
        </Box>
      );
    }

    if (file.extension === "pdf") {
      return (
        <iframe
          src={`${previewUrl}#toolbar=0&navpanes=0`}
          width="100%"
          height="500px"
          style={{ border: "none" }}
          title="PDF Viewer"
        />
      );
    }

    if (file.extension === "txt") {
      return (
        <iframe
          src={previewUrl}
          width="100%"
          height="500px"
          style={{ border: "none" }}
          title="Text Viewer"
        />
      );
    }

    return (
      <iframe
        src={previewUrl}
        width="100%"
        height="500px"
        style={{ border: "none" }}
        title="Document Viewer"
      />
    );
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
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            display={"flex"}
            gap={1}
            alignSelf={isMe ? "flex-end" : "flex-start"}
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              padding: "12px",
              borderRadius: 2,
              backgroundColor: "#e3f2fd",
              maxWidth: 400,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#d0e7f7",
                ".emoji-btn": { opacity: 1 },
                ".more-btn": { opacity: 1 },
              },
            }}
          >
            <Box
              sx={{
                backgroundColor: bg,
                borderRadius: 1,
                padding: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color,
                mr: 1,
              }}
            >
              <InsertDriveFileIcon fontSize="medium" />
            </Box>

            <Box
              onClick={openFilePreview}
              sx={{ flexGrow: 1, overflow: "hidden" }}
            >
              <Typography
                sx={{
                  color: "#081b3a",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {file.filename}
                </Typography>
                <Typography sx={{ ml: 0.5 }}>.{file.extension}</Typography>
              </Typography>
              <Typography
                variant="caption"
                fontWeight={500}
                color="text.secondary"
              >
                {formatFileSize(file.size)}
              </Typography>
            </Box>

            <IconButton
              size="small"
              sx={{ bgcolor: "grey.100" }}
              onClick={handleDownload}
              title="Tải xuống"
            >
              <DownloadIcon fontSize="small" />
            </IconButton>

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
                        sender.id &&
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
            </Popover>            {emojis && emojis.length > 0 && (
              <Box
                position="absolute"
                px={"2px"}
                sx={{
                  left: isMe ? "" : "auto",
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
              >                {emojis
                .slice(0, 3)
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
        open={previewOpen}
        onClose={closePreview}
        maxWidth="md"
        fullWidth
        aria-labelledby="file-preview-dialog"
      >
        <DialogTitle
          id="file-preview-dialog"
          sx={{
            m: 0,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {file.filename}.{file.extension}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={closePreview}
            sx={{ color: "grey.500" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {renderPreviewContent()}
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <ShareDialog
        open={openShare}
        onClose={() => setOpenShare(false)}
        messageToShare={content ?? ""}
        messageId={id}
      />
    </>
  );
}

export default React.memo(FileCard);
