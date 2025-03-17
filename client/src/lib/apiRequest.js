import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://petadoption3.onrender.com",
  withCredentials: true,
});

export default apiRequest;
