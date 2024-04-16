import { Op } from "sequelize";
import { User, UserInstance } from "../Models/User";
import FriendService from "./FriendService";


class UserService {
    static async getUsersByNickName(nickName: string, loggedUserUuid?: string) {
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



        let friends = await FriendService.usersToUserFriends(users, loggedUserUuid);

        return friends;
    }

    static async getUserInfo(userUuid: string) {
        let user = await User.findOne({
            where: {
                uuid: userUuid
            }
        });

        return user;
    }
}

export default UserService;