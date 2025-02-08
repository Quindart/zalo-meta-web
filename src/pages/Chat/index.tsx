import CustomSearchBar from "@/components/SearchBar";
import { Box, Button, Stack } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { ExpandMore } from "@mui/icons-material";
import React, { useState } from "react";

import PopupMessage from "@/components/PopupMessage";
import PopupCategory from "@/components/PopupCategory";

function ChatTemplate() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


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
        <Box mx={2}>
          <CustomSearchBar placeholder="Search for" />
        </Box>

        <Box sx={{ alignContent: "end" }}>
          <Button size="small" color="inherit" variant="text" endIcon={<ExpandMore />} onClick={handleClick}>
            Phân loại
          </Button>
          <PopupCategory anchorEl={anchorEl} onClose={handleClose} />
        </Box>

        <Button
          onClick={() => {
            navigate("/chats/1");
          }}
        >
          chat 1
          <PopupMessage />
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
