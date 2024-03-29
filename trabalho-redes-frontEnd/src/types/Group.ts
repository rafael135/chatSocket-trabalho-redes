
export type Group = {
    uuid: string;
    name: string;
    groupAdmins: string;
    createdAt: string;
    updatedAt: string;
};


export type GroupRelation = {
    uuid: string;
    groupUuid: string;
    userUuid: string;
    createdAt: string;
    updatedAt: string;
}