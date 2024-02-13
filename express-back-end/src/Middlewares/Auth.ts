import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import JWT from "jsonwebtoken";

dotenv.config();

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
    let success = false;

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

    if(success == true) {
        next();
    } else {
        res.status(401);
        res.json({
            error: "",
            status: 401
        });
    }
}

export default checkToken;