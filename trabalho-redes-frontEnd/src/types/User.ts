

export type User = {
    uuId: string;
    avatarSrc?: string;
    name: string;
    privateRoom: string;
    email: string;
    iat?: number;
    exp?: number;
}