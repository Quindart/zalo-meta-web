import { useChat } from "@/hook/api/useChat";
import { RootState } from "@/store";
import {
  Box,
  InputAdornment,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";

import SortIcon from "@mui/icons-material/SwapVert";
import FilterIcon from "@mui/icons-material/FilterList";

function ListFriend({ listFriends }: any) {
  const navigate = useNavigate();
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  const { findOrCreateChat, channel } = useChat(me.id);

  const [shouldNavigate, setShouldNavigate] = useState<string | null>(null);

  useEffect(() => {
    if (channel && shouldNavigate === channel.id) {
      navigate(`/chats/${channel.id}`);
      setShouldNavigate(null);
    }
  }, [channel, navigate, shouldNavigate]);

  const handleFindChat = (receiverId: string) => {
    findOrCreateChat(receiverId);
    setShouldNavigate(null);
  };

  useEffect(() => {
    if (channel) {
      setShouldNavigate(channel.id);
    }
  }, [channel]);

  //TODO: Search
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterLetter, setFilterLetter] = useState("all");

  const filteredFriends = listFriends
    .filter((f: any) => f.name.toLowerCase().includes(searchText.toLowerCase()))
    .filter((f: any) =>
      filterLetter === "all"
        ? true
        : f.name.toLowerCase().startsWith(filterLetter.toLowerCase()),
    )
    .sort((a: any, b: any) => {
      const compare = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? compare : -compare;
    });

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          lèft: 300,
          right: 0,
          fontSize: 18,
          padding: "20px",
          color: "#081b3a",
          fontWeight: "bold",
          backgroundColor: "white",
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <PersonIcon />
        Danh sách bạn bè{" "}
      </Box>

      <Typography
        mx={2}
        variant="body1"
        mb={2}
        mt={4}
        fontWeight={"bold"}
        color="initial"
      >
        Bạn bè ({listFriends.length}){" "}
      </Typography>

      <Box mx={2} p={2} sx={{ bgcolor: "white", borderRadius: 2 }}>
        <Stack direction="row" spacing={1.5} mb={2}>
          <TextField
            placeholder="Tìm bạn"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="small"
            fullWidth
            sx={{
              borderRadius: "8px",
              backgroundColor: "#fff",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                height: "40px",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            size="small"
            sx={{
              minWidth: 160,
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "#fff",
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
              },
            }}
            startAdornment={<SortIcon color="action" sx={{ mr: 1 }} />}
          >
            <MenuItem value="asc">Tên (A-Z)</MenuItem>
            <MenuItem value="desc">Tên (Z-A)</MenuItem>
          </Select>

          <Select
            value={filterLetter}
            onChange={(e) => setFilterLetter(e.target.value)}
            size="small"
            sx={{
              minWidth: 200,
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "#fff",
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
              },
            }}
            startAdornment={<FilterIcon color="action" sx={{ mr: 1 }} />}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="j">Tên bắt đầu J</MenuItem>
            <MenuItem value="n">Tên bắt đầu N</MenuItem>
            <MenuItem value="l">Tên bắt đầu L</MenuItem>
          </Select>
        </Stack>

        <List>
          {filteredFriends.map((friend: any) => (
            <ListItem
              onClick={() => {
                handleFindChat(friend.id);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
              key={friend.id}
            >
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
                src={friend.avatar}
                alt={friend.name}
              />
              <p>{friend.name}</p>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}

export default ListFriend;

// import {
//   Box,
//   TextField,
//   InputAdornment,
//   MenuItem,
//   Select,
//   Avatar,
//   Typography,
//   Stack,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import SortIcon from "@mui/icons-material/SwapVert";
// import FilterIcon from "@mui/icons-material/FilterList";
// import { useState } from "react";

// const listFriends = [
//   {
//     id: "67f6486e0ea31acce03b3d13",
//     name: "John Doe",
//     avatar:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL2de_EUA1aFedrjCcpFf8FbMObTcG3BkGcQ&s",
//   },
//   {
//     id: "67f64929cc637ca8c01d9b70",
//     name: "Jane Smith",
//     avatar:
//       "https://media.wired.com/photos/593261cab8eb31692072f129/master/pass/85120553.jpg",
//   },
//   {
//     id: "67f674ca4d2de6647e0f37a3",
//     name: "Nguyen Van A",
//     avatar:
//       "https://www.aaha.org/wp-content/uploads/2024/03/b5e516f1655346558958c939e85de37a.jpg",
//   },
//   {
//     id: "67f64a9f4d2de6647e0f3786",
//     name: "LE QUOC PHONG",
//     avatar:
//       "https://www.aaha.org/wp-content/uploads/2024/03/b5e516f1655346558958c939e85de37a.jpg",
//   },
// ];

// export default function FriendSearch() {
//   const [searchText, setSearchText] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [filterLetter, setFilterLetter] = useState("all");

//   const filteredFriends = listFiends
//     .filter((f) => f.name.toLowerCase().includes(searchText.toLowerCase()))
//     .filter((f) =>
//       filterLetter === "all"
//         ? true
//         : f.name.toLowerCase().startsWith(filterLetter.toLowerCase()),
//     )
//     .sort((a, b) => {
//       const compare = a.name.localeCompare(b.name);
//       return sortOrder === "asc" ? compare : -compare;
//     });

//   return (
//     <Box sx={{ p: 2, maxWidth: 700, mx: "auto" }}>
//       {/* Tìm kiếm + Sắp xếp + Lọc */}
//       <Stack direction="row" spacing={2} mb={2}>
//         <TextField
//           fullWidth
//           placeholder="Tìm bạn"
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon color="action" />
//               </InputAdornment>
//             ),
//           }}
//         />

//         <Select
//           value={sortOrder}
//           onChange={(e) => setSortOrder(e.target.value)}
//           size="small"
//           startAdornment={<SortIcon color="action" sx={{ mr: 1 }} />}
//         >
//           <MenuItem value="asc">Tên (A-Z)</MenuItem>
//           <MenuItem value="desc">Tên (Z-A)</MenuItem>
//         </Select>

//         <Select
//           value={filterLetter}
//           onChange={(e) => setFilterLetter(e.target.value)}
//           size="small"
//           startAdornment={<FilterIcon color="action" sx={{ mr: 1 }} />}
//         >
//           <MenuItem value="all">Tất cả</MenuItem>
//           <MenuItem value="j">Tên bắt đầu J</MenuItem>
//           <MenuItem value="n">Tên bắt đầu N</MenuItem>
//           <MenuItem value="l">Tên bắt đầu L</MenuItem>
//         </Select>
//       </Stack>

//       {/* Danh sách bạn */}
//       <Stack spacing={2}>
//         {filteredFriends.map((f) => (
//           <Stack key={f.id} direction="row" spacing={2} alignItems="center">
//             <Avatar src={f.avatar} alt={f.name} />
//             <Typography>{f.name}</Typography>
//           </Stack>
//         ))}

//         {filteredFriends.length === 0 && (
//           <Typography color="text.secondary">
//             Không tìm thấy kết quả.
//           </Typography>
//         )}
//       </Stack>
//     </Box>
//   );
// }
