import PopupCategory from "@/components/PopupCategory";
import CustomSearchBar from "@/components/SearchBar";
import { Box, IconButton, Stack } from "@mui/material";
import { Outlet, useParams } from "react-router-dom";
import ChatItem from "./ChatInfo/ChatItem";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useMemo, useState, useCallback } from "react";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PopupGroup from "@/components/PopupGroup";
import { useChatContext } from '@/Context/ChatContextType';

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

function ChatTemplate() {
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  const [showPopup, setShowPopup] = useState(false);
  const params = useParams();
  const currentChannelId = params.id;
  const { listChannel, loadChannel, messages, createGroup} = useChatContext();

  useEffect(() => {
    loadChannel(me.id);
  }, [me, messages]);

  const infoChat = useMemo(() => {
    return listChannel
      .map((item) => ({
        id: item.id,
        name: item.name,
        avatar: item.avatar,
        time: item.time,
        message: item.message,
        isRead: item.isRead !== undefined ? item.isRead : false,
        isChoose: currentChannelId === item.id,
      })).sort((a, b) => {
        const dateA = new Date(a.time).getTime();
        const dateB = new Date(b.time).getTime();
        return dateB - dateA; 
      }
    );
  }, [listChannel, currentChannelId]);

  const handleGroupIconClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(!showPopup);
  }, [showPopup]);

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
            <Box sx={{ position: "relative" }}>
              <IconButton
                color="default"
                sx={{ borderRadius: 2 }}
                onClick={handleGroupIconClick}
              >
                <GroupAddIcon
                  sx={{
                    width: 25,
                    height: 25,
                  }}
                />
              </IconButton>
              {showPopup && (
                <PopupGroup setShow={setShowPopup} createGroup={createGroup} />
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ alignContent: "end" }}>
          <PopupCategory />
        </Box>
        <ChatItem item={MY_CLOUD} />
        {infoChat.map((item, index) => (
          <ChatItem key={item.id || index} item={item} />
        ))}
      </Stack>
      <Box marginLeft={"300px"} flex={1} width={"100%"}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default ChatTemplate;