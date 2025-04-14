import { useState } from "react";
import { Avatar, Box, Typography, IconButton } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SearchIcon from "@mui/icons-material/Search";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import InfoDialog from "./InfoDialog";

function InfoUser({ channel }: any) {
  const [open, setOpen] = useState<boolean>(false);
  console.log("channel", channel);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "end",
        justifyContent: "space-between",
        backgroundColor: "white",
        marginTop: 1,
        marginLeft: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar
          src={channel?.avatar || ""}
          sx={{ width: 50, height: 50, cursor: "pointer" }}
          onClick={() => setOpen(true)}
        />
        <Typography variant="body1" fontWeight="600">
          {channel?.name || ""}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton>
          <GroupAddIcon />
        </IconButton>
        <IconButton>
          <VideoCallIcon />
        </IconButton>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <IconButton>
          <ViewAgendaIcon />
        </IconButton>
      </Box>
      <InfoDialog open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}

export default InfoUser;
