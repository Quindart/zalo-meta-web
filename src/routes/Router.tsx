import App from "@/App";
import AuthLayout from "@/components/Shared/Layout/AuthLayout";
import AuthLayoutResetPassword from "@/components/Shared/Layout/AuthLayoutResetPassWord";
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
import { ChatProvider, useChatContext } from "@/Context/ChatContextType";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import CallVideoTemplate from "@/pages/CallVideo";

const ChatWrapper = () => {
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  return (
    <ChatProvider userId={me?.id}>
      <ChatTemplate />
    </ChatProvider>
  );
};

const ChatDetailWrapper = () => {
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  return (
    <ChatProvider userId={me?.id}>
      <ChatDetailTemplate />
    </ChatProvider>
  );
};

const RightSideBarWrapper = () => {
  const userStore = useSelector((state: RootState) => state.userSlice);
  const { me } = userStore;
  const { channel, leaveRoom } = useChatContext();
  return (
    <ChatProvider userId={me?.id}>
      <RightSideBar channel={channel} leaveRoom={leaveRoom} me={me} />
    </ChatProvider>
  );
};

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "videos",
        Component: CallVideoTemplate,
      },
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
            Component: ChatWrapper,
            children: [
              {
                path: ":id",
                Component: ChatDetailWrapper,
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
        Component: RightSideBarWrapper,
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
