import React, { useState } from "react";
import { Tabs, Tab, Box, Input} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ListFriend from "./ListFiend";
import RequestAddFriend from "./RequestAddFriend";
import { grey } from "@mui/material/colors";
function FriendTemplate() {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f4f6f8"}}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={tabIndex}
        onChange={(e, newIndex) => setTabIndex(newIndex)}
        sx={{
          borderRight: 1,
          borderColor: "divider",
          minWidth: 200,
          bgcolor: "white",
          alignItems: "flex-start",
          "& .MuiTabs-indicator": { display: "none" },
          "& .MuiTab-root": {
            justifyContent: "flex-start",  // Căn trái text + icon
            color: "#1D3557",  // Màu chữ mặc định
            textTransform: "none", // Không viết hoa chữ
            fontWeight: "bold", // In đậm chữ
            fontSize: "16px", // Kích thước chữ
            paddingRight:20
          },
          "& .Mui-selected": {
            color: "#000000", // Màu chữ khi được chọn
            bgcolor: "#E3EEFF", // Màu nền khi được chọn (giống ảnh)
          },
          "& .MuiTab-root:hover": {
            backgroundColor: grey[200], // Màu chữ khi hover
          },
        }}
        
      >
        <Box sx={{height:70, backgroundColor: "red"}}>
          <Input/>
        </Box>
        <Tab icon={<PersonIcon />} label="Danh sách bạn bè" sx={{ flexDirection: "row", gap: 1, justifyContent: "flex-start" }}/>
        <Tab icon={<PersonAddIcon />} label="Lời mời kết bạn" sx={{ flexDirection: "row", gap: 1, justifyContent: "flex-start" }}/>
      </Tabs>

      <Box sx={{ flex: 1, p: 3 }}>
        {tabIndex === 0 && (
          <>
            <ListFriend/>
          </>
        )}
        {tabIndex === 1 && (
          <>
            <RequestAddFriend/>
          </>
        )}
      </Box>
    </Box>
  );
}

export default FriendTemplate;
