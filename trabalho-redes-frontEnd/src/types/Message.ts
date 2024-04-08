import { User } from "./User"

export type MessageImageType = {
    authorUuid: string;
    path: string;
};

export type MessageType = {
    author: User | null;
    type: "new-user" | "exit-user" | "msg" | "img" | "error";
    msg: string;
    imgs?: MessageImageType[];
    to: "user" | "group";
    toUuid: string;
    time?: string;
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
    uuid: string;
    fromUserUuid: string;
    user: User;
    toGroupUuid: string;
    body: string;
    createdAt: string;
    updatedAt: string;
};

export type UserMessage = {
    uuid: string;
    fromUserUuid: string;
    toUserUuid: string;
    body: string;
    createdAt: string;
    updatedAt: string;
};

export type SelectedChatInfo = {
    index: number;
    type: "user" | "group";
    srcImg?: string;
    name: string;
    uuid: string;
};