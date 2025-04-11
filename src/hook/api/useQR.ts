import { APP_ROUTES } from "@/constants";
import { generateQR } from "@/services/QR"
import SocketService from "@/services/socket/SocketService";
import { setMe } from "@/store/slice/use.slice";
import { setValueInLocalStorage } from "@/utils/localStorage";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const SOCKET_EVENTS = {
    QR: {
        VERIFY: 'qr:verify',
        ACCEPTED_LOGIN: 'qr:accpeted-login',
    }
};

const socketService = SocketService.getInstance().getSocket();

function useQR() {
    const { enqueueSnackbar } = useSnackbar()
    const [image, setImage] = useState<string>("");
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const handleGenerateQR = async () => {
        const response: any = await generateQR()
        if (!response.success) {
            return false
        }
        setImage(response.url);
    }

    useEffect(() => {
        socketService.connect();
        socketService.off(SOCKET_EVENTS.QR.ACCEPTED_LOGIN);
        socketService.off(SOCKET_EVENTS.QR.VERIFY);

        socketService.on(SOCKET_EVENTS.QR.ACCEPTED_LOGIN, (data: any) => {
            dispatch(setMe(data.user))
            setValueInLocalStorage("userId", data.user.id);
            setValueInLocalStorage("accessToken", data?.tokens?.accessToken);
            setValueInLocalStorage("refreshToken", data?.tokens?.refreshToken);
            enqueueSnackbar({ variant: 'success', message: "Login success" })
            navigate(APP_ROUTES.DASHBOARD);
        });
        handleGenerateQR();
        return () => {
            handleGenerateQR()
            socketService.disconnect()
            socketService.off(SOCKET_EVENTS.QR.ACCEPTED_LOGIN);
            socketService.off(SOCKET_EVENTS.QR.VERIFY);
        };
    }, [socketService]);



    return {
        TIMELIVE_QR: 180000,
        image,
        handleGenerateQR
    }
}

export default useQR