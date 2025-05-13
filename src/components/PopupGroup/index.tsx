import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useFriend } from "@/hook/api/useFriend";
import {
  Box,
  Checkbox,
  Avatar,
  Typography,
  Button,
  TextField,
  Divider,
} from "@mui/material";

const PopupGroup = ({
  setShow,
  createGroup,
}: {
  setShow: any;
  createGroup: (name: string, members: string[]) => void;
}) => {
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  const { listFriends, getListFriends } = useFriend(me.id);
  const [selected, setSelected] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    getListFriends();
  }, []);

  const handleToggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGroupName(value);

    if (!value.trim()) {
      setNameError("Tên nhóm không được để trống");
    } else if (value.length > 50) {
      setNameError("Tên nhóm không được quá 50 ký tự");
    } else {
      setNameError("");
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setNameError("Tên nhóm không được để trống");
      return;
    }
    createGroup(groupName, selected);
    setShow(false);
  };

  return (
    <Box
      sx={{
        bgcolor: "white",
        position: "absolute",
        top: 50,
        right: 0,
        zIndex: 100,
        borderRadius: 1,
        p: 2,
        width: 350, // Made wider to accommodate the text field
        boxShadow: 3,
        border: "1px solid #e0e0e0",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tạo nhóm chat
      </Typography>

      {/* Group Name Input */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="medium"
          label="Tên nhóm"
          variant="outlined"
          value={groupName}
          onChange={handleNameChange}
          error={!!nameError}
          helperText={nameError}
          sx={{ mb: 1 }}
        />
        <Typography variant="caption" color="text.secondary">
          Hãy đặt tên nhóm để dễ dàng nhận biết
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Chọn thành viên ({selected.length})
      </Typography>

      {listFriends.length === 0 ? (
        <Typography color="text.secondary" align="center" my={3}>
          Không có bạn bè
        </Typography>
      ) : (
        <Box
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            border: "1px solid #f0f0f0",
            borderRadius: 1,
            p: 1,
          }}
        >
          {listFriends.map((elm) => (
            <Box
              key={elm.id}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                py: 1,
                borderBottom: "1px solid #f5f5f5",
                "&:hover": {
                  bgcolor: "#f9f9f9",
                },
              }}
            >
              <Checkbox
                checked={selected.includes(elm.id)}
                onChange={() => handleToggle(elm.id)}
                size="small"
              />
              <Avatar
                src={elm.avatar}
                alt={elm.name}
                sx={{ width: 36, height: 36, mr: 1 }}
              />
              <Typography noWrap>
                {elm.lastName} {elm.name}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setSelected([]);
            setShow(false);
          }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          size="small"
          disabled={selected.length < 2 || !!nameError || !groupName.trim()}
          onClick={handleCreateGroup}
        >
          Tạo nhóm
        </Button>
      </Box>
    </Box>
  );
};

export default PopupGroup;
