"use client"


import { User } from "@/types/User";
import { ReactNode, useEffect, useState, createContext, useMemo, useLayoutEffect } from "react";

export const USER_STORAGE_KEY = "loggedUser";
export const TOKEN_STORAGE_KEY = "loggedUserToken";

type UserContextType = {
    user: User | null;
    token: string;
    setUser: (user: User | null) => void;
    setToken: (token: string) => void;
}

export const UserContext = createContext<UserContextType | null>(null);


export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userState, setUserState] = useState<User | null>(null);
    const [tokenState, setTokenState] = useState<string>("");
    //const [usersListState, setUsersListState] = useState<User[]>([]);

    useLayoutEffect(() => {
        if(typeof window != "undefined") {
            let userStr = window.sessionStorage.getItem("auth_user");

            if(userStr == null) { setUserState(null); }
            else { setUserState(JSON.parse(userStr)); }

            let lToken = tokenState;

            setTokenState(window.sessionStorage.getItem("auth_token") ?? lToken);
        }

        console.log(userState);
        //console.log(tokenState);
    }, []);

    useEffect(() => {
        if(userState != null) {
            sessionStorage.setItem("auth_user", JSON.stringify(userState));
        }

        if(tokenState != "") {
            sessionStorage.setItem("auth_token", tokenState);
        }
    }, [userState, tokenState]);

    const _setToken = (token: string) => {
        setTokenState(token);
    }

    const _setUser = (user: User | null) => {
        setUserState(user);
    }

    const contextValue = useMemo(
        () => {
            return {
                user: userState,
                token: tokenState,
                setToken: _setToken,
                setUser: _setUser
            }
        },
    [tokenState, userState]);
    

    return (
        <UserContext.Provider value={contextValue}>
            { children }
        </UserContext.Provider>
    );
}
