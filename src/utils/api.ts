import { useAuth } from "@/stores/auth";
import axios, { type AxiosInstance } from "axios";

const token = useAuth().token;

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
});



const apiFormData = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: token ? `Bearer ${token}` : "",
  },
});

inception(api);
inception(apiFormData);

function inception(x: AxiosInstance) {
  x.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // useAuth().clearToken();
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
}

export { api, apiFormData };
