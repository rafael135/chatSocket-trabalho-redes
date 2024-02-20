import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import JWT from "jsonwebtoken";

dotenv.config();

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
    let success = false;

    /*
    if(req.headers.authorization) {
        let [authType, token] = req.headers.authorization.split(' ');

        if(authType === "Bearer") {
            try {
                const decoded = JWT.verify(
                    token,
                    process.env.JWT_KEY as string
                );

                success = true;
            }
            catch(err) {
                
            }
        }
    }
    */

    //console.log(req.cookies);

    let authCookie = req.cookies.auth_session as string | null;

    //console.log(authCookie);

    //let authId = -1;// rawCookies.findIndex(cookie => cookie.includes("auth_session"));

    if(success == false && authCookie != null) {
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