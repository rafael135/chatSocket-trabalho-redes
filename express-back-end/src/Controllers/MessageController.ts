import { Request, Response } from "express";
import AuthController from "./AuthController";
import { GroupMessage, GroupMessageInstance } from "../Models/GroupMessage";
import { User } from "../Models/User";
import { UserMessage, UserMessageInstance } from "../Models/UserMessage";
import { Op } from "sequelize";
import { MessageImageType, MessageType } from "../Services/WebSocket";
import { MessageImage, MessageImageInstance } from "../Models/MessageImage";
import MessageService from "../Services/MessageService";
import TokenService from "../Services/TokenService";
import { GET, route } from "awilix-express";


@route("/api/message")
class MessageController {
    private readonly _tokenService: TokenService;
    private readonly _messageService: MessageService;

    constructor(tokenService: TokenService, messageService: MessageService) {
        this._tokenService = tokenService;
        this._messageService = messageService;
    }


    @route("/group/:groupUuid")
    @GET()
    public async getGroupMessages(req: Request, res: Response) {
        let { groupUuid } = req.params;

        if (groupUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let messages: MessageType[] = await this._messageService.getGroupMessages(groupUuid);

        res.status(200);
        return res.send({
            groupMessages: messages,
            status: 200
        });
    }


    @route("/user/:userUuid")
    @GET()
    public async getUserMessages(req: Request, res: Response) {
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

        let logUser = this._tokenService.decodeToken(authCookie);

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

        let messages = await this._messageService.getUserMessages(userUuid);

        res.status(200);
        return res.send({
            userMessages: messages,
            status: 200
        });
    }
}

export default MessageController;