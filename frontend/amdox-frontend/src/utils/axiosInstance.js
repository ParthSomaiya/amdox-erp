import axios from "axios";

// MAIN API
const api = axios.create({

  baseURL:
    "http://localhost:5000/api",

});

// REQUEST INTERCEPTOR
api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;
  }

);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;

    // TOKEN EXPIRED
    if (

      error.response?.status === 401 &&
      !originalRequest._retry

    ) {

      originalRequest._retry = true;

      try {

        const refreshToken =
          localStorage.getItem(
            "refreshToken"
          );

        // REFRESH API
        const res =
          await axios.post(

            "http://localhost:5000/api/auth/refresh",

            {
              refreshToken,
            }

          );

        // SAVE NEW TOKEN
        localStorage.setItem(

          "token",

          res.data.accessToken

        );

        // UPDATE HEADER
        originalRequest.headers.Authorization =
          `Bearer ${res.data.accessToken}`;

        // RETRY REQUEST
        return api(originalRequest);

      } catch (err) {

        // LOGOUT
        localStorage.clear();

        window.location.href =
          "/login";

      }

    }

    return Promise.reject(error);

  }

);

export default api;