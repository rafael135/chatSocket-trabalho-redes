"use client"

import { UserContext } from "@/contexts/UserContext";
import { redirect } from "next/navigation";
import { ReactNode, useContext } from "react";



const ProtectRoute = ({ children }: { children: ReactNode }) => {

    const userCtx = useContext(UserContext)!;
    //console.log(userCtx);

    //if(userCtx.user == null || userCtx.token == "") {
    //    redirect("/login");
    //}

    return (
        <>
            {children}
        </>
    );
}

export default ProtectRoute;