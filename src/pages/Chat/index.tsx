import { Box, Button, Stack } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

function ChatTemplate() {
  const navigate = useNavigate();
  return (
    <Box display={"flex"}>
      {" "}
      <Stack
        direction="column"
        spacing={1}
        sx={{
          pt: 1,
          width: 300,
          height: "calc(100vh - 70px)",
          bgcolor: "white",
          borderRight: "0.5px solid #E0E8EF",
        }}
      >
        <Button
          onClick={() => {
            navigate("/chats/1");
          }}
        >
          chat 1
        </Button>
        <Button
          onClick={() => {
            navigate("/chats/2");
          }}
        >
          chat 2
        </Button>
        <Button
          onClick={() => {
            navigate("/chats/3");
          }}
        >
          chat 3
        </Button>
      </Stack>
      <Outlet />
    </Box>
  );
}

export default ChatTemplate;
