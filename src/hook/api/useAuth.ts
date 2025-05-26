import { APP_ROUTES } from '@/constants';
import { getMe, login } from '@/services/Auth';
import { RootState } from '@/store'
import { setMe } from '@/store/slice/use.slice';
import { getValueFromLocalStorage, setValueInLocalStorage } from '@/utils/localStorage';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import useApp from '../ui/useApp';
import { useCallback } from 'react';
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
    const handleLoginGoogle = async () => {
        try {
            const backendUrl = `${process.env.VITE_API_URL}`
            console.log("Check backendUrl:", backendUrl);

            window.location.href = `https://zalo-api.quindart.shop/api/v1/auth/google-login`;
        } catch (error) {
            console.error("Error initiating Google login:", error);
            throw error;
        }
    }
    // Thêm function xử lý Google callback
    const handleGoogleCallback = useCallback(async (searchParams: URLSearchParams) => {
        toggleLoading(true);
        try {
            const success = searchParams.get('success');
            const error = searchParams.get('error');
            const accessToken = searchParams.get('accessToken');
            const refreshToken = searchParams.get('refreshToken');
            const userData = searchParams.get('userData');

            if (error) {
                let errorMessage = 'Đăng nhập Google thất bại';
                switch (error) {
                    case 'server_error':
                        errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
                        break;
                    case 'auth_failed':
                        errorMessage = 'Xác thực Google không thành công.';
                        break;
                    case 'token_error':
                        errorMessage = 'Lỗi tạo token. Vui lòng thử lại.';
                        break;
                }
                enqueueSnackbar({ variant: 'error', message: errorMessage });
                navigate(APP_ROUTES.USER.LOGIN);
                return;
            }

            if (success === 'true' && accessToken && refreshToken && userData) {
                try {
                    // Parse user data
                    const userDataParsed = JSON.parse(decodeURIComponent(userData));

                    // Lưu tokens vào localStorage
                    setValueInLocalStorage("accessToken", accessToken);
                    setValueInLocalStorage("refreshToken", refreshToken);
                    setValueInLocalStorage("userId", userDataParsed.id);

                    // Cập nhật Redux store
                    dispatch(setMe(userDataParsed));

                    // Hiển thị thông báo thành công
                    enqueueSnackbar({
                        variant: 'success',
                        message: `Chào mừng ${userDataParsed.firstName}! Đăng nhập thành công.`
                    });

                    // Chuyển hướng đến dashboard
                    navigate(APP_ROUTES.DASHBOARD);

                } catch (parseError) {
                    console.error('Error parsing user data:', parseError);
                    enqueueSnackbar({ variant: 'error', message: 'Có lỗi xảy ra khi xử lý thông tin đăng nhập.' });
                    navigate(APP_ROUTES.USER.LOGIN);
                }
            } else if (success || accessToken || refreshToken || userData) {
                // Có một số params nhưng không đầy đủ
                enqueueSnackbar({ variant: 'error', message: 'Thông tin đăng nhập không đầy đủ.' });
                navigate(APP_ROUTES.USER.LOGIN);
            }
            // Nếu không có params gì thì không làm gì (normal page load)

        } catch (error) {
            console.error('Error in handleGoogleCallback:', error);
            enqueueSnackbar({ variant: 'error', message: 'Có lỗi xảy ra khi xử lý đăng nhập.' });
            navigate(APP_ROUTES.USER.LOGIN);
        } finally {
            toggleLoading(false);
        }
    }, [toggleLoading, enqueueSnackbar, navigate, dispatch]);
    const handleLogout = async () => {
        dispatch(setMe(null));
        setValueInLocalStorage("accessToken", "");
        setValueInLocalStorage("refreshToken", "");
        setValueInLocalStorage("userId", "");
        navigate(APP_ROUTES.USER.LOGIN);
    }
    return { me, handleGetMe, handleLoginGoogle, handleLogin, handleLogout, handleGoogleCallback }
}

export default useAuth