import axios from "axios";

const jwtToken = "jwtToken";

const backendAPI = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8080",
});

backendAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(jwtToken);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

backendAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      if (error.response.config.url !== "/user/login") {
        axiosLogout();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const axiosLogout = () => {
  localStorage.removeItem(jwtToken);
  sessionStorage.setItem("loggedOut", "true");
};

export default backendAPI;
