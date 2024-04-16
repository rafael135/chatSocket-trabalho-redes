"use server"

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
//import JWT from "jsonwebtoken";
import { User } from "./types/User";

const sessionPassword = process.env.SESSION_PWD as string;

export async function middleware(request: NextRequest) {

    //let loggedUser = await getSession();

    let session = request.cookies.get("auth_session");

    if(session == undefined || session.value == "") {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    let headers = new Headers();
    headers.append("Cookie", `auth_session=${session.value};`);

    //console.log(document);

    try {
        let tokenReq = await fetch("http://localhost:7000/checkToken", {
            method: "POST",
            headers: headers
        });

        let tokenRes: { status: number; } = await tokenReq.json();

        if(tokenRes.status == 401) {
            request.cookies.delete("auth_session");

            const url = request.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }
    }
    catch(err) {
        console.error(err);
    }

    //let decoded = JWT.decode(session.value) as User;

    //console.log(decoded);

    //console.log(loggedUser);

    //if(loggedUser == null) {
    //    return NextResponse.redirect("http://localhost:3000/login");
    //}

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/"
    ]
};