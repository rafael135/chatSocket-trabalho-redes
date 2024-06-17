import { InputErrorType } from "@/types/Form";
import { User } from "@/types/User";
import { serialize } from "cookie";
import { NextResponse } from "next/server";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

export const POST = async (request: Request) => {
    const body = await request.json();

    const { name, email, password, confirmPassword } = body as { name: string; email: string; password: string; confirmPassword: string };

    if(name == "" || email == "" || password == "" || confirmPassword == "") {
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
        errors?: InputErrorType[];
    };

    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    let req = await fetch("http://localhost:7000/api/register", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        })
    });

    let res: RegisterResponse = await req.json();

    if(res.status != 201) {
        return NextResponse.json({
            errors: res.errors!,
            status: res.status
        }, {
            status: res.status
        });
    }

    //const jwtPassword = process.env.SESSION_PWD as string;

    const serialized = serialize("auth_session", res.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production" ? true : false,
        sameSite: "lax",
        maxAge: MAX_AGE,
        path: "/"
    });

    return NextResponse.json({
        status: 201,
        user: res.user,
        token: res.token
    }, {
        status: 201,
        headers: {
            "Set-Cookie": serialized,
        }
    });
}