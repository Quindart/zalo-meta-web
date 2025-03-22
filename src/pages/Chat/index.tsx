import PopupCategory from "@/components/PopupCategory";
import CustomSearchBar from "@/components/SearchBar";
import { Box, Button, Stack } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import ChatItem from "./ChatInfo/ChatItem"

function ChatTemplate() {
  const navigate = useNavigate();
  const infoChat =[
  {
    id:'67b4b8fa40191e21f03c08f2',
    avatar:"https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/11/20/975861/F0B28C78-C0D5-4255-B-01.jpeg",
    name: 'MR.TESTER',
    message:'Ngay mai di choi nhajjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj',
    time: new Date("2024-05-12"),
    isRead:true,
    isChoose: true,
  },
  {
    id:2,
    avatar:"https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/11/20/975861/F0B28C78-C0D5-4255-B-01.jpeg",
    name: 'Lê Minh Quang',
    message:'bai tap sao roi ban',
    time: new Date("2024-12-12"),
    isRead:true,
    isChoose: false,
  },
  {
    id:3,
    avatar:"https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/11/20/975861/F0B28C78-C0D5-4255-B-01.jpeg",
    name: 'Lê Quốc Phòng',
    message:'ok bạn',
    time: new Date("2025-01-12"),
    isRead:false,
    isChoose: false,
  },
]
  return (
    <Box display={"flex"}>
      {" "}
      <Stack
        direction="column"
        spacing={1}
        sx={{
          pt: 1,
          px: 1,
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
      <Box width={"100%"}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default ChatTemplate;
