import axios from "axios";

// ==============================
// BASE API INSTANCE
// ==============================

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  timeout: 15000, // prevent hanging requests
});

// ==============================
// REQUEST INTERCEPTOR
// ==============================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => {
    return Promise.reject({
      message: "Request configuration error",
      error,
    });
  }
);

// ==============================
// RESPONSE INTERCEPTOR
// ==============================

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ================= 401 HANDLING =================
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token found");
        }

        // optional: try refresh token API
        const res = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {
            refreshToken,
          }
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("token", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);

        localStorage.clear();
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    // ================= NETWORK ERROR =================
    if (!error.response) {
      return Promise.reject({
        message: "Network error - server not reachable",
      });
    }

    // ================= NORMAL ERROR =================
    return Promise.reject({
      message:
        error.response?.data?.message ||
        "Something went wrong",
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default API;