"use client"

import { ReactNode, createContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { TOKEN_STORAGE_KEY } from "./UserContext";

export type SocketContextType = {
    socket: Socket | null;
};

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const [socketState, setSocketState] = useState<Socket | null>(null);

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

    return(
        <SocketContext.Provider value={{ socket: socketState }}>
            {children}
        </SocketContext.Provider>
    );
}