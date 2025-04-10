import PopupCategory from "@/components/PopupCategory";
import CustomSearchBar from "@/components/SearchBar";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import ChatItem from "./ChatInfo/ChatItem";
import { EditNotifications } from "@mui/icons-material";
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useEffect, useMemo, useState } from "react";
import SocketService from "@/services/socket/SocketService";

const socketService = new SocketService();
const SOCKET_EVENTS = {
  MESSAGE: {
    RECEIVED: "message:received",
  },
  CHANNEL: {
    LOAD_CHANNEL: "channel:load",
    LOAD_CHANNEL_RESPONSE: "channel:loadResponse",
  },
};

interface ResponseType {
  success: boolean;
  message: string;
  data: any;
}


function ChatTemplate() {
  const navigate = useNavigate();
  const userStore = useSelector((state: RootState) => state.userSlice)
  const { me } = userStore
  const [listChannel, setListChannel] = useState<any[]>([]);

  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket.connected) {
      socket.connect();
    }
    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE.RECEIVED);
      socket.off(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL_RESPONSE);
    };
  }, []);

  useEffect(() => {
    const socket = socketService.getSocket();
    socket.on(SOCKET_EVENTS.MESSAGE.RECEIVED, () => {
      reloadChannels();
    });
  }, []);

  useEffect(() => {
    reloadChannels();
  }, []);

  const reloadChannels = () => {
    const socket = socketService.getSocket();
    const params = { currentUserId: me.id };
    socket.emit(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL, params);
    socket.on(SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL_RESPONSE, (response: ResponseType) => {
      console.log("response", response);
      if (response.success) {
        setListChannel(response.data);
      } else {
        console.error("Error loading channels:", response.message);
      }
    });
  }

  const infoChat = useMemo(() => {
    console.log("listChannel", listChannel);
    return listChannel.map((item) => ({
      id: item.id,
      name: item.name,
      avatar: item.avatar,
      time: item.time, // Use the updated time
      message: item.message, // Use the updated message
      isRead: false,
      isChoose: false,
    }));
  }, [listChannel]);

  return (
    <Box display={"flex"}>
      <Stack
        direction="column"
        spacing={1}
        sx={{
          width: 300,
          height: "calc(100vh - 70px)",
          bgcolor: "white",
          position: "fixed",
          top: 0,
          zIndex: 1000,
          borderRight: "0.5px solid #E0E8EF",
        }}
      >
        <Box
          py={"12px"}
          px={"12px"}
          gap={1}
          display={"flex"}
          alignItems={"center"}
        >
          <Box flex={1}>
            <CustomSearchBar placeholder="Search for" />
          </Box>
          <Box gap={"2px"} display={"flex"}>
            <IconButton
              color="default"
              sx={{ borderRadius: 2 }}
              onClick={() => console.log("Edit")}
            >
              <EditNotifications
                sx={{
                  width: 16,
                  height: 16,
                }}
              />
            </IconButton>
            <IconButton
              color="default"
              sx={{ borderRadius: 2 }}
              onClick={() => console.log("Delete")}
            >
              <EditNotifications
                sx={{
                  width: 16,
                  height: 16,
                }}
              />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ alignContent: "end" }}>
          <PopupCategory />
        </Box>
        <Button
          onClick={() => {
            navigate("/chats");
          }}
        >
          Cloud của tôi
        </Button>
        {
          infoChat.map((item, index) => (
            <ChatItem key={index} item={item} />
          ))
        }
      </Stack>
      <Box marginLeft={"300px"} flex={1} width={"100%"}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default ChatTemplate;