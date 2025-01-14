import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import HeaderDashBoard from "../HeaderDashBoard";
import Sidebar from "../Sidebar";

function MainLayout() {
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Sidebar />
      <Box>
        <HeaderDashBoard />
        MainLayout
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
