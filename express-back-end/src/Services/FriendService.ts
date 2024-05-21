import { Op } from "sequelize";
import { User, UserInstance } from "../Models/User";
import { UserRelation, UserRelationInstance } from "../Models/UserRelation";


type UserFriend = {
    uuid: string;
    isFriend?: boolean;
    isPending?: boolean;
    avatarSrc?: string;
    name: string;
    nickName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
};

class FriendService {
    public async usersToUserFriends(users: UserInstance[], loggedUserUuid?: string) {
        let friends: UserFriend[] = [];

        let count = 0;

        await new Promise<void>((resolve) => {
            users.forEach(async (user) => {
                let isFriend = false;
                let isPending = false;

                if(loggedUserUuid != undefined) {
                    
                    let exists1 = await UserRelation.findOne({
                        where: {
                            [Op.and]: [
                                { fromUserUuid: loggedUserUuid },
                                { toUserUuid: user.uuid }
                            ]
                        }
                    });

                    if(exists1 != null) {
                        isPending = true;
                        let exists2 = await UserRelation.findOne({
                            where: {
                                [Op.and]: [
                                    { fromUserUuid: user.uuid },
                                    { toUserUuid: loggedUserUuid }
                                ]
                            }
                        });

                        if(exists2 != null) {
                            isPending = false;
                            isFriend = true;
                        }
                    }
                }

                friends.push({
                    uuid: user.uuid,
                    isFriend: isFriend,
                    isPending: isPending,
                    avatarSrc: user.avatarSrc,
                    name: user.name,
                    nickName: user.nickName,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                });
                count++;

                if(count == users.length) { resolve(); }
            });

            if(count == users.length) { resolve(); }
        });
        

        return friends;
    }

    public async addOrRemoveFriend(userUuid: string, friendToAddUuid: string) {
        if(userUuid == friendToAddUuid) { return { isPending: false, isFriend: false }; }

        let solicitationExists = await UserRelation.findOne({
            where: {
                fromUserUuid: userUuid,
                toUserUuid: friendToAddUuid
            }
        });

        if(solicitationExists != null) {
            await solicitationExists.destroy();
            return {
                isPending: false,
                isFriend: false
            };
        }


        let exists = await this.isFriend(userUuid, friendToAddUuid);

        // Se houver uma relação de amigos aceita pelos dois usuários, vai retornar true, significando que um dos usuários quer desfazer a amizade
        if(exists.isFriend == true && exists.isPending == false) {


            await UserRelation.destroy({
                where: {
                    [Op.or]: [
                        [
                            { fromUserUuid: userUuid },
                            { toUserUuid: friendToAddUuid }
                        ],
                        [
                            { fromUserUuid: friendToAddUuid },
                            { toUserUuid: userUuid }
                        ]
                    ],
                }
            });
            return {
                isPending: false,
                isFriend: false
            };
        } else if(exists.isFriend == false && exists.isPending == true) {
            return {
                isPending: true,
                isFriend: false
            }
        } else {
            if(exists.isFriend == false && exists.isPending == true) {

            }

            let newFriend = await UserRelation.create({
                fromUserUuid: userUuid,
                toUserUuid: friendToAddUuid
            });

            return {
                friend: newFriend,
                isFriend: false,
                isPending: true
            };
        }
    }

    /**
     * Obtém se um usuário é amigo do usuário alvo
     * @param loggedUserUuid
     * @param targetUuid 
     * @returns Promise<{ isFriend: boolean, isPending:boolean }>
     */
    public async isFriend(loggedUserUuid: string, targetUuid: string): Promise<{ isFriend: boolean; isPending: boolean; }> {
        let relations = await UserRelation.findAll({
            where: {
                [Op.and]: [
                    [
                        { fromUserUuid: loggedUserUuid },
                        { toUserUuid: targetUuid }
                    ],
                    [
                        { fromUserUuid: targetUuid },
                        { toUserUuid: loggedUserUuid }
                    ]
                ]
            }
        });

        //console.log(relations);

        if(relations.length == 2) {
            return {
                isPending: false,
                isFriend: true
            };
        } else if(relations.length == 1) {
            return {
                isPending: true,
                isFriend: false
            };
        }

        return {
            isPending: false,
            isFriend: false
        };
    }

    /**
     * Obtém os pedidos de amizade pendentes do usuário
     * @param loggedUserUuid 
     * @returns Promise<UserFriend[]>
     */
    public async getPendingFriends(loggedUserUuid: string): Promise<UserFriend[]> {
        let invitations = await UserRelation.findAll({
            where: {
                toUserUuid: loggedUserUuid
            }
        });

        let pendingInvitations: UserFriend[] = [];
        let count = 0;
        let len = invitations.length;

        
        await new Promise<void>((resolve) => {
            invitations.forEach(async(fr) => {
                let from = fr.fromUserUuid;
                let to = fr.toUserUuid;
    
                let accepted = await UserRelation.findOne({
                    where: {
                        fromUserUuid: to,
                        toUserUuid: from
                    }
                });
    
                if(accepted == null) {
                    let user = (await User.findOne({ where: { uuid: from } }))!;
    
                    pendingInvitations.push({
                        uuid: user.uuid,
                        name: user.name,
                        nickName: user.nickName,
                        email: user.email,
                        isFriend: false,
                        isPending: true,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt
                    });
                }
                count++;

                if(count == len) { resolve(); }
            });

            if(count == len) { resolve(); }
        });
        

        return pendingInvitations;
    }

    /**
     * Obtém os amigos do usuario informado
     * @param string loggedUserUuid 
     * 
     */
    public async userFriends(loggedUserUuid: string): Promise<UserFriend[]> {
        let friendsRelations = await UserRelation.findAll({
            where: {
                [Op.or]: {
                    fromUserUuid: loggedUserUuid,
                    toUserUuid: loggedUserUuid
                }
            }
        });

        let qteFriends = friendsRelations.length;
        let count = 0;

        let friends: UserFriend[] = [];

        await new Promise<void>((resolve) => {
            friendsRelations.forEach(async (friend) => {
                let isPending = true;

                let user = (await User.findOne({
                    where: { uuid: (friend.toUserUuid != loggedUserUuid) ? friend.toUserUuid : friend.fromUserUuid}
                }))!;

                let hasRelation = await UserRelation.findOne({
                    where: {
                        [Op.and]: {
                            fromUserUuid: (loggedUserUuid == friend.fromUserUuid) ? user.uuid : loggedUserUuid,
                            toUserUuid: (loggedUserUuid == friend.toUserUuid) ? user.uuid : loggedUserUuid 
                        }
                    }
                });

                if(hasRelation != null) { isPending = false; }

                if(isPending != true) {
                    if(friends.find(fr => fr.uuid == user.uuid) == undefined) {
                        friends.push({
                            uuid: user.uuid,
                            isFriend: (hasRelation != null) ? true : false,
                            isPending: (hasRelation != null) ? false : true,
                            avatarSrc: user.avatarSrc,
                            name: user.name,
                            nickName: user.nickName,
                            email: user.email,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt
                        });
                    }                    
                }
                
                count++;

                if(qteFriends == count) { resolve(); }
            });

            if(qteFriends == count) { resolve(); }
        });

        return friends;
    }

    public async userFriendsByNickName(userUuid: string, nickName: string) {
        
    }
}

export default FriendService;