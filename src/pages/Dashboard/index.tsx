import { APP_ROUTES } from "@/constants";
import { removeValueInLocalStorage } from "@/utils/localStorage";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function DashBoardTemplate() {
  const navigate = useNavigate();
  const logout = () => {
    removeValueInLocalStorage("accessToken");
    navigate(APP_ROUTES.USER.LOGIN_QR);
  };
  return (
    <Box>
      DashBoard
      <Button onClick={logout}>logout</Button>
    </Box>
  );
}

export default DashBoardTemplate;
