"use client"

import { UserContext } from "@/contexts/UserContext";
//import { redirect } from "next/navigation";
import { ReactNode, useContext } from "react";



const ProtectRoute = ({ children }: { children: ReactNode }) => {

    const userCtx = useContext(UserContext)!;

    //if(userCtx.user == null || userCtx.user.token == null) {
    //    redirect("/login");
    //}

    return (
        <>
            {children}
        </>
    );
}

export default ProtectRoute;