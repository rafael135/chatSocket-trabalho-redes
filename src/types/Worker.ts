import { MessageType } from "./Message";


export type FriendWorkerMessage = {

};

export type GroupWorkerMessage = {
    index: number;
    groupUuid: string;
    messages?: MessageType[];
};