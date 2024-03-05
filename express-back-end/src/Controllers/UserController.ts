import { Request, Response } from "express";
import * as AuthController from "./AuthController";
import { User, UserInstance } from "../Models/User";
import { UserRelation, UserRelationInstance } from "../Models/UserRelations";
import { Op, Sequelize } from "sequelize";

export const changeAvatar = async (req: Request, res: Response) => {
    const { filePath }: { filePath: string | null } = req.body;

    if(filePath == null) {
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

    if(loggedUser == null) { res.status(401); return res.send({ status: 401 }); }

    loggedUser.avatarSrc = filePath;
    await loggedUser.save();

    res.status(201);
    return res.send({
        status: 201
    });
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

    let friends: UserInstance[] = [];

    await new Promise<void>((resolve) => {
        let count = 0;

        userFriends.forEach(async (friend) => {
            let user = (await User.findOne({
                where: {
                    uuId: (friend.fromUserUuId != userUuId) ? friend.fromUserUuId : friend.toUserUuId
                }
            }))!;

            user.password = undefined;
            user.id = undefined;

            friends.push(user);
            count++;

            if(count == userFriends.length) { resolve(); }
        });

        if(count == userFriends.length) { resolve(); }
    });
    

    res.status(200);
    return res.send({
        userFriends: friends,
        status: 200
    });
}