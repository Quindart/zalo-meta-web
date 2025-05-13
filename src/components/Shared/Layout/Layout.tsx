import { Outlet } from "react-router";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import SidebarFooterAccount from "../Sidebar/SidebarFooterAccount";
import { Box, Container } from "@mui/material";
import useApp from "@/hook/ui/useApp";
import GlobalLoading from "@/components/GlobalLoading";

export default function Layout() {
  const { loading } = useApp();
  return (
    <>
      {loading && <GlobalLoading />}
      <Box>
        <DashboardLayout
          slots={{
            toolbarAccount: () => null,
            sidebarFooter: SidebarFooterAccount,
          }}
          defaultSidebarCollapsed={false}
          disableCollapsibleSidebar={true}
          sidebarExpandedWidth={64}
          sx={{
            "MuiToolbar-root": {
              minHeight: 20,
            },
            position: "fixed",
            top: 0,
          }}
        >
          <Container
            sx={{
              maxWidth: "100vw!important",
              p: "0px!important",
            }}
          >
            <Outlet />
          </Container>
        </DashboardLayout>
      </Box>
    </>
  );
}
