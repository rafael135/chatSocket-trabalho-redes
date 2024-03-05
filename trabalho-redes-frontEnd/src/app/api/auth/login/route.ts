import { User } from "@/types/User";
import { serialize } from "cookie";
import { NextResponse } from "next/server";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

export const POST = async (request: Request) => {
    const body = await request.json();

    const { email, password } = body as { email: string; password: string; };

    if(email == "" || password == "") {
        return NextResponse.json({
            errors: []
        }, {
            status: 400
        });
    }

    type RegisterResponse = {
        user: User;
        token: string;
        status: number;
    };

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");

    let req = await fetch("http://localhost:7000/login", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            email: email,
            password: password,
        })
    });

    let res: RegisterResponse = await req.json();

    const serialized = serialize("auth_session", res.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production" ? true : false,
        sameSite: "lax",
        maxAge: MAX_AGE,
        path: "/"
    });

    return NextResponse.json({
        user: res.user,
        token: res.token,
        status: 200
    }, {
        status: 200,
        headers: {
            "Set-Cookie": serialized
        }
    });
}