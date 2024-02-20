import { User } from "./User"

export type SessionType = {
    user: User;
    token: string;
}