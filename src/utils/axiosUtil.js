import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://evelyne.adaptable.app",
});

export default axiosInstance;
