import { Box, Typography, IconButton, Paper } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

export default function FileCard() {
  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 2,
        borderRadius: 2,
        backgroundColor: "#e3f2fd", 
        maxWidth: 400,
      }}
    >
      {/* Icon file Word */}
      <Box
        sx={{
          backgroundColor: "#1a73e8",
          borderRadius: 2,
          padding: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          mr: 2,
        }}
      >
        <InsertDriveFileIcon fontSize="medium" />
      </Box>

      {/* Nội dung file */}
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Lê Minh Quang - Báo cáo thực tập doan...nal.docx
        </Typography>
        <Typography variant="caption" color="text.secondary">
          10.45 MB · Đã có trên Cloud
        </Typography>
      </Box>

      {/* Nút tải xuống */}
      <IconButton size="small">
        <DownloadIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
}
