import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import SidebarFooterAccount from "./SidebarFooterAccount";
import type { Router, Session } from "@toolpad/core/AppProvider";
import { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { DUMMY_USER, NAVIGATION } from "@/constants";
import theme from "@/themes/ThemeMUI";
function PageContent({ pathname }: { pathname: string }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Outlet />
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

interface WindowPage {
  window?: () => Window;
}

export default function DashboardLayoutAccountSidebar(props: WindowPage) {
  const { window } = props;
  const [pathname, setPathname] = useState("/chat");
  const router = useMemo<Router>(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);
  const demoWindow = window !== undefined ? window() : undefined;
  const [session, setSession] = useState<Session | null>(DUMMY_USER);
  const authentication = useMemo(() => {
    return {
      signIn: () => {
        setSession(DUMMY_USER);
      },
      signOut: () => {
        setSession(null);
      },
    };
  }, []);

  return (
    <AppProvider
      theme={theme}
      navigation={NAVIGATION}
      router={router}
      window={demoWindow}
      authentication={authentication}
      session={session}
      branding={{
        logo: <img src="/assets/images/log-zalo.webp" />,
        title: "ZALO",
        homeUrl: "/toolpad/core/introduction",
      }}
    >
      <DashboardLayout
        slots={{
          toolbarAccount: () => null,
          sidebarFooter: SidebarFooterAccount,
        }}
      >
        <PageContent pathname={pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}
