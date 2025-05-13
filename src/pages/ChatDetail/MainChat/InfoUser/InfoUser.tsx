import { useState } from "react";
import { Avatar, Box, Typography, IconButton } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import SearchIcon from "@mui/icons-material/Search";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import InfoDialog from "./InfoDialog";
import CallVideoDialog from "@/components/CallVideoDialog";
import { useParams } from "react-router-dom";

function InfoUser({ channel }: any) {
  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);
  const [openCallVideoModal, setOpenCallVideoModal] = useState<boolean>(false);
  const { id } = useParams();

  const handleOpenCallVideoModal = async () => {
    window.open(`/videos?chatId=${id}`, "_blank");
  };
  return (
    <>
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
            onClick={() => setOpenInfoModal(true)}
          />
          <Typography variant="body1" fontWeight="600">
            {channel?.name || ""}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton>
            <GroupAddIcon />
          </IconButton>
          <IconButton onClick={handleOpenCallVideoModal}>
            <VideoCallIcon />
          </IconButton>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <ViewAgendaIcon />
          </IconButton>
        </Box>
      </Box>
      <InfoDialog
        open={openInfoModal}
        onClose={() => setOpenInfoModal(false)}
        user={channel}
      />
      <CallVideoDialog
        open={openCallVideoModal}
        handleClose={() => setOpenCallVideoModal(false)}
      />
    </>
  );
}

export default InfoUser;
