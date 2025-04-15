import SocketService from "@/services/socket/SocketService";
import { useEffect, useState, useCallback } from "react";

const SOCKET_EVENTS = {
    FRIEND: {
        LIST_FRIEND: "friend:list",
        LIST_FRIEND_RESPONSE: "friend:listResponse",
    },
};

interface ResponseType {
    success: boolean;
    message: string;
    data: any;
}

export const useFriend = (currentUserId: string) => {
    const [listFriends, setListFriends] = useState<any[]>([]);
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


        socket.on(SOCKET_EVENTS.FRIEND.LIST_FRIEND_RESPONSE, listFriendsResponse);

        return () => {
            socket.off(SOCKET_EVENTS.FRIEND.LIST_FRIEND_RESPONSE, listFriendsResponse);
        };
    }, []);


    const getListFriends = useCallback(() => {
        setLoading(true);
        const socket = socketService.getSocket();
        const params = {
            userId: currentUserId,
        }
        socket.emit(SOCKET_EVENTS.FRIEND.LIST_FRIEND, params);
    }, [currentUserId]);

    return {
        listFriends,
        getListFriends,
        loading
    };

}