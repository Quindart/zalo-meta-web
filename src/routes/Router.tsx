import App from "@/App";
import AuthLayout from "@/components/Shared/Layout/AuthLayout";
import Layout from "@/components/Shared/Layout/Layout";
import LoginTemplate from "@/pages/auth/Login";
import LoginQRTemplate from "@/pages/auth/QR";
import ChatTemplate from "@/pages/Chat";
import ChatDetailTemplate from "@/pages/ChatDetail";
import DashBoardTemplate from "@/pages/Dashboard";
import FriendTemplate from "@/pages/Friend";
import PCLandingTemplate from "@/pages/pc";
import { createBrowserRouter } from "react-router-dom";
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
        ],
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
    Component: PCLandingTemplate,
    path: "pc",
  },
]);

export default router;
