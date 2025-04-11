// import { Box } from "@mui/material";
import { useChat } from "@/hook/api/useChat";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from 'react';

const listFiends = [
  {
    id: '67f6486e0ea31acce03b3d13',
    name: "John Doe",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL2de_EUA1aFedrjCcpFf8FbMObTcG3BkGcQ&s",
  },
  {
    id: '67f64929cc637ca8c01d9b70',
    name: "Jane Smith",
    avatar: "https://media.wired.com/photos/593261cab8eb31692072f129/master/pass/85120553.jpg",
  },
  {
    id: '67f674ca4d2de6647e0f37a3',
    name: "Nguyen Van A",
    avatar: "https://www.aaha.org/wp-content/uploads/2024/03/b5e516f1655346558958c939e85de37a.jpg",
  },
  {
    id: '67f64a9f4d2de6647e0f3786',
    name: "LE QUOC PHONG",
    avatar: "https://www.aaha.org/wp-content/uploads/2024/03/b5e516f1655346558958c939e85de37a.jpg",
  },
];

function FriendTemplate() {
  const navigate = useNavigate();
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  const { findOrCreateChat, channel } = useChat(me.id);

  const [shouldNavigate, setShouldNavigate] = useState<string | null>(null);

  useEffect(() => {
    if (channel && shouldNavigate === channel.id) {
      navigate(`/chats/${channel.id}`);
      setShouldNavigate(null); // Reset sau khi điều hướng
    }
  }, [channel, navigate, shouldNavigate]);

  const handleFindChat = (receiverId: string) => {
    findOrCreateChat(receiverId);
    setShouldNavigate(null); // Reset trước khi gọi
  };

  useEffect(() => {
    if (channel) {
      setShouldNavigate(channel.id); // Cập nhật khi channel thay đổi
    }
  }, [channel]);

  return (
    <div>
      <p>FriendTemplate</p>

      <div>
        {listFiends.map((friend) => (
          <div
            onClick={() => {
              handleFindChat(friend.id);
            }}
            style={{ display: "flex", alignItems: "center", cursor: "pointer", padding: "10px", borderRadius: "8px", backgroundColor: "#f0f0f0", marginBottom: "10px" }} key={friend.id}>
            <img style={{ width: "50px", height: "50px", borderRadius: "50%" }} src={friend.avatar} alt={friend.name} />
            <p>{"_" + friend.id + "_"}</p>
            <p>{friend.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendTemplate;
