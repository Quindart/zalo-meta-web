import App from "@/App";
import AuthLayout from "@/components/Shared/Layout/AuthLayout";
import AuthLayoutResetPassword from "@/components/Shared/Layout/AuthLayoutResetPassWord"
import Layout from "@/components/Shared/Layout/Layout";
import LoginTemplate from "@/pages/auth/Login";
import LoginQRTemplate from "@/pages/auth/QR";
import ForgotTemplate from "@/pages/auth/Forgot";
import ChatTemplate from "@/pages/Chat";
import RightSideBar from "@/pages/ChatDetail/RighSideBar";
import ChatDetailTemplate from "@/pages/ChatDetail";
import DashBoardTemplate from "@/pages/Dashboard";
import FriendTemplate from "@/pages/Friend";
import PCLandingTemplate from "@/pages/pc";
import { createBrowserRouter } from "react-router-dom";
import ResetPasswordTemplate from "@/pages/auth/ResetPassword";
import ComponentPage from "@/pages/ComponentPage";
const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        Component: Layout,

        children: [
          {
            path: "",
            index: true,
            Component: DashBoardTemplate,
          },
          {
            path: "chats",
            Component: ChatTemplate,
            children: [
              {
                path: ":id",
                Component: ChatDetailTemplate,
              },
            ],
          },
          {
            path: "friends",
            Component: FriendTemplate,
          },
          {
            path: "components",
            Component: ComponentPage,
          },
        ],
      },
      {
        path: "right-sidebar",
        Component: RightSideBar,
      },
    ],
  },
  {
    Component: AuthLayout,
    children: [
      {
        path: "/auth",
        children: [
          {
            path: "login-qr",
            Component: LoginQRTemplate,
          },
          {
            path: "login",
            Component: LoginTemplate,
          },
        ],
      },
    ],
  },
  {
    Component: AuthLayoutResetPassword,
    path: "/auth",
    children: [
      {
        path: "forgot-password",
        Component: ForgotTemplate,
      },
      {
        path: "reset-password",
        Component: ResetPasswordTemplate,
      },
    ],
  },
  {
    Component: PCLandingTemplate,
    path: "pc",
  },
]);

export default router;
