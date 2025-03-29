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
export const findUserByPhone = async (phone: string): Promise<any> => {
    try {
        const queries = "?queries=email,_id";
        const url = `${api}/phone/${phone}${queries}`;
        return await axiosConfig.get(url);
    } catch (error: any) {
        console.error("Error finding user by phone:", error);
        return error?.response?.data;
    }
};