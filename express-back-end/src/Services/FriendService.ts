import { Op } from "sequelize";
import { User, UserInstance } from "../Models/User";
import { UserRelation } from "../Models/UserRelations";


type UserFriend = {
    uuid: string;
    isFriend?: boolean;
    avatarSrc?: string;
    name: string;
    nickName: string;
    email: string;
};

class FriendService {
    static async usersToUserFriends(users: UserInstance[], loggedUserUuid?: string) {
        let friends: UserFriend[] = [];

        let count = 0

        await new Promise<void>((resolve) => {
            users.forEach(async (user) => {
                let isFriend = false;

                if(loggedUserUuid != undefined) {
                    let exists = await UserRelation.findOne({
                        where: {
                            [Op.or]: [
                                { fromUserUuid: loggedUserUuid },
                                { toUserUuid: loggedUserUuid }
                            ]
                        }
                    });

                    if(exists != null) {
                        isFriend = true;
                    }
                }

                friends.push({
                    uuid: user.uuid,
                    isFriend: isFriend,
                    avatarSrc: user.avatarSrc,
                    name: user.name,
                    nickName: user.nickName,
                    email: user.email
                });
                count++;

                if(count == users.length) { resolve(); }
            });

            if(count == users.length) { resolve(); }
        });
        

        return friends;
    }

    static async addOrRemoveFriend(userUuid: string, friendToAddUuid: string) {
        let exists = await UserRelation.findAll({
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

        if(exists.length > 0) {
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
            return null;
        }

        let newFriend = await UserRelation.create({
            fromUserUuid: userUuid,
            toUserUuid: friendToAddUuid
        });

        return newFriend;
    }

    /**
     * Obtém os amigos do usuario informado
     * @param loggedUserUuid 
     * @param userUuid
     * 
     */
    static async userFriends(loggedUserUuid: string): Promise<UserFriend[]> {
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
                let user = (await User.findOne({
                    where: { uuid: (friend.toUserUuid != loggedUserUuid) ? friend.toUserUuid : friend.fromUserUuid}
                }))!;

                friends.push({
                    uuid: user.uuid,
                    isFriend: true,
                    avatarSrc: user.avatarSrc,
                    name: user.name,
                    nickName: user.nickName,
                    email: user.email
                });
                count++;

                if(qteFriends == count) { resolve(); }
            });

            if(qteFriends == count) { resolve(); }
        });

        return friends;
    }

    static async userFriendsByNickName(userUuid: string, nickName: string) {
        
    }
}

export default FriendService;