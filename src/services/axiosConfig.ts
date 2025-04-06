import { getValueFromLocalStorage, setValueInLocalStorage } from "@/utils/localStorage";
import axios, { AxiosError, AxiosResponse } from "axios";

// Biến để kiểm soát việc refreshing token
let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

// Function để xử lý các request trong hàng đợi
const processQueue = (error: any, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Function để refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = JSON.parse(getValueFromLocalStorage("refreshToken") || "null");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    
    const response = await axios.post("http://localhost:5000/api/v1/auth/refresh-token", {
      refreshToken
    });
    
    const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
    
    // Lưu token mới vào localStorage
    setValueInLocalStorage("accessToken", JSON.stringify(accessToken));
    
    // Nếu API trả về refresh token mới thì cập nhật
    if (newRefreshToken) {
      setValueInLocalStorage("refreshToken", JSON.stringify(newRefreshToken));
    }
    
    return accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

const axiosConfig = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosConfig.interceptors.request.use(
  function (config) {
    const accessToken = JSON.parse(getValueFromLocalStorage("accessToken") || "null");
    
    // Thêm token vào header nếu có
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosConfig.interceptors.response.use(
  function (response: AxiosResponse) {
    return response.data;
  },
  async function (error: AxiosError) {
    const originalRequest = error.config;
    
    // Kiểm tra lỗi 401 (Unauthorized) và originalRequest có tồn tại
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      // Nếu đang refresh token thì thêm request vào hàng đợi
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosConfig(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      
      // Đánh dấu request hiện tại là đang retry
      (originalRequest as any)._retry = true;
      isRefreshing = true;
      
      try {
        const newToken = await refreshAccessToken();
        
        if (!newToken) {
          // Nếu không refresh được token, xóa các token hiện tại và reject
          setValueInLocalStorage("accessToken", "");
          setValueInLocalStorage("refreshToken", "");
          
          // Chuyển đến trang đăng nhập (cần xử lý ở App.tsx hoặc dùng middleware router)
          window.location.href = "/auth/login";
          
          processQueue(new Error('Failed to refresh token'));
          return Promise.reject(error);
        }
        
        // Cập nhật header của request gốc và các request trong hàng đợi
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        
        return axiosConfig(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosConfig;