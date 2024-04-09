"use server"

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { RedirectType } from "next/dist/client/components/redirect";
import { User, UserFriend } from "@/types/User";
import AxiosInstance from "@/helpers/AxiosInstance";
import { RegisterStateType } from "@/app/register/page";
import { InputErrorType } from "@/types/Form";
import { getSession, setSession } from "./cookies";
import { Group } from "@/types/Group";
import { GroupMessage, MessageType, UserMessage } from "@/types/Message";

export const loginAuthenticate = async (formData: FormData) => {

}

export const handleLogin = async () => {

}


/*
const registerSchema = z.object({
    name: z.string().min(2, "Nome não preenchido!"),
    email: z.string({ required_error: "E-mail não preenchido!" }).email("E-mail inválido!"),
    password: z.string({ required_error: "Senha não preenchida!" }),
    confirmPassword: z.string({ required_error: "Senha não preenchida!" })
}).required();
*/

export const registerAuthenticate = async (initialState: RegisterStateType, formData: FormData): Promise<RegisterStateType | null> => {
    let data = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword")
    }

    //console.log(data);

    type RegisterResponse = {
        errors?: InputErrorType[]
        user: User;
        token: string;
        status: number;
    };

    let res: RegisterResponse = await AxiosInstance.post("/register", {
        name: data.name!.toString(),
        email: data.email!.toString(),
        password: data.password!.toString(),
        confirmPassword: data.confirmPassword!.toString()
    });

    //console.log(res);

    if (res.status >= 400 && res.status <= 410) {
        return {
            errors: res.errors ?? [{ target: "all", msg: "Algo deu errado!" }]
        }
    }


    //let user = await handleAuthenticate({
    //    user: res.user,
    //    token: res.token
    //});

    //redirect("/", RedirectType.push);

    const response = NextResponse.json({});



    return null;

}

export const handleAuthenticate = async (sessionData: { user: User, token: string }) => {
    //const encryptedSessionData = JSON.stringify(sessionData);

    await setSession(sessionData.user);

    const session = await getSession();

    return session;
}


type CreateNewGroupResponse = {
    group: Group;
    status: number;
}

export const createNewGroup = async (groupName: string, userUuid: string): Promise<Group | null> => {
    let cookie = cookies().get("auth_session")!.value;

    let req = await fetch(`http://127.0.0.1:7000/group`, {
        method: "POST",
        body: JSON.stringify({
            groupName: groupName,
            userUuid: userUuid
        }),
        credentials: "include",
        headers: {
            Cookie: `auth_session=${cookie}`,
            "Content-Type": "application/json"
        }
    });

    let res: CreateNewGroupResponse = await req.json();

    if (res.status == 201) {
        return res.group;
    }

    return null;
}


type GetUserGroupsResponse = {
    groups: Group[];
    status: number;
}

export const getUserGroups = async (userUuid: string): Promise<Group[]> => {
    let cookie = cookies().get("auth_session")!.value;

    let req = await fetch(`http://127.0.0.1:7000/user/${userUuid}/groups`, {
        method: "GET",
        credentials: "include",
        headers: {
            Cookie: `auth_session=${cookie}`
        }
    });

    let res: GetUserGroupsResponse = await req.json();

    if (res.status == 200) {
        return res.groups ?? [];
    }

    return [];
}

type GetUserFriendsResponse = {
    userFriends: UserFriend[],
    status: number;
};

export const getUserFriends = async (userUuid: string): Promise<UserFriend[]> => {
    let cookie = cookies().get("auth_session")!.value;

    //console.log("dasdasd");

    let req = await fetch(`http://127.0.0.1:7000/user/${userUuid}/friends`, {
        method: "GET",
        credentials: "include",
        headers: {
            Cookie: `auth_session=${cookie}`
        }
    });

    let res: GetUserFriendsResponse = await req.json();

    if (res.status == 200) {
        return res.userFriends;
    }

    return [];
}

type getGroupMessagesResponse = {
    groupMessages: MessageType[];
    status: number;
}

