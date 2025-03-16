import React, { useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SearchIcon from "@mui/icons-material/Search";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import InfoDialog from "./InfoDialog";

const InfoUser: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "end",
        justifyContent: "space-between",
        backgroundColor: "white",
        marginTop: 1,
        marginLeft: 1
      }}
    >
      {/* Avatar + Tên người dùng */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar
          src="/assets/images/zalo-icon.png"
          sx={{ width: 50, height: 50, cursor: "pointer" }}
          onClick={() => setOpen(true)}
        />
        <Typography variant="body1" fontWeight="600">
          Võ Thị Kim Ngân
        </Typography>
      </Box>

      {/* Icon chức năng */}
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

      {/* Dialog hiển thị thông tin */}
      <InfoDialog open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};

export default InfoUser;
