

export type UserGroupMsg = {
    groupUuid: string;
    type: "new-user" | "exit-user" | "msg" | "img" | "error";
    imgs: string[];
    msg: string;
};

export type UserPrivateMsg = {
    userUuid: string;
    type: "new-user" | "exit-user" | "msg" | "img" | "error";
    imgs: string[];
    msg: string;
}