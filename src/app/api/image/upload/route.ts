import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";


type FileAttrs = {
    fileName: string;
}

export const POST = async (request: Request) => {
    let formData = await request.formData();

    let files = formData.getAll("files") as File[];

    let userUuid = formData.get("userUuid");

    let fileBuffers: Buffer[] = [];
    let filesExts: string[] = [];

    for(let i = 0; i < files.length; i++) {
        let fileSplited = files[i].name.split('.');
        filesExts.push(fileSplited[fileSplited.length - 1]);

        fileBuffers.push(Buffer.from(await files[i].arrayBuffer()));
    }

    let userPath = `user/${userUuid}`;

    let filePaths: string[] = [];

    let filesUpload: Promise<any>[] = [];

    try {
        let filePath = `${userPath}/files`;
        await mkdir(path.join(process.cwd(), "public/", filePath), { recursive: true });

        for(let i = 0; i < fileBuffers.length; i++) {
            let fileName = `${Date.now() + `${Math.round(Math.random() * 99999)}`}`;
            let publicFilePath = path.join(filePath, `/${fileName}.${filesExts[i]}`);

            let finalFilePath = path.join(process.cwd(), "public/", publicFilePath);

            publicFilePath = publicFilePath.replaceAll("\\", "/");
            //console.log(publicFilePath);
            filePaths.push(publicFilePath);

            filesUpload.push(writeFile(finalFilePath, fileBuffers[i]));
        }
    } catch(err) {
        console.error(err);
        return NextResponse.json({
            status: 500
        }, { status: 500 });
    }

    await Promise.all(filesUpload);


    


    return NextResponse.json({
        filePaths: filePaths,
        status: 201
    }, { status: 201 });
}