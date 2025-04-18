import { Outlet } from "react-router";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import SidebarFooterAccount from "../Sidebar/SidebarFooterAccount";
import { Container } from "@mui/material";

export default function Layout() {
  return (
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
  );
}
