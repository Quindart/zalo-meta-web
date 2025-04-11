import { Navigation } from "@toolpad/core/AppProvider";
import RecentActorsRoundedIcon from "@mui/icons-material/RecentActorsRounded";
import { Chip } from "@mui/material";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
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
  RESET_PASSWORD: '/auth/reset-password',
  FORGOT_PASSWORD: "/auth/forgot-password",
  SUCCESS_MESSAGE: "/auth/success",
  NOT_FOUND: "/404",
};

export const NAVIGATION: Navigation = [
  {
    segment: "chats",
    title: "Chat",
    icon: <QuestionAnswerRoundedIcon />,

    action: <Chip label={7} color="primary" size="small" />,
  },
  {
    segment: "friends",
    title: "Danh sách bạn bè",
    icon: <RecentActorsRoundedIcon />,
  },
];

export const BRANDING = {
  title: "Meta",
  logo: <img src="/assets/images/logo-zalo.webp" />,
  homeUrl: "/chats",
};

export const DUMMY_USER = {
  user: {
    name: "Bharat Kashyap",
    email: "bharatkashyap@outlook.com",
    image: "https://avatars.githubusercontent.com/u/19550456",
  },
};
