import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Har request ke saath token automatically attach hoga
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agar token expire/invalid ho to login pe bhej do
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminInfo");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;