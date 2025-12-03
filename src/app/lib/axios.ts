/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

// ----------------------------------------------------------------------


// 
export const AGENT_API = "http://127.0.0.1:8000/";


// export const AGENT_API = 'https://vector-backend-8isl.onrender.com'


const axiosAdmin = axios.create({
  baseURL: AGENT_API,
});

axiosAdmin.interceptors.request.use(
  (config: any) => {
    if (config?.url !== "/" && !config?.url?.includes("/register")) {
      const storage = localStorage.getItem("auth-storage");
      let token: string | null = null;

      if (storage) {
        try {
          const parsed = JSON.parse(storage);
          token = parsed?.state?.access ?? null;
        } catch (err) {
          console.error("Failed to parse auth-storage:", err);
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: string) => Promise.reject(error)
);

axiosAdmin.interceptors.response.use(
  (response: any) => response,
  (error: any) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export { axiosAdmin };
