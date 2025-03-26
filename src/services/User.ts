import axiosConfig from "./axiosConfig";

const api = "/api/v1/users/"

export const getMe = async (userId: any) => {
    try {
        const url = `${api}/${userId}`;
        return await axiosConfig.get(url);
    } catch (error) {
        console.error("Error fetching user data:", error);
        return { success: false };
    }
};