import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useChatContext } from "@/Context/ChatContextType";
import { useEffect, useState } from "react";
import axiosConfig from "@/services/axiosConfig";
import { useFriend } from "@/hook/api/useFriend";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AddMember from "./AddMember";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getRoleLabel, ROLE_TYPES } from "@/types";
interface GroupMembersPageProps {
  onBack: () => void;
}

const GroupMembersPage: React.FC<GroupMembersPageProps> = ({ onBack }) => {
  const { channel, assignRole, removeMember } = useChatContext();
  const [users, setUsers] = useState<any[]>([]);
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  const { listFriends, getListFriends } = useFriend(me.id);
  const [openAddMember, setOpenAddMember] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { leaveRoom } = useChatContext();
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleAssignRole = (
    targetUserId: string,
    newRole: "captain" | "member" | "sub_captain",
  ) => {
    assignRole({ channelId: channel.id, newRole, targetUserId, userId: me.id });
    handleMenuClose();
  };

  const handleRemoveMember = (userId: string) => {
    removeMember(channel.id, me.id, userId);


    handleMenuClose();
  };

  const myRole = channel?.members?.find((m: any) => m.userId === me.id)?.role;

  useEffect(() => {
    if (me?.id) {
      getListFriends();
    }
    const fetchUsers = async () => {
      try {
        if (channel?.members?.length > 0) {
          const requests = channel.members.map((member: any) =>
            axiosConfig.get(`/api/v1/users/${member.userId}`),
          );
          const responses = await Promise.all(requests);
          const usersData = responses.map((res) => res.user);
          setUsers(usersData);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải user:", err);
      }
    };

    if (channel?.members?.length > 0) {
      fetchUsers();
    }
  }, [me?.id, channel]);

  if (!channel || !channel.members || channel.members.length === 0) {
    return (
      <Drawer variant="permanent" anchor="right" sx={{ flexShrink: 0 }}>
        <Typography>Đang load dữ liệu....</Typography>
      </Drawer>
    );
  }
  const sortedUsers = [...users].sort((a, b) => {
    if (a.id === me.id) return -1;
    if (b.id === me.id) return 1;
    return 0;
  });

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        flexShrink: 0,
        ".MuiPaper-root": {
          width: 372,
        },
      }}
    >
      <Box>
        {/* Header */}
        <Box
          sx={{
            py: 2,
            px: 2,
            textAlign: "center",
            minWidth: 355,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton onClick={onBack} size="small">
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Box sx={{ width: "95%" }}>
            <Typography
              fontWeight={"bold"}
              fontSize={20}
              color="#081B3A"
              textAlign={"center"}
            >
              Thành viên
            </Typography>
          </Box>
        </Box>
        <Divider />
        {/* Danh sách thành viên */}
        <Box textAlign={"center"} mt={2}>
          <Button
            sx={{
              color: "#000",
              fontSize: 17,
              width: "90%",
              fontWeight: "600",
              backgroundColor: "#e5e7eb",
              "&:hover": {
                backgroundColor: "#c6cad2",
              },
            }}
            onClick={() => {
              setOpenAddMember(true);
            }}
          >
            <PersonAddAltIcon sx={{ mr: 1 }} />
            Thêm thành viên
          </Button>
        </Box>

        <Box mt={2} ml={2}>
          <Typography sx={{ color: "#000", fontSize: 16, fontWeight: "600" }}>
            Danh sách thành viên ({channel.members.length})
          </Typography>
        </Box>

        <List>
          {sortedUsers.map((user, index) => {
            const member = channel.members.find(
              (m: any) => m.userId === user.id,
            );
            const isFriend = listFriends.some(
              (friend: any) => friend.id === user.id,
            );
            const isMe = user.id === me.id;
            const isAllowedToAct =
              (myRole === ROLE_TYPES.CAPTAIN && !isMe) ||
              (myRole === ROLE_TYPES.SUB_CAPTAIN &&
                !isMe &&
                myRole !== ROLE_TYPES.CAPTAIN) ||
              isMe;
            return (
              <ListItem
                key={user.id || index}
                secondaryAction={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {/* Nút ... chỉ hiển thị khi hover */}
                    {isAllowedToAct && (
                      <>
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, user)}
                          sx={{
                            opacity: 0,
                            transition: "opacity 0.3s",
                            borderRadius: 2,
                            "&.MuiIconButton-root:hover": {
                              opacity: 1,
                              backgroundColor: "#e5e7eb",
                            },
                            color: "#000",
                          }}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                        {/* Menu riêng cho từng user */}
                        <Menu
                          anchorEl={anchorEl}
                          open={
                            Boolean(anchorEl) && selectedUser?.id === user.id
                          }
                          onClose={handleMenuClose}
                        >
                          {myRole === ROLE_TYPES.CAPTAIN && !isMe && (
                            <>
                              {user.role !== ROLE_TYPES.SUB_CAPTAIN && (
                                <MenuItem
                                  onClick={() => {
                                    handleAssignRole(user.id, "sub_captain");
                                  }}
                                >
                                  Thêm phó nhóm
                                </MenuItem>
                              )}
                              <MenuItem
                                onClick={() => {
                                  handleAssignRole(user.id, "captain");
                                }}
                              >
                                Giao trưởng nhóm
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  handleRemoveMember(user.id);
                                }}
                              >
                                Xóa khỏi nhóm
                              </MenuItem>
                            </>
                          )}
                          {myRole === ROLE_TYPES.SUB_CAPTAIN &&
                            !isMe &&
                            user.role !== ROLE_TYPES.CAPTAIN && (
                              <MenuItem
                                onClick={() => {
                                  handleRemoveMember(user.id);
                                }}
                              >
                                Xóa khỏi nhóm
                              </MenuItem>
                            )}
                          {isMe && (
                            <MenuItem
                              onClick={() => {
                                navigate(`/chats`);
                                leaveRoom(channel.id);
                              }}
                            >
                              Rời nhóm
                            </MenuItem>
                          )}
                        </Menu>
                      </>
                    )}

                    {/* Nút Kết bạn nếu không phải bạn bè và không phải chính mình */}
                    {!isFriend && user.id !== me.id && (
                      <Button
                        sx={{
                          borderRadius: 2,
                          backgroundColor: "#dbebff",
                          color: "#0045ad",
                          py: 1.5,
                          px: 2,
                          fontSize: 16,
                          fontWeight: "700",
                          "&:hover": {
                            backgroundColor: "#c7e0ff",
                          },
                        }}
                      >
                        Kết bạn
                      </Button>
                    )}
                  </Box>
                }
                sx={{
                  "&:hover .MuiIconButton-root": {
                    opacity: 1,
                  },
                }}
              >
                <Avatar src={user.avatar} />
                <ListItemText
                  primary={isMe ? "Bạn" : `${user.lastName} ${user.firstName}`}
                  secondary={getRoleLabel(member.role)}
                  sx={{ marginLeft: 2 }}
                  primaryTypographyProps={{
                    fontSize: 16,
                    fontWeight: "550",
                  }}
                  secondaryTypographyProps={{
                    fontSize: 16,
                    color: "#000",
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
      <AddMember open={openAddMember} onClose={() => setOpenAddMember(false)} />
    </Drawer>
  );
};

export default GroupMembersPage;
