import { MenuContextProvider } from "@/contexts/MenuContext";
import { MessagesProvider } from "@/contexts/MessagesContext";
import { SocketContextProvider } from "@/contexts/SocketContext";
import { UserProvider } from "@/contexts/UserContext";
import ProtectRoute from "@/helpers/ProtectRoute";
import { QueryProvider } from "@/utils/queryProvider";
import { ReactNode } from "react";


const Providers = ({ children }: { children: ReactNode }) => {


    return (
        <UserProvider>
            {/*<ProtectRoute>*/}
                <SocketContextProvider>
                    <MessagesProvider>
                        <QueryProvider>
                            <MenuContextProvider>
                                {children}
                            </MenuContextProvider>
                        </QueryProvider>
                    </MessagesProvider>
                </SocketContextProvider>
            {/*</ProtectRoute>*/}
        </UserProvider>
    );
}

export default Providers;