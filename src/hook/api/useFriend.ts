import SocketService from "@/services/socket/SocketService";
import { RootState } from "@/store";
import { setReceiveFriends, setSendFriends } from "@/store/slice/use.slice";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const SOCKET_EVENTS = {
    FRIEND: {
        ADD_FRIEND: "friend:add",
        ADD_FRIEND_RESPONSE: "friend:addResponse",
        REMOVE_FRIEND: "friend:remove",
        REMOVE_FRIEND_RESPONSE: "friend:removeResponse",
        ACCEPT_FRIEND: "friend:accept",
        ACCEPT_FRIEND_RESPONSE: "friend:acceptResponse",
        REJECT_FRIEND: "friend:reject",
        REJECT_FRIEND_RESPONSE: "friend:rejectResponse",
        REVOKE_FRIEND: "friend:revoke",
        REVOKE_FRIEND_RESPONSE: "friend:revokeResponse",

        LIST_FRIEND: "friend:list",
        LIST_FRIEND_RESPONSE: "friend:listResponse",

        LIST_SEND_INVITE: "friend:listSendInvite",
        LIST_SEND_INVITE_RESPONSE: "friend:listSendInviteResponse",

        LIST_RECEIVED_INVITE: "friend:listReceviedInvite",
        LIST_RECEIVED_INVITE_RESPONSE: "friend:listReceviedInviteResponse",
    },
};

interface ResponseType {
    success: boolean;
    message: string;
    data: any;
}

export const useFriend = (currentUserId: string) => {
    //TODO: store
    const userStore = useSelector((state: RootState) => state.userSlice)
    const { receiveFriends, sendFriends } = userStore

    const dispatch = useDispatch();
    const [listFriends, setListFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const socketService = SocketService.getInstance(currentUserId).getSocket();

    useEffect(() => {
        if (!socketService.connected) {
            socketService.connect();
        }
        const listFriendsResponse = (response: ResponseType) => {
            if (response.success) {
                setListFriends(response.data);
                setLoading(false);
            } else {
                console.error("Failed to load friend list:", response.message);
            }
        };
        const inviteListFriendsResponse = (response: ResponseType) => {
            if (response.success) {
                dispatch(setReceiveFriends(response.data));
            } else {
                console.error("Failed to load invite friend list:", response.message);
            }
        };

        const sendListFriendsResponse = (response: ResponseType) => {
            if (response.success) {
                dispatch(setSendFriends(response.data));
            } else {
                console.error("Failed to load invite friend list:", response.message);
            }
        };


        const handleResponseFromFriendEvent = (response: ResponseType) => {
            if (!(response.success && response.data)) {
                return
            }
            console.log("💲💲💲 ~ handleResponseFromFriendEvent ~  response.data:", response.data)

            if (Object.prototype.hasOwnProperty.call(response.data, "receiverList")) {
                dispatch(setReceiveFriends(response.data.receiverList));
            }

            else if (Object.prototype.hasOwnProperty.call(response.data, "senderList")) {
                dispatch(setSendFriends(response.data.senderList));
            }

            if (Object.prototype.hasOwnProperty.call(response.data, "friends")) {
                setListFriends(response.data.friends);
            }
        }

        socketService.on(SOCKET_EVENTS.FRIEND.LIST_FRIEND_RESPONSE, listFriendsResponse);
        socketService.on(SOCKET_EVENTS.FRIEND.LIST_RECEIVED_INVITE_RESPONSE, inviteListFriendsResponse);
        socketService.on(SOCKET_EVENTS.FRIEND.LIST_SEND_INVITE_RESPONSE, sendListFriendsResponse);


        socketService.on(SOCKET_EVENTS.FRIEND.ADD_FRIEND_RESPONSE, handleResponseFromFriendEvent);
        socketService.on(SOCKET_EVENTS.FRIEND.ACCEPT_FRIEND_RESPONSE, handleResponseFromFriendEvent);
        socketService.on(SOCKET_EVENTS.FRIEND.REJECT_FRIEND_RESPONSE, handleResponseFromFriendEvent);
        socketService.on(SOCKET_EVENTS.FRIEND.REVOKE_FRIEND_RESPONSE, handleResponseFromFriendEvent);

        return () => {
            socketService.off(SOCKET_EVENTS.FRIEND.LIST_FRIEND_RESPONSE, listFriendsResponse);
            socketService.off(SOCKET_EVENTS.FRIEND.LIST_RECEIVED_INVITE_RESPONSE, inviteListFriendsResponse);
            socketService.off(SOCKET_EVENTS.FRIEND.LIST_SEND_INVITE_RESPONSE, sendListFriendsResponse);

            socketService.off(SOCKET_EVENTS.FRIEND.ADD_FRIEND_RESPONSE, handleResponseFromFriendEvent);
            socketService.off(SOCKET_EVENTS.FRIEND.ACCEPT_FRIEND_RESPONSE, handleResponseFromFriendEvent);
            socketService.off(SOCKET_EVENTS.FRIEND.REJECT_FRIEND_RESPONSE, handleResponseFromFriendEvent);
            socketService.off(SOCKET_EVENTS.FRIEND.REVOKE_FRIEND_RESPONSE, handleResponseFromFriendEvent);

        };
    }, [socketService]);


    const getListFriends = useCallback(() => {
        setLoading(true);
        const params = {
            userId: currentUserId,
        }
        socketService.emit(SOCKET_EVENTS.FRIEND.LIST_FRIEND, params);
    }, [currentUserId]);


    const getReceviedInviteFriends = useCallback(() => {
        socketService.emit(SOCKET_EVENTS.FRIEND.LIST_RECEIVED_INVITE, { userId: currentUserId });
    }, []);

    const getSendListFriends = useCallback(() => {
        socketService.emit(SOCKET_EVENTS.FRIEND.LIST_SEND_INVITE, { userId: currentUserId });
    }, [currentUserId]);

    const inviteFriend = useCallback((userFriendId: string) => {
        const params = {
            userId: currentUserId,
            userFriendId: userFriendId,
        }
        socketService.emit(SOCKET_EVENTS.FRIEND.ADD_FRIEND, params);
    }, [currentUserId]);

    const rejectInviteFriend = useCallback((userFriendId: string) => {
        socketService.emit(SOCKET_EVENTS.FRIEND.REJECT_FRIEND, {
            userId: currentUserId,
            userFriendId: userFriendId,
        });
    }, [currentUserId])

    const revokeInviteFriend = useCallback((userFriendId: string) => {
        socketService.emit(SOCKET_EVENTS.FRIEND.REVOKE_FRIEND, {
            userId: currentUserId,
            userFriendId: userFriendId,
        });
    }, [currentUserId])

    const removeFriend = useCallback((userFriendId: string) => {
        socketService.emit(SOCKET_EVENTS.FRIEND.REMOVE_FRIEND, {
            userId: currentUserId,
            userFriendId: userFriendId,
        })
    }, [currentUserId]);

    const accpetFriend = useCallback((userFriendId: string) => {
        socketService.emit(SOCKET_EVENTS.FRIEND.ACCEPT_FRIEND, {
            userId: currentUserId,
            userFriendId: userFriendId,
        });
    }, [currentUserId]);

    return {
        listFriends,
        receiveFriends,
        sendFriends,
        inviteFriend,
        removeFriend,
        revokeInviteFriend,
        accpetFriend,
        getListFriends,
        getReceviedInviteFriends,
        getSendListFriends,
        rejectInviteFriend,
    };

}