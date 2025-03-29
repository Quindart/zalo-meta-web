import { APP_ROUTES } from '@/constants';
import { login } from '@/services/Auth';
import { RootState } from '@/store'
import { setMe } from '@/store/slice/use.slice';
import { setValueInLocalStorage } from '@/utils/localStorage';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
function useAuth() {
    const userStore = useSelector((state: RootState) => state.userSlice)
    const { me } = userStore
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleLogin = async (phone: string, password: string) => {
        const response = await login(phone, password)
        if (response.success === true) {
            dispatch(setMe(response.data.user))
            navigate(APP_ROUTES.DASHBOARD);
            setValueInLocalStorage("userId", response.data.user.id);
            setValueInLocalStorage("accessToken", response.data?.tokens?.accessToken);
            setValueInLocalStorage("refreshToken", response.data?.tokens?.refreshToken);
            enqueueSnackbar({ variant: 'success', message: "Login success" })
        }
        else {
            enqueueSnackbar({ variant: 'error', message: "Login failed" })
        }
    }
    return { handleLogin, me }
}

export default useAuth