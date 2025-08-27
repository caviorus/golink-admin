import { useAuth } from "@/stores/auth";
import axios from "axios";

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

export { api, apiFormData };
