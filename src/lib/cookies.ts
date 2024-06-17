import { User } from "@/types/User";
import { unsealData, sealData } from "iron-session";
//import JWT from "jsonwebtoken";
import { cookies } from "next/headers";

const sessionPassword = process.env.SESSION_PWD as string;

export const getLoggedUser = async (): Promise<User | null> => {
    const encryptedSession = cookies().get("auth_session")?.value;

    if(encryptedSession == null) { return null; }

    try {
        //let user = JWT.decode(encryptedSession) as User;

        //return user;
    }
    catch(e) {

    }

    return null;
    
}

export const getSession = async (): Promise<User | null> => {
    const encryptedSession = cookies().get("auth_session")?.value;

    //console.log(encryptedSession);

    

    const session = encryptedSession
        ? await unsealData(encryptedSession, {
            password: sessionPassword
        }) as unknown
    : null;

    return session ? session as User : null;
}

export const setSession = async (user: User): Promise<void> => {
    let userString = JSON.stringify(user);

    const encryptedSession = await sealData(userString, {
        password: sessionPassword
    });

    //console.log(encryptedSession);

    //cookies().set("auth_session", encryptedSession, {
    //    sameSite: "none",
    //    maxAge: 60 * 60 * 24 * 7, // 1 Semana
    //    httpOnly: true,
    //    secure: process.env.NODE_ENV == "production" ? true : false,
    //    path: "/"
    //});
}