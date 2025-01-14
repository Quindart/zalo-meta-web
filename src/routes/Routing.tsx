import { Route, Routes } from "react-router-dom";
import PrivateRouting from "./PrivateRouting";
import AuthLayout from "@/components/Shared/Layout/AuthLayout";
import LoginTemplate from "@/pages/auth/Login";
import { APP_ROUTES } from "@/constants";
import ForgotPasswordTemplate from "@/pages/auth/Forgot";
import NotFoundTemplate from "@/pages/404";
import { lazy } from "react";
import LoginQRTemplate from "@/pages/auth/QR";

const DashBoardTemplate = lazy(() => import("@/pages/Dashboard"));

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRouting />}>
        <Route
          index
          path={APP_ROUTES.DASHBOARD}
          element={<DashBoardTemplate />}
        />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route
          index
          path={APP_ROUTES.USER.LOGIN_QR}
          element={<LoginQRTemplate />}
        />
        <Route index path={APP_ROUTES.USER.LOGIN} element={<LoginTemplate />} />
        <Route
          path={APP_ROUTES.USER.FORGOT}
          element={<ForgotPasswordTemplate />}
        />
      </Route>
      <Route path="*" element={<NotFoundTemplate />} />
    </Routes>
  );
}

export default Routing;
