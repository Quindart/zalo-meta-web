import useAuth from "@/hook/api/useAuth";
// import { useChat } from "@/hook/api/useChat";
import useVideo from "@/hook/api/useVideo";
import { Avatar, Box, Link, Typography } from "@mui/material";
import { useEffect } from "react";
// import { useParams } from "react-router-dom";

function CallVideoTemplate() {
  const { containerRef, initCall, chatId } = useVideo();
  const { me } = useAuth();
  // const handleSendMessage = () => {};

  useEffect(() => {
    const init = async () => {
      await initCall();
    };
    init();
  }, []);

  return (
    <>
      <Box
        sx={{
          bgcolor: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Avatar src={`${me.avatar}`}></Avatar>
          <Typography variant="body1" color="grey.600">
            {me.firstName + " " + me.lastName}
          </Typography>
        </Box>

        <Link
          href={`/chats/${chatId}`}
          sx={{
            cursor: "pointer",
          }}
        >
          Quay lại chat room
        </Link>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 60px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f4f4f4",
        }}
      >
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </Box>
    </>
  );
}

export default CallVideoTemplate;