export const getGroupMessages = async (groupUuid: string): Promise<MessageType[]> => {
    let cookie = cookies().get("auth_session")!.value;

    let req = await fetch(`http://127.0.0.1:7000/message/group/${groupUuid}`, {
        method: "GET",
        credentials: "include",
        headers: {
            Cookie: `auth_session=${cookie}`
        }
    });

    let res: getGroupMessagesResponse = await req.json();

    if (res.status == 200) {
        return res.groupMessages;
    }

    return [];
}

type getUserMessagesResponse = {
    userMessages: MessageType[];
    status: number;
};

export const getUserMessages = async (userUuid: string): Promise<MessageType[]> => {
    let cookie = cookies().get("auth_session")!.value;

    let req = await fetch(`http://127.0.0.1:7000/message/user/${userUuid}`, {
        method: "GET",
        credentials: "include",
        headers: {
            Cookie: `auth_session=${cookie}`
        }
    });

    let res: getUserMessagesResponse = await req.json();

    if (res.status == 200) {
        return res.userMessages;
    }

    return [];
}



type ChangeUserNameResponse = {
    status: number;
};

export const userChangeName = async (newName: string): Promise<boolean> => {
    let cookie = cookies().get("auth_session")!.value;

    let req = await fetch(`http://127.0.0.1:7000/user/change/name`, {
        method: "PUT",
        body: JSON.stringify({
            newName: newName
        }),
        credentials: "include",
        headers: {
            Cookie: `auth_session=${cookie}`,
            "Content-Type": "application/json"
        }
    });

    let res: ChangeUserNameResponse = await req.json();

    if (res.status == 200) {
        return true;
    }

    return false;
}


type SearchFriendsResponse = {
    users: UserFriend[];
    status: number;
};

export const searchFriends = async (searchName: string): Promise<UserFriend[]> => {
    let cookie = cookies().get("auth_session")!.value;

    let req = await fetch(`http://127.0.0.1:7000/search/users?searchName=${searchName}`, {
        method: "GET",
        credentials: "include",
        headers: {
            Cookie: `auth_session=${cookie}`
        }
    });

    let res: SearchFriendsResponse = await req.json();

    if (res.status == 200) {
        return res.users;
    }

    return [];
}

type AddFriendResponse = {
    friend?: UserFriend;
    status: number;
}

export const addOrRemoveFriend = async (userUuid: string): Promise<UserFriend> => {
    let cookie = cookies().get("auth_session")!.value;

    let req = await fetch("http://127.0.0.1:7000/user/addFriend", {
        method: "POST",
        body: JSON.stringify({
            userUuid: userUuid
        }),
        headers: {
            Cookie: `auth_session=${cookie}`,
            "Content-Type": "application/json"
        }
    });

    let res: AddFriendResponse = await req.json();

    //console.log(res);

    return res.friend!;
}

type GetPendingFriendsResponse = {
    pendingFriends: UserFriend[];
    status: number;
};

export const getPendingFriends = async (userUuid: string): Promise<UserFriend[]> => {
    let cookie = cookies().get("auth_session")!.value;

    let req = await fetch(`http://127.0.0.1:7000/user/${userUuid}/friends/pending`, {
        method: "GET",
        headers: {
            Cookie: `auth_session=${cookie}`,
            "Content-Type": "application/json"
        }
    });

    let res: GetPendingFriendsResponse = await req.json();

    return res.pendingFriends;
}

export const uploadMessageFile = async (userUuid: string, files: File[]) => {
    //console.log(userUuid, files);

    let filesPaths: string[] = [];
    let filesForm = new FormData();


    for (let i = 0; i < files.length; i++) {
        filesForm.append("files", files[i]);
    }

    filesForm.set("userUuid", userUuid);

    type FileUploadResponse = {
        filePaths: string[];
        status: number;
    };

    let req = await fetch("/api/image/upload", {
        method: "POST",
        body: filesForm,
        headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json"
        }
    });

    let uploadResponse: FileUploadResponse = await req.json();

    if (uploadResponse.status == 201) {
        filesPaths = uploadResponse.filePaths;
    }

    return filesPaths;
}