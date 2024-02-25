"use client"


import { User } from "@/types/User";
import { isEqual } from "lodash";
import { ReactNode, useEffect, useState, createContext, useMemo, useLayoutEffect } from "react";

export const USER_STORAGE_KEY = "loggedUser";
export const TOKEN_STORAGE_KEY = "loggedUserToken";

const useMemoizedState = <T extends unknown>(initialValue: T): [T, (val: T) => void] => {
    const [state, _setState] = useState<T>(initialValue);

    const setState = (newState: T) => {
        _setState((prev: T) => {
            if (isEqual(newState, prev) == false) {
                return newState;
            } else {
                return prev;
            }
        });
    };

    return [state, setState];
}

type UserContextType = {
    user: User | null;
    token: string;
    setUser: (user: User | null) => void;
    setToken: (token: string) => void;
    initialized: boolean;
}

export const UserContext = createContext<UserContextType | null>(null);


export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userState, setUserState] = useMemoizedState<User | null>(null);
    const [tokenState, setTokenState] = useMemoizedState<string>("");

    const [initialized, setInitialized] = useState<boolean>(false);

    const wait = async (ms: number) => {
        let promise = new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });

        await promise;
    }

    const initialAction = async (userStr: string | null, token: string | null): Promise<void> => {
        if(initialized == true) {
            
        } else if(userState == null && userStr != null && initialized == false) {
            setUserState(JSON.parse(userStr));
        } else {
            window.sessionStorage.removeItem("auth_user");
        }

        if(initialized == true) {
            
        } else if(tokenState == "" && token != null && initialized == false) {
            setTokenState(token);
        } else {
            window.sessionStorage.removeItem("auth_token");
        }
    }

    useEffect(() => {
        if (typeof window != "undefined") {
            let userStr = window.sessionStorage.getItem("auth_user");
            let token = window.sessionStorage.getItem("auth_token");

            initialAction(userStr, token).then((res) => {
                setInitialized(true);
            });
        }
    }, []);

    useEffect(() => {
        //console.log(userState);
        if(initialized == true) {
            if(userState == null) {
                window.sessionStorage.removeItem("auth_user");
            } else {
                window.sessionStorage.setItem("auth_user", JSON.stringify(userState));
            }
        }
    }, [userState]);

    useEffect(() => {
        //console.log(tokenState);
        if(initialized == true) {
            if(tokenState == "") {
                window.sessionStorage.removeItem("auth_token");
            } else {
                window.sessionStorage.setItem("auth_token", tokenState);
            }
            
        }
    }, [tokenState]);

    const _setToken = (token: string) => {
        setTokenState(token);
    }

    const _setUser = (user: User | null) => {
        setUserState(user);
    }

    /*
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
    */


    return (
        <UserContext.Provider value={{ user: userState, token: tokenState, setUser: setUserState, setToken: setTokenState, initialized: initialized }}>
            {children}
        </UserContext.Provider>
    );
}
