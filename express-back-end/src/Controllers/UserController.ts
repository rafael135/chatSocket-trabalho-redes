import { Request, Response } from "express";
import * as AuthController from "./AuthController";
import { User } from "../Models/User";
import { UserRelation, UserRelationInstance } from "../Models/UserRelations";
import { Op, Sequelize } from "sequelize";

export const changeAvatar = async (req: Request, res: Response) => {
    
}

export const getUserFriends = async (req: Request, res: Response) => {
    let { userUuId } = req.params;

    if(userUuId == null) {
        res.status(400);
        return res.send({
            status: 400
        });
    }

    let authCookie = req.cookies.auth_session as string | null;

    if(authCookie == null) {
        res.status(401);
        return res.send({
            status: 401
        });
    }

    let logUser = AuthController.decodeToken(authCookie);

    if(logUser == null) {
        res.status(401);
        return res.send({
            status: 401
        });
    }

    let loggedUser = await User.findOne({
        where: {
            uuId: logUser.uuId
        }
    });


    let userFriends: UserRelationInstance[] = await UserRelation.findAll({
        where: {
            [Op.or]: {
                fromUserUuId: userUuId,
                toUserUuId: userUuId
            }
        }
    });

    res.status(200);
    return res.send({
        userFriends: userFriends,
        status: 200
    });
}