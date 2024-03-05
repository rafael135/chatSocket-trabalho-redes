
export type Group = {
    uuId: string;
    name: string;
    groupAdmins: string;
    createdAt: string;
    updatedAt: string;
};


export type GroupRelation = {
    uuId: string;
    groupUuId: string;
    userUuId: string;
    createdAt: string;
    updatedAt: string;
}