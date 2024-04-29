import { UserInstance } from "../Models/User";
import JWT from "jsonwebtoken";



type decodedToken = {
    uuid: string;
    name: string;
    email: string;
}

class TokenService {
    public static JWT_KEY = process.env.JWT_KEY as string;

    public static encodeToken(user: UserInstance, ...objs: Object[]): string | null {
        let token: string | null = null;

        //console.log(user.uuid, user.name, user.email);
        //console.log(this.JWT_KEY);

        try {
            token = JWT.sign({
                uuid: user.uuid,
                name: user.name,
                email: user.email
            }, this.JWT_KEY,
            {
                algorithm: "HS384",
                expiresIn: "7 days"
            });
        }
        catch(err) {
            console.error(err);
        }

        return token;
    }

    public static decodeToken(token: string): decodedToken | null {
        let decodedToken: decodedToken | null = null;

        try {
            decodedToken = JWT.decode(token) as decodedToken;
        }catch(err) {
            console.error(err);
        }

        return decodedToken;
    }
}

export default TokenService;