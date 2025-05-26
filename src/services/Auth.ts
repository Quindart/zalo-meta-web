import axiosConfig from "./axiosConfig";
import { getValueFromLocalStorage } from "@/utils/localStorage";

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


export const getMe = async () => {
  try {
    const token = getValueFromLocalStorage("accessToken");

    if (!token) {
      return { success: false, message: "No token found" };
    }

    // Token sẽ tự động được thêm vào header bởi axiosConfig interceptors
    const response = await axiosConfig.get("/api/v1/me?queries=firstName,lastName,email,avatar,id,phone,dateOfBirth");

    return { success: true, data: response, message: "User data fetched successfully" };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { success: false, message: "Failed to fetch user data", data: null };
  }
};

export const logout = async () => {
  try {
    const response = await axiosConfig.post(`${api}/logout`);
    return response;
  } catch (error) {
    console.error("Error logging out:", error);
    return { success: false };
  }
};