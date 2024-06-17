import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { cookies } from "next/headers";

export const POST = async (request: Request) => {
    const formData = await request.formData();

    const userUuid = formData.get("userUuid");

    const file = formData.get("file") as File;
    if(file == null || userUuid == null) {
        return NextResponse.json({
            status: 400
        }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const fileExt = file.type.split('/')[1] ?? "png";
    
    const fileName = `avatar.${fileExt}`;
    const userPath = `user/${userUuid}`;

    const filePath = `${userPath}/${fileName}`;

    try {
        await mkdir(path.join(process.cwd(), "public/", userPath), { recursive: true });
        await writeFile(path.join(process.cwd(), "public/", filePath), buffer);
    }
    catch(err) {
        console.error(err);
        return NextResponse.json({
            status: 500
        }, { status: 500 });
    }

    let authSession = cookies().get("auth_session");

    type ChangeAvatarResponse = {
        status: number;
    };

    let req = await fetch("http://localhost:7000/api/user/change/avatar", {
        method: "POST",
        body: JSON.stringify({
            filePath: filePath
        }),
        headers: {
            "Cookie": `auth_session=${authSession?.value}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });

    let res: ChangeAvatarResponse = await req.json();

    if(res.status == 201) {
        return NextResponse.json({
            avatarPath: filePath,
            status: 200
        }, { status: 200 });
    }

    return NextResponse.json({
        status: 500
    }, { status: 500 });



}