import { MessageType } from "./Message";


export type FriendWorkerMessage = {

};

export type GroupWorkerMessage = {
    index: number;
    groupUuId: string;
    messages?: MessageType[];
};