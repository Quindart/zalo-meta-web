import axiosConfig from "./axiosConfig";

const api = "/api/v1/auth"

export const login = async (phone: string, password: string): Promise<any> => {
    return await axiosConfig.post(`${api}/login`, { phone, password });
}

export const verifyOTP = async (OTP: string, email: string): Promise<any> => {
    try {
        const url = `${api}/verify-forgot-password`;
        return await axiosConfig.post(url, { email, otp: OTP });
    } catch (error: any) {
        console.error("Error fetching user data:", error);
        return error?.response.data;
    }
}
export const sendOTP = async (email: string): Promise<any> => {
    try {
        const url = `${api}/forgot-password`;
        return await axiosConfig.post(url, { email });
    } catch (error: any) {
        console.error("Error fetching user data:", error);
        return error?.response.data;
    }
}
export const resetPassword = async (email: string, password: string, resetToken: string): Promise<any> => {
    try {
        const url = `${api}/reset-password`;
        return await axiosConfig.post(url, { email, password, resetToken });
    } catch (error: any) {
        console.error("Error fetching user data:", error);
        return error?.response.data;
    }
}
