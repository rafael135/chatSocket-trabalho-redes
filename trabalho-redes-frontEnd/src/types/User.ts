

export type User = {
    uuid: string;
    avatarSrc?: string;
    name: string;
    nickName: string;
    email: string;
    iat?: number;
    exp?: number;
}

export type UserFriend = {
    uuid: string;
    isFriend: boolean;
    isPending: boolean;
    avatarSrc?: string;
    name: string;
    nickName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
};