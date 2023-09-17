"use client"


import { User } from "@/types/User";
import { ReactNode, useEffect, useState, createContext } from "react";

export const USER_TOKEN = "loggedUser";

type UserContextType = {
    user: User | null;
    usersList: User[];
    setUser: (user: User) => void;
    setUsersList: (users: User[]) => void;
}

export const UserContext = createContext<UserContextType | null>(null);




export const UserProvider = ({ children }: { children: ReactNode }) => {
    
    const [userState, setUserState] = useState<User | null>(null);
    const [usersListState, setUsersListState] = useState<User[]>([]);


    useEffect(() => {
        if(typeof window != "undefined") {
            let ls = localStorage.getItem(USER_TOKEN);

            if(ls != null) {
                setUserState(JSON.parse(ls));
            } else {
                setUserState(null);
            }
        }

        //console.log(userState);

        if(userState != null) {
            //localStorage.setItem(USER_TOKEN, JSON.stringify(userState));
        }
    }, []);

    return (
        <UserContext.Provider value={{user: userState, usersList: usersListState, setUser: setUserState, setUsersList: setUsersListState }}>
            { children }
        </UserContext.Provider>
    );
}
