import { Box, Typography, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

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
  size: string;
  extension: string;
}

export default function FileCard({ name, size, extension }: FileCardProps) {
  const { bg, color } = fileColors[extension] || fileColors.default;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "12px",
        borderRadius: 2,
        backgroundColor: "#e3f2fd",
        maxWidth: 400,
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
          {size}
        </Typography>
      </Box>

      <IconButton size="small" sx={{ bgcolor: "grey.100" }}>
        <DownloadIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
