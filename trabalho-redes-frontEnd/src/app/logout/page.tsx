"use client"
import { UserContext } from "@/contexts/UserContext"
//import { cookies } from "next/headers"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import { useContext, useLayoutEffect } from "react"



const Logout = () => {
    
    const userCtx = useContext(UserContext)!;
    const router = useRouter();

    useLayoutEffect(() => {
        userCtx.setToken("");
        userCtx.setUser(null);

        setTimeout(() => {
            router.push("/");
        }, 800);
    }, []);
    

    return <></>
}

export default Logout;