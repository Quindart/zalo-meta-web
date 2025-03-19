import axiosConfig from "./axiosConfig";

const api = "/api/v1/auth"

export const login = async (phone: string, password: string): Promise<any> => {
    return await axiosConfig.post(`${api}/login`, { phone, password });
}