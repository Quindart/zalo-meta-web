import { Tabs, Tab, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RequestAddFriend from "./RequestAddFriend";
import { grey } from "@mui/material/colors";
import ListFriend from "./ListFiend";
import { useFriend } from "@/hook/api/useFriend";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";

function FriendTemplate() {
  const [tabIndex, setTabIndex] = useState(0);
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  const { listFriends, getListFriends } = useFriend(me.id);

  useEffect(() => {
    getListFriends();
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f4f6f8" }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tabIndex}
          onChange={(_, newIndex) => setTabIndex(newIndex)}
          sx={{
            borderRight: 1,
            borderColor: "divider",
            minWidth: 200,
            bgcolor: "white",
            alignItems: "flex-start",
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTab-root": {
              justifyContent: "flex-start",
              color: "#1D3557",
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "16px",
              paddingRight: 20,
            },
            "& .Mui-selected": {
              color: "#000000",
              bgcolor: "#E3EEFF",
            },
            "& .MuiTab-root:hover": {
              backgroundColor: grey[200],
            },
          }}
        >
          <Tab
            icon={<PersonIcon />}
            label="Danh sách bạn bè"
            sx={{ flexDirection: "row", gap: 1, justifyContent: "flex-start" }}
          />
          <Tab
            icon={<PersonAddIcon />}
            label="Lời mời kết bạn"
            sx={{ flexDirection: "row", gap: 1, justifyContent: "flex-start" }}
          />
        </Tabs>

        <Box sx={{ flex: 1 }}>
          {tabIndex === 0 && <ListFriend listFriends={listFriends} />}
          {tabIndex === 1 && <RequestAddFriend />}
        </Box>
      </Box>
    </Box>
  );
}

export default FriendTemplate;
