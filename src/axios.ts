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
        logout();
      }
    }
    return Promise.reject(error);
  }
);

const logout = () => {
  localStorage.removeItem(jwtToken);
  sessionStorage.setItem("loggedOut", "true");
  window.location.href = "/login";
};

export default backendAPI;
