import { useState } from "react";
import { Box, Avatar, Typography, IconButton, Dialog, DialogContent, Popover, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Tooltip } from "@mui/material";
import { Close, MoreHoriz } from "@mui/icons-material";
// import { formatFileSize } from "@/utils";
import { useChatContext } from "@/Context/ChatContextType";
import ShareDialog from "../Message/ShareDialog";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ReplyIcon from "@mui/icons-material/Reply";
import React from "react";
import DownloadIcon from "@mui/icons-material/Download";

type VideoMessageProps = {
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
    }
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

function VideoMessage({
    file,
    isMe,
    id,
    sender,
    timestamp,
    emojis = [],
    channelId,
    interactEmoji,
    removeMyEmoji
}: VideoMessageProps) {
    const { deleteMessage, recallMessage } = useChatContext();
    const [fullScreenOpen, setFullScreenOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [openShare, setOpenShare] = useState(false);

    const formatTime = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!file.path) {
            console.error("Download path is missing");
            return;
        }

        try {
            new URL(file.path);
            fetch(file.path)
                .then(response => response.blob())
                .then(blob => {
                    const blobUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = `${file.filename}.${file.extension}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);
                })
                .catch(error => {
                    console.error("Error downloading file:", error);
                });
        } catch (error) {
            console.log("💲💲💲 ~ handleDownload ~ error:", error)
            const link = document.createElement('a');
            link.href = file.path;
            link.download = `${file.filename}.${file.extension}`;
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

    return (
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
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        backgroundColor: isMe ? "#E0EDFB" : "white",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        p: 1,
                        maxWidth: "100%",
                        order: isMe ? 1 : 2,
                        position: "relative",
                        "&:hover": {
                            ".emoji-btn": { opacity: 1 },
                            ".more-btn": { opacity: 1 },
                        },
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <Box
                        sx={{
                            width: "100%",
                            cursor: "pointer",
                            borderRadius: 1,
                            overflow: "hidden",
                            mb: 1,
                            '&:hover': {
                                opacity: 0.9,
                            }
                        }}
                        onClick={() => setFullScreenOpen(true)}
                    >
                        <Box
                            component="video"
                            src={file.path}
                            controls
                            sx={{
                                width: "100%",
                                maxWidth: "300px",
                                height: "auto",
                                objectFit: "cover",
                                borderRadius: 1,
                            }}
                        />
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ overflow: "hidden", mr: 1 }}>
                            {/* <Typography
                                variant="body2"
                                sx={{
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {file.filename}
                            </Typography> */}
                            <Typography
                                variant="caption"
                                sx={{
                                    fontSize: "0.7rem",
                                    color: "#999",
                                    alignSelf: isMe ? "flex-end" : "flex-start",
                                    mt: 0.5
                                }}
                            >
                                {formatTime(timestamp)}
                            </Typography>
                            {/* <Typography variant="caption" fontWeight={500} color="text.secondary">
                                {formatFileSize(file.size)}
                            </Typography> */}
                        </Box>
                        <IconButton
                            size="small"
                            sx={{ bgcolor: "grey.100", mr:2 }}
                            onClick={handleDownload}
                            title="Tải xuống"
                        >
                            <DownloadIcon fontSize="small" />
                        </IconButton>
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
                                    onDragStart={(e) => e.dataTransfer.setData("text/plain", emoji)}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleEmojiClick(emoji);
                                        if (emoji === "❌" && removeMyEmoji && id && sender?.id && channelId) {
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
                        >
                            {emojis
                                .filter((_e, index) => index <= 2)
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

                {!isMe && (
                    <Avatar
                        src={sender?.avatar}
                        sx={{
                            width: 32,
                            height: 32,
                            order: 1,
                            visibility: sender ? "visible" : "hidden"
                        }}
                    />
                )}
            </Box>

            <Dialog
                open={fullScreenOpen}
                onClose={() => setFullScreenOpen(false)}
                maxWidth="xl"
                PaperProps={{
                    sx: {
                        bgcolor: "rgba(0,0,0,0.9)",
                        boxShadow: "none",
                        position: "relative",
                    }
                }}
            >
                <IconButton
                    onClick={() => setFullScreenOpen(false)}
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        color: "white",
                        bgcolor: "rgba(0,0,0,0.4)",
                        "&:hover": {
                            bgcolor: "rgba(0,0,0,0.6)",
                        }
                    }}
                >
                    <Close />
                </IconButton>

                <DialogContent sx={{ p: 0, overflow: "hidden", textAlign: "center" }}>
                    <Box
                        component="video"
                        src={file.path}
                        controls
                        autoPlay
                        sx={{
                            maxWidth: "100vw",
                            maxHeight: "90vh",
                            objectFit: "contain",
                        }}
                    />
                </DialogContent>
            </Dialog>

            <ShareDialog
                open={openShare}
                onClose={() => setOpenShare(false)}
                messageToShare={file.path}
                messageId={id}
            />
        </Box>
    );
}

export default React.memo(VideoMessage);