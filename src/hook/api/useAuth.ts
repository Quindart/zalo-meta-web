import { APP_ROUTES } from '@/constants';
import { getMe, login } from '@/services/Auth';
import { RootState } from '@/store'
import { setMe } from '@/store/slice/use.slice';
import { setValueInLocalStorage } from '@/utils/localStorage';
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
            enqueueSnackbar({ variant: 'error', message: "Login failed" })
            toggleLoading(false)

        }
    }
    const handleGetMe = async () => {
        toggleLoading(true)
        try {
            const response: any = await getMe();
            if (response && response.success)
                dispatch(setMe(response.data.user));
        } catch (error) {
            console.log("💲💲💲 ~ handleGetMe ~ error:", error)
        }
        toggleLoading(false)
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