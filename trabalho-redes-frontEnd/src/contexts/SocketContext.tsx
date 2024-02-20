"use client"

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { UserContext } from "./UserContext";

export type SocketContextType = {
    socket: Socket | null;
};

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const userCtx = useContext(UserContext)!;

    const [socketState, setSocketState] = useState<Socket | null>(
        io("http://localhost:7000", {
            auth: {
                token: `Bearer ${userCtx.token ?? ""}`
            },
            extraHeaders: {
                Cookie: `auth_session=${userCtx.token};`
            },
            withCredentials: true,
            autoConnect: false,
            reconnectionAttempts: 5
        })
    );

    //useEffect(() => {
    //    socketState?.connect();
    //}, [userCtx.token]);
    
    /*
    useEffect(() => {
        if(typeof window !== "undefined") {
            let userToken = localStorage.getItem(TOKEN_STORAGE_KEY);

            if(userToken == null) { userToken = "INVALID" }

            setSocketState(io("http://localhost:7000/chat", {
                auth: {
                    token: `Bearer ${userToken}`
                }
            }));
        }
    }, [window]);
    */

    return(
        <SocketContext.Provider value={{ socket: socketState }}>
            {children}
        </SocketContext.Provider>
    );
}