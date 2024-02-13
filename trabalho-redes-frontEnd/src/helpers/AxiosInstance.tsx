import { TOKEN_STORAGE_KEY } from "@/contexts/UserContext";
import axios from "axios";

const AxiosInstance = axios.create({
    baseURL: "localhost:7000",
    validateStatus: () => true
});

AxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);

        if(token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
    
);

export default AxiosInstance;