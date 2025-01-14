import { Navigate } from "react-router-dom";
import { getValueFromLocalStorage } from "../utils/localStorage";
import MainLayout from "@/components/Shared/Layout/MainLayout";
import { APP_ROUTES } from "@/constants";

function PrivateRouting() {
  const accessToken = getValueFromLocalStorage("accessToken");
  return accessToken ? <MainLayout /> : <Navigate to={APP_ROUTES.PC} />;
}

export default PrivateRouting;
