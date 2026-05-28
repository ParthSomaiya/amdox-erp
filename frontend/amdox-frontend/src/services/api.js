import axios from "axios";

// ================= API INSTANCE =================

const API = axios.create({

  baseURL:
    "http://localhost:5000/api",

  withCredentials: true,

});

// ================= REQUEST INTERCEPTOR =================

API.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem("token");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);

// ================= RESPONSE INTERCEPTOR =================

API.interceptors.response.use(

  (response) => response,

  async (error) => {

    // ================= TOKEN EXPIRED =================

    if (
      error.response?.status === 401
    ) {

      localStorage.clear();

      window.location.href =
        "/login";

    }

    return Promise.reject(error);

  }

);

export default API;