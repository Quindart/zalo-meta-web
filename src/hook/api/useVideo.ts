import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useRef } from "react";
import useAuth from "./useAuth";
import { useSearchParams } from "react-router-dom";
import { useChat } from "./useChat";

function generateToken(tokenServerUrl: string, appID: number, userID: string) {
    return fetch(tokenServerUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            app_id: appID,
            user_id: userID,
        }),
    }).then(async (res) => {
        const result = await res.text();
        return result;
    });
}

const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
const tokenServerUrl = import.meta.env.VITE_ZEGO_TOKEN_SERVER_URL;

function useVideo() {
    const { me } = useAuth();
    const { sendMessage } = useChat(me.id);

    const containerRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<any>(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const chatId = searchParams.get("chatId")
    const rawroomId = searchParams.get("roomId");

    const generatedroomId = String(Math.floor(Math.random() * 10000));
    const roomId = rawroomId || generatedroomId;

    const userID = String(me?.id || Math.floor(Math.random() * 10000));
    const userName = `${me?.firstName || "Guest"} ${me?.lastName || userID}`;

    const initCall = async () => {
        try {
            const token = await generateToken(tokenServerUrl, appID, userID);
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
                appID,
                token,
                roomId,
                userID,
                userName
            );
            const zp = ZegoUIKitPrebuilt.create(kitToken);
            instanceRef.current = zp;

            if (containerRef.current) {
                zp.joinRoom({
                    container: containerRef.current,
                    sharedLinks: [
                        {
                            name: "ZALO META VIDEO CALL",
                            url: `${window.location.origin}${window.location.pathname}?roomId=${roomId}&chatId=${chatId}`,
                        },
                    ],
                    scenario: {
                        mode: ZegoUIKitPrebuilt.GroupCall,
                    },
                    turnOnMicrophoneWhenJoining: true,
                    turnOnCameraWhenJoining: true,
                    showMyCameraToggleButton: true,
                    showMyMicrophoneToggleButton: true,
                    showAudioVideoSettingsButton: true,
                    showScreenSharingButton: true,
                    showTextChat: true,
                    showUserList: true,
                    maxUsers: 50,
                    layout: "Grid",
                    showLayoutButton: true,
                });
                sendMessage(`${chatId}`, `Welcome to the video call ROOM ID: ${roomId}`);
            } else {
                console.error("containerRef.current is null");
            }
            if (!rawroomId) {
                setSearchParams(prevParams => {
                    return { ...prevParams, roomId, chatId: chatId };
                });
            }

        } catch (error) {
            console.error("🚨 Error in initCall:", error);
        }
    };

    return {
        roomId,
        userID,
        userName,
        containerRef,
        instanceRef,
        initCall,
        chatId,
    };
}

export default useVideo;
