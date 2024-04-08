import { Request, Response } from "express";
import AuthController from "./AuthController";
import { GroupMessage, GroupMessageInstance } from "../Models/GroupMessage";
import { User } from "../Models/User";
import { UserMessage, UserMessageInstance } from "../Models/UserMessage";
import { Op } from "sequelize";
import { MessageImageType, MessageType } from "../Services/WebSocket";
import { MessageImage, MessageImageInstance } from "../Models/MessageImage";


class MessageController {
    public static async saveMessage() {
        
    }

    public static async savePrivateUserMsg() {

    }

    public static async saveGroupMsg() {

    }

    public static async getGroupMessages(req: Request, res: Response) {
        let { groupUuid } = req.params;

        if (groupUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let groupMessages: GroupMessageInstance[] = [];

        try {
            groupMessages = await GroupMessage.findAll({
                where: {
                    toGroupUuid: groupUuid
                }
            });
        }
        catch (err) {
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

            groupMessages.forEach(async (msg) => {
                let user = (await User.findOne({ where: { uuid: msg.fromUserUuid } }))!;
                user.id = undefined;
                user.password = undefined;

                msg.user = user;
                count++;

                if (count == qteMsg) {
                    resolve();
                }
            });

            if (count == qteMsg) { resolve(); }
        });

        groupMessages = groupMessages.sort((a, b) => {
            let dateA = new Date(a.createdAt).getTime();
            let dateB = new Date(b.createdAt).getTime();

            if (dateA > dateB) {
                return 1;
            } else if (dateA < dateB) {
                return -1;
            } else {
                return 0;
            }
        });



        let messages: MessageType[] = groupMessages.map((msg) => {
            return {
                author: msg.user,
                type: "msg",
                to: "group",
                msg: msg.body,
                toUuid: msg.toGroupUuid,
                time: msg.createdAt
            };
        });

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

        let userMessages: UserMessageInstance[] = [];

        userMessages = await UserMessage.findAll({
            where: {
                [Op.or]: [
                    { fromUserUuid: userUuid },
                    { toUserUuid: userUuid }
                ]
            }
        });


        userMessages = userMessages.sort((a, b) => {
            let dateA = new Date(a.createdAt).getTime();
            let dateB = new Date(b.createdAt).getTime();

            if (dateA > dateB) {
                return 1;
            } else if (dateA < dateB) {
                return -1;
            } else {
                return 0;
            }
        });

        let messages: MessageType[] = [];

        await new Promise<void>((resolve) => {
            let count = 0;

            userMessages.forEach(async (msg) => {
                let author = (await User.findOne({ where: { uuid: msg.fromUserUuid } }))!;
                author.password = undefined;
                author.id = undefined;

                let imgs: MessageImageType[] = [];

                if(msg.imageUuid != null) {
                    let currentImageUuid: string | null = msg.imageUuid;

                    do{
                        let img: MessageImageInstance = (await MessageImage.findOne({ where: { uuid: currentImageUuid } }))!;

                        imgs.push({
                            authorUuid: author.uuid,
                            path: img.path
                        });

                        currentImageUuid = img.nextImageUuid;


                    } while(currentImageUuid != null);
                }

                messages.push({
                    author: author,
                    type: msg.type,
                    msg: msg.body,
                    imgs: imgs,
                    to: "user",
                    toUuid: msg.toUserUuid,
                    time: msg.createdAt
                });

                count++;

                if (count == userMessages.length) { resolve(); }
            });

            if (count == userMessages.length) { resolve(); }
        });


        res.status(200);
        return res.send({
            userMessages: messages,
            status: 200
        });
    }
}

export default MessageController;