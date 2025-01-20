import { Navigation } from "@toolpad/core/AppProvider";
import ChatIcon from "@mui/icons-material/Chat";
import BallotIcon from "@mui/icons-material/Ballot";

export const APP_ROUTES = {
  DASHBOARD: "/",
  FILE_UPLOADED: "/files",
  PC: "/pc",
  CHAT: "/chat",
  FRIEND: "/friends",
  USER: {
    MANAGEMENT: "/users",
    DETAIL: "/users/:userId",
    REGISTER: "/auth/register",
    PROFILE: "/profile",
    LOGIN: "/auth/login",
    LOGIN_QR: "/auth/login-qr",
    UPDATE_PASS: "/profile/update-password",
    FORGOT: "/auth/forgot-password",
  },
  USER_AUTHORIZATION: {
    MANAGEMENT: "/authorizations",
    UPDATE_ROLE: "/authorizations/change",
  },
  FORGOT_PASSWORD: "/auth/forgot-password",
  SUCCESS_MESSAGE: "/auth/success",
  NOT_FOUND: "/404",
};
export const NAVIGATION: Navigation = [
  {
    segment: APP_ROUTES.CHAT,
    title: "Chat",
    icon: <ChatIcon />,
  },
  {
    segment: APP_ROUTES.FRIEND,
    title: "Danh sách bạn bè",
    icon: <BallotIcon />,
  },
];

export const DUMMY_USER = {
  user: {
    name: "Bharat Kashyap",
    email: "bharatkashyap@outlook.com",
    image: "https://avatars.githubusercontent.com/u/19550456",
  },
};
