import SocketService from "@/services/socket/SocketService";
import { useEffect, useState, useCallback } from "react";

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

        LIST_FRIEND: "friend:list",
        LIST_FRIEND_RESPONSE: "friend:listResponse",

        LIST_SEND_INVITE: "friend:listSendInvite",
        LIST_SEND_INVITE_RESPONSE: "friend:listSendInvite",

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
    const [listFriends, setListFriends] = useState<any[]>([]);
    const [sendFriends, setSendFriends] = useState<any[]>([]);
    const socketService = SocketService.getInstance(currentUserId);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const socket = socketService.getSocket();
        if (!socket.connected) {
            socket.connect();
        }
        console.log("Socket connected:", socket.connected);

        const listFriendsResponse = (response: ResponseType) => {
            if (response.success) {
                setListFriends(response.data);
                setLoading(false);
            }
            else {
                console.error("Failed to load friend list:", response.message);
            }
        }

        //TODO: inviteListFriendsResponse
        const inviteListFriendsResponse = (response: ResponseType) => {
            if (response.success) {
                setSendFriends(response.data);
            }
            else {
                console.error("Failed to load invite friend list:", response.message);
            }
        }


        socket.on(SOCKET_EVENTS.FRIEND.LIST_FRIEND_RESPONSE, listFriendsResponse);
        socket.on(SOCKET_EVENTS.FRIEND.LIST_RECEIVED_INVITE_RESPONSE, inviteListFriendsResponse);


        return () => {
            socket.off(SOCKET_EVENTS.FRIEND.LIST_FRIEND_RESPONSE, listFriendsResponse);
            socket.off(SOCKET_EVENTS.FRIEND.LIST_RECEIVED_INVITE_RESPONSE, inviteListFriendsResponse);
        };
    }, []);

    useEffect(() => {

    }, [listFriends, sendFriends]);

    const getListFriends = useCallback(() => {
        setLoading(true);
        const socket = socketService.getSocket();
        const params = {
            userId: currentUserId,
        }
        socket.emit(SOCKET_EVENTS.FRIEND.LIST_FRIEND, params);
    }, [currentUserId]);


    const getSendFriends = useCallback(() => {
        const socket = socketService.getSocket();
        socket.emit(SOCKET_EVENTS.FRIEND.LIST_SEND_INVITE, { userId: currentUserId });
    }, [currentUserId]);

    const inviteFriend = useCallback((userFriendId: string) => {
        const socket = socketService.getSocket();
        const params = {
            userId: currentUserId,
            userFriendId: userFriendId,
        }
        socket.emit(SOCKET_EVENTS.FRIEND.ADD_FRIEND, params);

    }, [currentUserId]);


    const accpetFriend = useCallback((userFriendId: string) => {
        const socket = socketService.getSocket();
        const params = {
            userId: currentUserId,
            userFriendId: userFriendId,
        }
        socket.emit(SOCKET_EVENTS.FRIEND.ACCEPT_FRIEND, params);

    }, [currentUserId]);

    return {
        listFriends,
        sendFriends,
        inviteFriend,
        accpetFriend,
        getListFriends,
};

}