import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet, useNavigate } from "react-router";
import { BRANDING, NAVIGATION } from "./constants";
import theme from "./themes/ThemeMUI";
import { useMemo, useState } from "react";

const demoSession = {
  user: {
    name: "Le Minh Quang",
    email: "lmqiuhdev@gmail.com",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg",
  },
};

export default function App() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any | null>(demoSession);
  const authentication = useMemo(() => {
    return {
      signIn: () => {
      },
      signOut: () => {
        navigate("/auth/login");
        setSession(null);
      },
    };
  }, []);
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
