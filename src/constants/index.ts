export const APP_ROUTES = {
    DASHBOARD: '/',
    FILE_UPLOADED: '/files',
    USER: {
        MANAGEMENT: '/users',
        DETAIL: '/users/:userId',
        REGISTER: '/auth/register',
        PROFILE: '/profile',
        LOGIN: '/auth/login',
        LOGIN_QR: '/auth/login-qr',
        UPDATE_PASS: '/profile/update-password',
        FORGOT: '/auth/forgot-password',
    },
    USER_AUTHORIZATION: {
        MANAGEMENT: '/authorizations',
        UPDATE_ROLE: '/authorizations/change',
    },
    FORGOT_PASSWORD: '/auth/forgot-password',
    SUCCESS_MESSAGE: '/auth/success',
    NOT_FOUND: '/404',
};
