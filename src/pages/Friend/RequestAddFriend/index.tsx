import FriendRequestCard from "@/components/FriendRequestCard";
import SentRequestCard from "@/components/SendRequestCard";
import { Box, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import useAuth from "@/hook/api/useAuth";
import { useFriend } from "@/hook/api/useFriend";
import { useEffect } from "react";
import { useSnackbar } from "notistack";

export default function RequestAddFriend() {
  const { me } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  // ("Đồng ý kết bạn thành công");
  // ("Từ chối lời mời thành công");
  // ("Hủy gửi yêu cầu kết bạn thành công");
  const {
    getReceviedInviteFriends,
    getSendListFriends,
    receiveFriends,
    sendFriends,
    revokeInviteFriend,
    rejectInviteFriend,
    accpetFriend,
  } = useFriend(me.id);

  useEffect(() => {
    getReceviedInviteFriends();
    getSendListFriends();
  }, []);
  const handleAccept = () => {
    enqueueSnackbar({
      variant: "success",
      message: "Đồng ý kết bạn thành công",
    });
  };
  const handleReject = () => {
    enqueueSnackbar({
      variant: "success",
      message: "Từ chối lời mời thành công",
    });
  };
  const handleRevokeInvite = () => {
    enqueueSnackbar({
      variant: "success",
      message: "Hủy gửi yêu cầu kết bạn thành công",
    });
  };

  return (
    <Box>
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
        <PersonAddIcon />
        Lời mời kết bạn
      </Box>
      <Box
        px={2}
        sx={{ overflowY: "auto", height: "calc(100vh - 80px)", pb: 10 }}
      >
        <Typography mt={4} mb={3} fontWeight={600}>
          Lời mời kết bạn ({receiveFriends?.length})
        </Typography>
        {receiveFriends.length === 0 && (
          <Typography
            variant="body1"
            my={4}
            textAlign={"center"}
            color="grey.500"
          >
            Chưa có lời mời kết bạn
          </Typography>
        )}
        <Box
          display="flex"
          flexWrap={"wrap"}
          justifyContent={"start"}
          gap={"10px"}
        >
          {receiveFriends?.map((request: any) => (
            <Box width={"calc(100% / 3 - 7px)"}>
              <FriendRequestCard
                key={request.id}
                avatar={request.avatar}
                name={request.name}
                date={request.date}
                source={`request.source`}
                message={request.email}
                onAccept={() => {
                  handleAccept();
                  accpetFriend(request.id);
                }}
                onDecline={() => {
                  handleReject();
                  rejectInviteFriend(request.id);
                }}
              />
            </Box>
          ))}
        </Box>

        <Typography mt={4} mb={3} fontWeight={600}>
          Lời mời đã gửi ({sendFriends.length})
        </Typography>
        {sendFriends.length === 0 && (
          <Typography
            variant="body1"
            my={4}
            textAlign={"center"}
            color="grey.500"
          >
            Bạn chưa gửi yêu cầu kết bạn nào
          </Typography>
        )}
        <Box
          display="flex"
          flexWrap={"wrap"}
          justifyContent={"start"}
          gap={"10px"}
        >
          {sendFriends.map((request: any) => (
            <Box width={"calc(100% / 3 - 7px)"}>
              <SentRequestCard
                key={request.id}
                avatar={request.avatar}
                name={request.name}
                date={request.date}
                onCancel={() => {
                  handleRevokeInvite();
                  revokeInviteFriend(request.id);
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
