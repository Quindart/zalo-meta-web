import axiosConfig from "./axiosConfig";

export const generateQR = async () => {
    return await axiosConfig.post('api/v1/auth/QR');
}
