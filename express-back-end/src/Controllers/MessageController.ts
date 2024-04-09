import { Request, Response } from "express";
import AuthController from "./AuthController";
import { GroupMessage, GroupMessageInstance } from "../Models/GroupMessage";
import { User } from "../Models/User";
import { UserMessage, UserMessageInstance } from "../Models/UserMessage";
import { Op } from "sequelize";
import { MessageImageType, MessageType } from "../Services/WebSocket";
import { MessageImage, MessageImageInstance } from "../Models/MessageImage";
import MessageService from "../Services/MessageService";


class MessageController {
    public static async getGroupMessages(req: Request, res: Response) {
        let { groupUuid } = req.params;

        if (groupUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let messages: MessageType[] = await MessageService.getGroupMessages(groupUuid);

        res.status(200);
        return res.send({
            groupMessages: messages,
            status: 200
        });
    }



    public static async getUserMessages(req: Request, res: Response) {
        let { userUuid } = req.params;

        //console.log(userUuid);

        if (userUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string | null;

        if (authCookie == null) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        let logUser = AuthController.decodeToken(authCookie);

        if (logUser == null) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        let loggedUser = await User.findOne({
            where: {
                uuid: logUser.uuid
            }
        });

        let messages = await MessageService.getUserMessages(userUuid);

        res.status(200);
        return res.send({
            userMessages: messages,
            status: 200
        });
    }
}

export default MessageController;