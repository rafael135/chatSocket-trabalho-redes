import { User, UserInstance } from "../Models/User";
import JWT from "jsonwebtoken";
import TokenService from "./TokenService";

class AuthService {
    private readonly _tokenService: TokenService;

    constructor(tokenService: TokenService) {
        this._tokenService = tokenService;
    }

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

    public async getLoggedUser(token: string) : Promise<UserInstance | null> {
        const decodedToken = await this._tokenService.decodeToken(token);

        if(decodedToken == null) { return null; }

        let user = await User.findOne({ where: { uuid: decodedToken.uuid } });
        return user;
    }
}

export default AuthService;