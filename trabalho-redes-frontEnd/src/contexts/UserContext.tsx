"use client"


import { User } from "@/types/User";
import { ReactNode, useEffect, useState, createContext } from "react";

export const USER_STORAGE_KEY = "loggedUser";
export const TOKEN_STORAGE_KEY = "loggedUserToken";

type UserContextType = {
    user: User | null;
    token: string;
    usersList: User[];
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    setUsersList: React.Dispatch<React.SetStateAction<User[]>>;
}

export const UserContext = createContext<UserContextType | null>(null);


export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userState, setUserState] = useState<User | null>(null);
    const [tokenState, setTokenState] = useState<string>("");
    const [usersListState, setUsersListState] = useState<User[]>([]);


    useEffect(() => {
        if(typeof window != "undefined") {
            let lsUser = localStorage.getItem(USER_STORAGE_KEY);
            let lsToken = localStorage.getItem(TOKEN_STORAGE_KEY);

            if(lsUser != null && lsToken != null) {
                setUserState(JSON.parse(lsUser));
                setTokenState(lsToken);
            } else {
                setUserState(null);
                setTokenState("");
            }
        }

        //console.log(userState);

        if(userState != null) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userState));
        }

        if(tokenState != "") {
            localStorage.setItem(TOKEN_STORAGE_KEY, tokenState);
        }

    }, [userState, tokenState]);

    return (
        <UserContext.Provider value={{user: userState, token: tokenState, usersList: usersListState, setUser: setUserState, setToken: setTokenState, setUsersList: setUsersListState }}>
            { children }
        </UserContext.Provider>
    );
}
