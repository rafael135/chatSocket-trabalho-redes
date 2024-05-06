/*
import { TOKEN_STORAGE_KEY } from "@/contexts/UserContext";
import { SessionType } from "@/types/Cookies";
import axios from "axios";
import { cookies } from "next/headers";

const AxiosInstance = axios.create({
    baseURL: "http://localhost:7000",
    validateStatus: () => true
});

AxiosInstance.interceptors.request.use(
    (config) => {
        let cookie = cookies().get("session");

        let cookieJson: SessionType | null = null;

        if(cookie) {
            cookieJson = JSON.parse(cookie.value) as SessionType;
        }


        const token = cookieJson?.token || "INVALID";

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
*/

import axios from 'axios'

const baseURL = "http://localhost:7000/api"
    , isServer = typeof window === 'undefined'

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    validateStatus: () => true
})

api.interceptors.request.use(async config => {

    if (isServer) {

        const { cookies } = (await import('next/headers'))
            , token = cookies().get('token')?.value

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    else {

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1')

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
    }

    return config
}, (error) => { return Promise.reject(error); })

export default api