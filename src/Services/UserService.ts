import { Op } from "sequelize";
import { User, UserInstance } from "../Models/User";
import FriendService from "./FriendService";


class UserService {
    private readonly _friendService: FriendService;

    constructor(friendService: FriendService) {
        this._friendService = friendService;
    }

    public async getUsersByNickName(nickName: string, loggedUserUuid?: string) {
        let users = await User.findAll({
            where: {
                nickName: {
                    [Op.like]: `${nickName}%`
                }
            }
        });



        users = users.filter((usr) => {
            if (usr.uuid != loggedUserUuid) {
                return true;
            } else {
                return false;
            }
        });



        let friends = await this._friendService.usersToUserFriends(users, loggedUserUuid);

        return friends;
    }

    public async getUserInfo(userUuid: string) {
        let user = await User.findOne({
            where: {
                uuid: userUuid
            }
        });

        return user;
    }
}

export default UserService;