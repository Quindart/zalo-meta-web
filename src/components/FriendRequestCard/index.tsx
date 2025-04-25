import { Box, Typography, Avatar, Button, Stack } from "@mui/material";

function FriendRequestCard({
  avatar,
  name,
  date,
  source,
  message,
  onAccept,
  onDecline,
}: any) {
  return (
    <Box sx={{ p: 2, borderRadius: 2, bgcolor: "white", height: 200 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar src={avatar} alt={name} />
        <Box>
          <Typography color="#081b3a" fontWeight={600}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {date} - {source}
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            bgcolor: "#f5f5f5",
            borderRadius: 1,
            p: 1,
            mt: 1,
            mb: 2,
            fontSize: "0.875rem",
            color: "081b3a",
            overflowY: "auto",
            maxHeight: 60,
          }}
        >
          {message}
       
        </Box>
        <Box display="flex" gap={1}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onDecline}
            sx={{
              bgcolor: "#E5E7EB",
              color: "#081b3a",
              boxShadow: "none",
              height: 40,
              border: 0,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Từ chối
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#DBEBFF",
              color: "#1779F7",
              boxShadow: "none",
              height: 40,
              fontSize: 16,
              fontWeight: 600,
            }}
            onClick={onAccept}
          >
            Đồng ý
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default FriendRequestCard;
