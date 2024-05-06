"use client"

import axios, { AxiosInstance } from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";
import { TOKEN_STORAGE_KEY } from "./UserContext";


export type AxiosContextType = {
    axios: AxiosInstance;
};

export const AxiosContext = createContext<AxiosContextType | null>(null);

export const AxiosProvider = ({ children }: { children: ReactNode }) => {

    const [axiosState, setAxiosState] = useState<AxiosInstance | null>(null);

    useEffect(() => {
        if(typeof window != "undefined") {
            const instance = axios.create({
                baseURL: "http://localhost:7000/api",
                validateStatus: () => true,
            });

            instance.interceptors.request.use(
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

            setAxiosState(instance);
        }
    }, [window]);

    return(
        <AxiosContext.Provider value={{ axios: axiosState! }}>
            {children}
        </AxiosContext.Provider>
    )
}