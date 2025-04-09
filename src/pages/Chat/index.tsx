import PopupCategory from "@/components/PopupCategory";
import CustomSearchBar from "@/components/SearchBar";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import ChatItem from "./ChatInfo/ChatItem";
import { EditNotifications } from "@mui/icons-material";

function ChatTemplate() {
  const navigate = useNavigate();
  const infoChat = [
    {
      id: "67b4b8fa40191e21f03c08f2",
      avatar:
        "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/11/20/975861/F0B28C78-C0D5-4255-B-01.jpeg",
      name: "MR.TESTER",
      message: "Ngay mai di choi nhajjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",
      time: new Date("2024-05-16"),
      isRead: true,
      isChoose: true,
    },
    {
      id: 2,
      avatar:
        "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/11/20/975861/F0B28C78-C0D5-4255-B-01.jpeg",
      name: "Lê Minh Quang",
      message: "bai tap sao roi ban",
      time: new Date("2024-16-16"),
      isRead: true,
      isChoose: false,
    },
    {
      id: 3,
      avatar:
        "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/11/20/975861/F0B28C78-C0D5-4255-B-01.jpeg",
      name: "Lê Quốc Phòng",
      message: "ok bạn",
      time: new Date("2025-01-16"),
      isRead: false,
      isChoose: false,
    },
  ];
  return (
    <Box  display={"flex"}>
      {" "}
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
            navigate("/chats/0");
          }}
        >
          Cloud của tôi
        </Button>
        {/* CODE DAY NE */}
        {infoChat.map((item) => (
          <ChatItem item={item} />
        ))}
      </Stack>
      <Box bgcolor={"red"} marginLeft={"300px"} flex={1} width={"100%"}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default ChatTemplate;
