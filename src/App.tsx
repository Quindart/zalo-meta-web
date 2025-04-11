import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet, useNavigate } from "react-router";
import { BRANDING, NAVIGATION } from "./constants";
import theme from "./themes/ThemeMUI";
import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { setMe } from "./store/slice/use.slice";
import {
  getValueFromLocalStorage,
  setValueInLocalStorage,
} from "./utils/localStorage";
import { APP_ROUTES } from "./constants";
import { getMe } from "./services/Auth";
import { Box } from "@mui/material";
import useAuth from "./hook/api/useAuth";

export default function App() {
  const { handleGetMe } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  const [loading, setLoading] = useState(true);
  const [initDone, setInitDone] = useState(false);

  const session = me
    ? {
        user: {
          name:
            me?.lastName && me?.firstName
              ? `${me.lastName} ${me.firstName}`
              : "User",
          email: me?.phone || "",
          image: me?.avatar || "https://via.placeholder.com/150",
        },
      }
    : null;

  useEffect(() => {
    handleGetMe();
  }, []);
  const authentication = useMemo(() => {
    return {
      signIn: async () => {
        console.log("Sign in request received");
        return true;
      },
      signOut: () => {
        dispatch(setMe(null));
        setValueInLocalStorage("accessToken", "");
        setValueInLocalStorage("refreshToken", "");
        setValueInLocalStorage("userId", "");
        navigate(APP_ROUTES.USER.LOGIN);
      },
    };
  }, [dispatch, navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking authentication...");
      setLoading(true);
      try {
        const token = getValueFromLocalStorage("accessToken");

        if (token && (!me || !me.id)) {
          console.log("Found token, fetching user data");

          try {
            const response = await getMe();
            console.log("getMe response:", response);

            if (
              response &&
              response.success &&
              response.data &&
              response.data.user
            ) {
              console.log("Setting user data:", response.data.user);
              dispatch(setMe(response.data.user));
            } else {
              console.log("Invalid token, logging out");
              authentication.signOut();
            }
          } catch (error) {
            console.error("Failed to fetch user data:", error);
            authentication.signOut();
          }
        } else if (!token) {
          console.log("No token found, user needs to login");
        }
      } catch (error) {
        console.error("Error in checkAuth:", error);
      } finally {
        setLoading(false);
        setInitDone(true);
      }
    };

    if (!initDone) {
      checkAuth();
    }
  }, [initDone, dispatch, authentication, me]);

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <ReactRouterAppProvider
      theme={theme}
      navigation={NAVIGATION}
      branding={BRANDING}
      authentication={authentication}
      session={session}
    >
      <Outlet />
    </ReactRouterAppProvider>
  );
}
