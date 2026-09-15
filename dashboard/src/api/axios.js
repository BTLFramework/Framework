import axios from "axios";
import { API_URL } from "../config/api";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

export default instance;
