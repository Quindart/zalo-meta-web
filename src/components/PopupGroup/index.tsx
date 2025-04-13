import React, { useEffect, useState } from "react";
import { getFriends } from "@/services/Friend";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
    Box,
    Checkbox,
    Avatar,
    Typography,
    CircularProgress,
    Button,
    TextField,
    Divider
} from "@mui/material";
import { useChat } from "@/hook/api/useChat";

interface ResponseType {
    success: boolean;
    message: string;
    data: any;
}

const PopupGroup = ({ setShow }: { setShow: any }) => {
    const userStore = useSelector((state: RootState) => state.userSlice);
    const { me } = userStore;
    const [friends, setFriends] = useState<any[]>([]);
    const [loadingRender, setLoadingRender] = useState(true);
    const [selected, setSelected] = useState<string[]>([]);
    const [groupName, setGroupName] = useState(""); // Add state for group name
    const [nameError, setNameError] = useState(""); // Add state for name validation
    const { createChannel, reloadChannel } = useChat(me.id);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await getFriends(me.id) as ResponseType;
                if (response.success) {
                    setFriends(response.data);
                } else {
                    console.error("Failed to fetch friends data");
                }
            } catch (error) {
                console.error("Error fetching friends:", error);
            } finally {
                setLoadingRender(false);
            }
        };
        fetchFriends();
    }, [me.id]);

    const handleToggle = (id: string) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
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
        createChannel(groupName, selected);
    };

    useEffect(() => {
        if (reloadChannel) {
            setShow(false);
            setSelected([]);
            setGroupName("");
            setNameError("");
        }
    }, [reloadChannel]);

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

            {loadingRender ? (
                <Box display="flex" justifyContent="center" my={3}>
                    <CircularProgress size={30} />
                </Box>
            ) : friends.length === 0 ? (
                <Typography color="text.secondary" align="center" my={3}>
                    Không có bạn bè
                </Typography>
            ) : (
                <Box sx={{
                    maxHeight: 300,
                    overflowY: "auto",
                    border: "1px solid #f0f0f0",
                    borderRadius: 1,
                    p: 1
                }}>
                    {friends.map((elm) => (
                        <Box
                            key={elm.friend._id}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                                py: 1,
                                borderBottom: "1px solid #f5f5f5",
                                '&:hover': {
                                    bgcolor: '#f9f9f9'
                                }
                            }}
                        >
                            <Checkbox
                                checked={selected.includes(elm.friend._id)}
                                onChange={() => handleToggle(elm.friend._id)}
                                size="small"
                            />
                            <Avatar
                                src={elm.friend.avatar}
                                alt={elm.friend.firstName}
                                sx={{ width: 36, height: 36, mr: 1 }}
                            />
                            <Typography noWrap>
                                {elm.friend.lastName} {elm.friend.firstName}
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