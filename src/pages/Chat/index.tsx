import PopupCategory from "@/components/PopupCategory";
import CustomSearchBar from "@/components/SearchBar";
import { Box, IconButton, Stack } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import ChatItem from "./ChatInfo/ChatItem";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useMemo, useState } from "react";
import SocketService from "@/services/socket/SocketService";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

const MY_CLOUD = {
  id: 1,
  avatar:
    "https://res-zalo.zadn.vn/upload/media/2021/6/4/2_1622800570007_369788.jpg", // random avatar
  name: "Cloud của tôi",
  message: "Bạn vừa thêm một tệp vào Cloud.",
  time: new Date("2025-04-11T01:42:48.268Z"),
  isRead: false,
  isChoose: true,
};

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
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
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
    socket.on(
      SOCKET_EVENTS.CHANNEL.LOAD_CHANNEL_RESPONSE,
      (response: ResponseType) => {
        console.log("response", response);
        if (response.success) {
          setListChannel(response.data);
        } else {
          console.error("Error loading channels:", response.message);
        }
      },
    );
  };

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
          width: 360,
          height: "calc(100vh - 70px)",
          bgcolor: "white",
          position: "fixed",
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
              <PersonAddAltIcon
                sx={{
                  width: 25,
                  height: 25,
                }}
              />
            </IconButton>
            <IconButton
              color="default"
              sx={{ borderRadius: 2 }}
              onClick={() => console.log("Delete")}
            >
              <GroupAddIcon
                sx={{
                  width: 25,
                  height: 25,
                }}
              />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ alignContent: "end" }}>
          <PopupCategory />
        </Box>
        <ChatItem item={MY_CLOUD} />
        {infoChat.map((item, index) => (
          <ChatItem key={index} item={item} />
        ))}
      </Stack>
      <Box marginLeft={"300px"} flex={1} width={"100%"}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default ChatTemplate;
