/* eslint-disable @typescript-eslint/no-unused-vars */
import { APP_ROUTES } from '@/constants';
import { getMe, login } from '@/services/Auth';
import { RootState } from '@/store'
import { setMe } from '@/store/slice/use.slice';
import { getValueFromLocalStorage, setValueInLocalStorage } from '@/utils/localStorage';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import useApp from '../ui/useApp';
function useAuth() {
    const userStore = useSelector((state: RootState) => state.userSlice)
    const { me } = userStore
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toggleLoading } = useApp()
    const { enqueueSnackbar } = useSnackbar();

    const handleLogin = async (phone: string, password: string) => {
        const response = await login(phone, password)
        toggleLoading(true)
        if (response.success === true) {
            dispatch(setMe(response.data.user))
            navigate(APP_ROUTES.DASHBOARD);
            setValueInLocalStorage("userId", response.data.user.id);
            setValueInLocalStorage("accessToken", response.data?.tokens?.accessToken);
            setValueInLocalStorage("refreshToken", response.data?.tokens?.refreshToken);
            enqueueSnackbar({ variant: 'success', message: "Login success" })
            toggleLoading(false)
        }
        else {
            if (response.status >= 400) {
                enqueueSnackbar({ variant: 'error', message: "Tài khoản không tồn tại" })
            }
            enqueueSnackbar({ variant: 'error', message: "Login failed" })
            toggleLoading(false)
        }
    }
    const handleGetMe = async () => {
        toggleLoading(true)
        try {
            const token = getValueFromLocalStorage("accessToken");
            if (token && (!me || !me.id)) {
                try {
                    const response: any = await getMe();
                    if (
                        response &&
                        response.success &&
                        response.data &&
                        response.data.user
                    ) {
                        dispatch(setMe(response.data.user));
                    } else {
                        handleLogout();
                    }
                } catch (error) {
                    handleLogout();
                }
            } else if (!token) {
                console.log("No token found, user needs to login");
            }
        } catch (error) {
            console.error("Error in checkAuth:", error);
        } finally {
            toggleLoading(false)

        }
    }
    const handleLoginGoogle = async () => { }

    const handleLogout = async () => {
        dispatch(setMe(null));
        setValueInLocalStorage("accessToken", "");
        setValueInLocalStorage("refreshToken", "");
        setValueInLocalStorage("userId", "");
        navigate(APP_ROUTES.USER.LOGIN);
    }
    return { me, handleGetMe, handleLoginGoogle, handleLogin, handleLogout }
}

export default useAuth