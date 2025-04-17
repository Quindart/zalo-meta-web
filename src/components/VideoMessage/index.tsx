import { memo, useState } from "react";
import { Box, Avatar, Typography, IconButton, Dialog, DialogContent } from "@mui/material";
import { Close, Download, ForwardToInbox } from "@mui/icons-material";
import { formatFileSize } from "@/utils";

interface VideoMessageProps {
    name: string;
    size: number;
    path: string;
    extension: string;
    isMe: boolean;
    sender?: {
        id: string;
        name: string;
        avatar: string;
    };
    createdAt?: string;
}

const VideoMessage = memo(({
    name,
    size,
    path,
    extension,
    isMe,
    sender,
    createdAt
}: VideoMessageProps) => {
    const [fullScreenOpen, setFullScreenOpen] = useState(false);

    const formattedName = `${name.length > 20 ? name.slice(0, 20) + '...' : name}.${extension}`;

    const formatTime = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!path) {
            console.error("Download path is missing");
            return;
        }

        try {
            new URL(path);
            fetch(path)
                .then(response => response.blob())
                .then(blob => {
                    const blobUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = `${name}.${extension}`;
                    document.body.appendChild(link);

                    link.click();

                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);
                })
                .catch(error => {
                    console.error("Error downloading file:", error);
                });
        } catch (error) {
            const link = document.createElement('a');
            link.href = path;
            link.download = `${name}.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
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
            {/* Message container */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 1,
                    maxWidth: "70%",
                }}
            >
                {/* Message content */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        overflow: "hidden",
                        backgroundColor: isMe ? "#E0EDFB" : "white",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        p: 1,
                        maxWidth: "100%",
                        order: isMe ? 1 : 2,
                    }}
                >
                    {/* Video preview */}
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
                            src={path}
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

                    {/* File info */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ overflow: "hidden", mr: 1 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: "0.85rem",
                                    fontWeight: 500,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {formattedName}
                            </Typography>
                            <Typography variant="caption" fontWeight={500} color="text.secondary">
                                {formatFileSize(size)}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {/* Download button */}
                            <IconButton size="small" onClick={handleDownload}>
                                <Download fontSize="small" sx={{ color: "#666" }} />
                            </IconButton>

                            {/* Forward button */}
                            <IconButton size="small">
                                <ForwardToInbox fontSize="small" sx={{ color: "#666" }} />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Timestamp */}
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: "0.7rem",
                            color: "#999",
                            alignSelf: isMe ? "flex-end" : "flex-start",
                            mt: 0.5
                        }}
                    >
                        {formatTime(createdAt)}
                    </Typography>
                </Box>

                {/* Avatar for non-my messages */}
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

            {/* Fullscreen Video Dialog */}
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
                        src={path}
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
        </Box>
    );
});

export default VideoMessage;