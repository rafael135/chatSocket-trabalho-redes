"use client"
import { UserContext } from "@/contexts/UserContext"
//import { cookies } from "next/headers"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import { useContext, useEffect, useLayoutEffect } from "react"



const Logout = () => {
    
    const userCtx = useContext(UserContext)!;
    const router = useRouter();

    useLayoutEffect(() => {
        //console.log("Entrou");
        if(userCtx.initialized == true) {
            userCtx.setToken("");
            userCtx.setUser(null);

            setTimeout(() => {
                router.push("/");
            }, 1000);
        }
        

        
    }, [userCtx.initialized]);

    return(
        <div>

        </div>
    );
}

export default Logout;