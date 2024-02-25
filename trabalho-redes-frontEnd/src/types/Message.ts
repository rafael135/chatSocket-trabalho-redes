import { User } from "./User"

export type MessageType = {
    author: User | null;
    type: "new-user" | "exit-user" | "msg" | "img" | "error";
    msg: string;
    imgs?: string[];
    to: "user" | "group";
    toUuId: string;
}

export type ImgSendType = {
    user: User;
    msg: string;
    imgs: File[];
}

export type ImgReceiveType = {
    user: User;
    msg: string;
    imgs: string[];
}

export type GroupMessage = {
    uuId: string;
    fromUserUuId: string;
    user: User;
    toGroupUuId: string;
    body: string;
    createdAt: string;
    updatedAt: string;
};

export type UserMessage = {
    uuId: string;
    fromUserUuId: string;
    toUserUuId: string;
    body: string;
    createdAt: string;
    updatedAt: string;
};

export type SelectedChatInfo = {
    index: number;
    type: "user" | "group";
    uuId: string;
};