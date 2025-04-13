import axiosConfig from "./axiosConfig";

const api = "/api/v1/friends"

export const getFriends = async (userId: any) => {
    try {
        const url = `${api}/list`;
        return await axiosConfig.post(url, { userId });
    } catch (error) {
        console.error("Error fetching friends data:", error);
        return { success: false };
    }
}