"use server"

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RedirectType } from "next/dist/client/components/redirect";


export const loginAuthenticate = async (formData: FormData) => {

}

export const handleLogin = async () => {

}

export const registerAuthenticate = async (formData: FormData) => {
    
}

export const handleRegister = async (sessionData: any) => {
    const encryptedSessionData = sessionData;
    cookies().set("session", encryptedSessionData, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 Semana
        path: "/"
    });

    redirect("/", RedirectType.push);
}