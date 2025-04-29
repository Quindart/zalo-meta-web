import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet } from "react-router";
import { BRANDING, NAVIGATION } from "./constants";
import theme from "./themes/ThemeMUI";
import { useMemo, useEffect } from "react";
import useAuth from "./hook/api/useAuth";
import { ChatProvider } from "./Context/ChatContextType";

export default function App() {
  const { handleGetMe, handleLogout, me } = useAuth();

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
        return true;
      },
      signOut: async () => handleLogout(),
    };
  }, [handleLogout]);

  return (
    <ReactRouterAppProvider
      theme={theme}
      navigation={NAVIGATION}
      branding={BRANDING}
      authentication={authentication}
      session={session}
    >
      <ChatProvider userId={me?.id}>
        <Outlet />
      </ChatProvider>
    </ReactRouterAppProvider>
  );
}
