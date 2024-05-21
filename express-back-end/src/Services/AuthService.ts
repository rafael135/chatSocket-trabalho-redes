import { User } from "../Models/User";
import JWT from "jsonwebtoken";

class AuthService {
    public async genRandomNickName(name: string) {
        let nickName = "";

        let nickNameExists = false;

        do {
            nickName = `${name}#${Math.floor(Math.random() * 99999)}`;

            let user = await User.findOne({
                where: {
                    nickName: nickName
                }
            });

            if (user != null) {
                nickNameExists = true;
            } else {
                nickNameExists = false;
            }
        } while (nickNameExists == true);

        return nickName;
    }

    public async getLoggedUser(uuid: string) {
        let user = await User.findOne({ where: { uuid: uuid } });
        return user;
    }
}

export default AuthService;