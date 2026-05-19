import axios from "axios";

const api = axios.create({

  baseURL:
    "http://localhost:5000/api",

});

// 🔥 REQUEST INTERCEPTOR
api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {

      config.headers.Authorization =
        token;

    }

    return config;

  }

);

// 🔥 RESPONSE INTERCEPTOR
api.interceptors.response.use(

  (response) =>
    response,

  async (error) => {

    if (
      error.response?.status === 401
    ) {

      localStorage.clear();

      window.location.href =
        "/login";

    }

    return Promise.reject(
      error
    );

  }

);

export default api;