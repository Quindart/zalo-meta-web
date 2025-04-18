import { Box, Typography, IconButton, Dialog, DialogContent, DialogTitle, CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { formatFileSize } from "@/utils";

// Mapping đuôi file với màu sắc
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

interface FileCardProps {
  name: string;
  size: number;
  extension: string;
  path: string;
  isMe: boolean;
}

export default function FileCard({ name, size, extension, path, isMe }: FileCardProps) {
  const { bg, color } = fileColors[extension] || fileColors.default;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState("");

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the preview when clicking download

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

  const openFilePreview = () => {
    setPreviewOpen(true);
    setLoading(true);
    setPreviewError("");

    if (extension === 'pdf') {
      setPreviewUrl(path);
      setLoading(false);
      return;
    }

    if (extension === 'txt') {
      fetch(path)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(text => {
          const blob = new Blob([text], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error loading text file:", error);
          setPreviewError("Không thể xem trước file này.");
          setLoading(false);
        });
      return;
    }

    if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
      try {
        const encoded = encodeURIComponent(path);
        setPreviewUrl(`https://docs.google.com/viewer?url=${encoded}&embedded=true`);
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

  const renderPreviewContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (previewError) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{previewError}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Vui lòng tải file về để xem.
          </Typography>
        </Box>
      );
    }

    if (extension === 'pdf') {
      return (
        <iframe
          src={`${previewUrl}#toolbar=0&navpanes=0`}
          width="100%"
          height="200px"
          style={{ border: 'none' }}
          title="PDF Viewer"
        />
      );
    }

    if (extension === 'txt') {
      return (
        <iframe
          src={previewUrl}
          width="100%"
          height="500px"
          style={{ border: 'none' }}
          title="Text Viewer"
        />
      );
    }

    // For doc, docx, etc. using Google Docs Viewer
    return (
      <iframe
        src={previewUrl}
        width="100%"
        height="500px"
        style={{ border: 'none' }}
        title="Document Viewer"
      />
    );
  };

  return (
    <>
      <Box
        onClick={openFilePreview}
        display={"flex"}
        gap={1}
        alignSelf={isMe ? "flex-end" : "flex-start"}
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "12px",
          borderRadius: 2,
          backgroundColor: "#e3f2fd",
          maxWidth: 400,
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#d0e7f7",
          },
        }}
      >
        {/* Icon đại diện file */}
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

        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
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
              {name}
            </Typography>
            <Typography sx={{ ml: 0.5 }}>.{extension}</Typography>
          </Typography>
          <Typography variant="caption" fontWeight={500} color="text.secondary">
            {formatFileSize(size)}
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
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={closePreview}
        maxWidth="md"
        fullWidth
        aria-labelledby="file-preview-dialog"
      >
        <DialogTitle id="file-preview-dialog" sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {name}.{extension}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={closePreview}
            sx={{ color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {renderPreviewContent()}
        </DialogContent>
      </Dialog>
    </>
  );
}