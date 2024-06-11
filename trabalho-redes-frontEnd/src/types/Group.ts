
export type Group = {
    uuid: string;
    name: string;
    groupImg: string;
    createdAt: string;
    updatedAt: string;
};


export type GroupRelation = {
    uuid: string;
    groupUuid: string;
    userUuid: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
}

export type GroupInvitation = {
    uuid: string;
    groupUuid: string;
    userUuid: string;
    createdAt: string;
    updatedAt: string;
}

export type GroupAdmin = {
    uuid: string;
    userUuid: string;
    groupUuid: string;
    createdAt: string;
    updatedAt: string;
}