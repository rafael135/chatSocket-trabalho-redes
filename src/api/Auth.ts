"use client"

import { AxiosContextType } from "@/contexts/AxiosContext";
//import AxiosInstance from "@/helpers/AxiosInstance";
import { User } from "@/types/User";
import { AxiosInstance } from "axios";


type RegisterProps = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const register = async (axiosCtx: AxiosContextType, data: RegisterProps) => {
    type RegisterResponse = {
        user: User;
        token: string;
        status: number;
    };

    let res: RegisterResponse = await axiosCtx.axios.post("/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
    });

    if(res.status == 400) {
        
    }
}