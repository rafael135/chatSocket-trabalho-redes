import { Request, Response } from "express";
import * as AuthController from "./AuthController";
import { GroupMessage, GroupMessageInstance } from "../Models/GroupMessage";
import { User } from "../Models/User";
import { UserMessage, UserMessageInstance } from "../Models/UserMessage";
import { Op } from "sequelize";
import { MessageType } from "../Utils/WebSocket";

export const saveMessage = async (req: Request, res: Response) => {
    
}

export const savePrivateUserMsg = async (req: Request, res: Response) => {

}

export const saveGroupMsg = async (req: Request, res: Response) => {
    
}

export const getGroupMessages = async (req: Request, res: Response) => {
    let { groupUuId } = req.params;

    if(groupUuId == null) {
        res.status(400);
        return res.send({
            status: 400
        });
    }

    let groupMessages: GroupMessageInstance[] = [];

    try {
        groupMessages = await GroupMessage.findAll({
            where: {
                toGroupUuId: groupUuId
            }
        });
    }
    catch(err) {
        console.error(err);

        res.status(500);
        return res.send({
            groupMessages: [],
            status: 500
        });
    }

    await new Promise<void>((resolve) => {
        let qteMsg = groupMessages.length;
        let count = 0;

        groupMessages.forEach( async (msg) => {
            msg.user = (await User.findOne({ where: { uuId: msg.fromUserUuId } }))!;
            count++;

            if(count == qteMsg) {
                resolve();
            }
        });

        if(count == qteMsg) { resolve(); }
    });

    let messages: MessageType[] = groupMessages.map((msg) => {
        return {
            author: msg.user,
            type: "msg",
            to: "group",
            msg: msg.body,
            toUuId: msg.toGroupUuId
        };
    });
    
    res.status(200);
    return res.send({
        groupMessages: messages,
        status: 200
    });
}

export const getUserMessages = async (req: Request, res: Response) => {
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

    let userMessages: UserMessageInstance[] = [];

    let msgs1 = await UserMessage.findAll({
        where: {
            fromUserUuId: userUuId,
            toUserUuId: loggedUser!.uuId
        }
    });

    let msgs2 = await UserMessage.findAll({
        where: {
            fromUserUuId: loggedUser!.uuId,
            toUserUuId: userUuId
        }
    });

    await new Promise<void>((resolve) => {
        let count = 0;

        msgs1.forEach(async (msg) => {
            msg.user = (await User.findOne({ where: { uuId: userUuId } }))!;
            count++;

            if(count == msgs1.length) {
                resolve();
            }
        })

        if(count == msgs1.length) {
            resolve();
        }
    })
    

    await new Promise<void>((resolve) => {
        let count = 0;

        msgs2.forEach(async (msg) => {
            msg.user = (await User.findOne({ where: { uuId: userUuId } }))!;
            count++;

            if(count == msgs2.length) {
                resolve();
            }
        })

        if(count == msgs2.length) {
            resolve();
        }
    })

    msgs1.forEach((msg) => {
        userMessages.push(msg);
    });

    msgs2.forEach((msg) => {
        userMessages.push(msg);
    });


    userMessages.sort((a, b) => {
        let dateA = new Date(a.createdAt).getTime();
        let dateB = new Date(b.createdAt).getTime();



        return dateB - dateA;
    });

    let messages: MessageType[] = userMessages.map((msg) => {
        return {
            type: "msg",
            msg: msg.body,
            to: "user",
            toUuId: msg.toUserUuId
        }
    });

    res.status(200);
    return res.send({
        userMessages: messages,
        status: 200
    });
}