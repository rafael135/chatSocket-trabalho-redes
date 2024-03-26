import { Op } from "sequelize";
import { User } from "../Models/User";
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

        let friends = FriendService.usersToUserFriends(users, loggedUserUuid);

        return friends;
    }
}

export default UserService;