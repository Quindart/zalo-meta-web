import { getValueFromLocalStorage } from "@/utils/localStorage";
import axios from "axios";
const axiosConfig = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${JSON.parse(getValueFromLocalStorage("accessToken"))}`,
  },
});
axiosConfig.interceptors.request.use(
  function (config) {
    const accessToken = JSON.parse(getValueFromLocalStorage("accessToken"));
    console.log(accessToken);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);
axiosConfig.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  },
);
export default axiosConfig;
