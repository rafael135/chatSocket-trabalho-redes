

export type User = {
    uuId: string;
    avatarSrc?: string;
    name: string;
    email: string;
    iat?: number;
    exp?: number;
}

export type UserFriend = Omit<User, "iat" | "exp">;