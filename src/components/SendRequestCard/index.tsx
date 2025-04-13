import { Box, Typography, Avatar, Button, Stack } from "@mui/material";

function SentRequestCard({ avatar, name, date, onCancel }: any) {
  return (
    <Box sx={{ p: 2, borderRadius: 2, bgcolor: "white" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar src={avatar} alt={name} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography fontWeight={600} sx={{ color: "#081b3a" }}>
            {name}
          </Typography>
          <Typography variant="caption" sx={{ color: "#081b3a" }}>
            {date}
          </Typography>
        </Box>
      </Stack>
      <Button
        fullWidth
        variant="contained"
        sx={{
          bgcolor: "#E5E7EB",
          color: "#081b3a",
          boxShadow: "none",
          height: 40,
          border: 0,
          fontSize: 16,
          fontWeight: 600,
          mt: 1,
        }}
        onClick={onCancel}
      >
        Thu hồi lời mời
      </Button>
    </Box>
  );
}
export default SentRequestCard;
