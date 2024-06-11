import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import JWT from "jsonwebtoken";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV?.replace(' ', '')}`) });

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
    if(process.env.NODE_ENV == "test") {
        return next();
    }

    let success = false;

    let authCookie = req.cookies.auth_session as string | null;
    

    if(authCookie != null) {
        try {
            const decoded = JWT.verify(
                authCookie,
                process.env.JWT_KEY as string
            );

            success = true;
        }
        catch(err) {

        }
    }

    if(success == true) {
        return next();
    } else {
        res.status(401);
        return res.send({
            error: "Token inválido!",
            status: 401
        });
    }
}

export default checkToken;