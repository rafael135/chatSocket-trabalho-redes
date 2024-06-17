import { Op } from "sequelize";
import { GroupMessage, GroupMessageInstance } from "../Models/GroupMessage";
import { MessageImage, MessageImageInstance } from "../Models/MessageImage";
import { User, UserInstance } from "../Models/User";
import { UserMessage, UserMessageInstance } from "../Models/UserMessage";
import MessageImageService from "./MessageImageService";
import { MessageImageType, MessageType, onUserGroupMsgType, onUserPrivateMsgType } from "./WebSocket";


type MessageObjectType = {
    uuid: string;
    fromUserUuid: string;
    toGroupUuid: string;
    imageUuid: string | null;
    type: "new-user" | "exit-user" | "msg" | "img" | "error";
    body: string;
    imgs: MessageImageType[];
    createdAt: string;
    updatedAt: string;
}
class MessageService {
    private readonly _messageImageService: MessageImageService;

    constructor(messageImageService: MessageImageService) {
        this._messageImageService = messageImageService;
    }

    public async saveGroupMessage(author: UserInstance, msgData: onUserGroupMsgType): Promise<MessageObjectType | null> {
        let imgs = msgData.imgs;

        let messageImages: MessageImageInstance[] = [];
        let socketImgs: MessageImageType[] = [];

        if (imgs.length > 0) {
            messageImages = await this._messageImageService.createMessageImages(imgs);
            socketImgs = await this._messageImageService.messageImagesToSocketImages(author, messageImages);
        }

        let message = await GroupMessage.create({
            fromUserUuid: author.uuid,
            toGroupUuid: msgData.groupUuid,
            imageUuid: (messageImages.length > 0) ? messageImages[0].uuid : null,
            type: msgData.type,
            body: msgData.msg
        });

        //message.imgs = socketImgs;

        let messageObject: MessageObjectType = {
            uuid: message.uuid,
            fromUserUuid: message.fromUserUuid,
            toGroupUuid: message.toGroupUuid,
            imageUuid: message.imageUuid,
            type: message.type,
            body: message.body,
            imgs: socketImgs,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt
        };

        return messageObject;
    }

    public async savePrivateUserMessage(author: UserInstance, msgData: onUserPrivateMsgType): Promise<UserMessageInstance | null> {
        let imgs = msgData.imgs;

        let messageImages: MessageImageInstance[] = [];
        let socketImgs: MessageImageType[] = [];

        if (imgs.length > 0) {
            messageImages = await this._messageImageService.createMessageImages(imgs);
            socketImgs = await this._messageImageService.messageImagesToSocketImages(author, messageImages);
        }

        let message = await UserMessage.create({
            fromUserUuid: author.uuid,
            toUserUuid: msgData.userUuid,
            imageUuid: (messageImages.length > 0) ? messageImages[0].uuid : null,
            type: msgData.type,
            body: msgData.msg
        });

        message.imgs = socketImgs;

        return message;
    }

    private sortMessages(messages: MessageType[]) {
        let sortedMessages = messages.sort((a, b) => {
            let dateA = new Date(a.time!).getTime();
            let dateB = new Date(b.time!).getTime();

            if (dateA > dateB) {
                return 1;
            } else if (dateA < dateB) {
                return -1;
            } else {
                return 0;
            }
        });

        return sortedMessages;
    }

    public async getUserMessages(userUuid: string) {
        let userMessages = await UserMessage.findAll({
            where: {
                [Op.or]: [
                    { fromUserUuid: userUuid },
                    { toUserUuid: userUuid }
                ]
            },
            order: [
                ["createdAt", "ASC"]
            ]
        });

        let messages: MessageType[] = [];

        await new Promise<void>((resolve) => {
            let count = 0;

            userMessages.forEach(async (msg) => {
                let author = (await User.findOne({ where: { uuid: msg.fromUserUuid } }))!;
                author.password = undefined;
                author.id = undefined;

                let imgs: MessageImageType[] = [];

                if (msg.imageUuid != null) {
                    imgs = await this._messageImageService.getUserMessageImages(author, msg);
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

        messages = this.sortMessages(messages);

        return messages;
    }

    public async getGroupMessages(groupUuid: string) {
        let groupMessages = await GroupMessage.findAll({
            where: {
                toGroupUuid: groupUuid
            },
            order: [
                ["createdAt", "ASC"]
            ]
        });

        let messages: MessageType[] = [];

        await new Promise<void>((resolve) => {
            let count = 0;

            groupMessages.forEach(async (msg) => {
                let author = (await User.findOne({ where: { uuid: msg.fromUserUuid } }))!;
                author.password = undefined;
                author.id = undefined;

                let imgs: MessageImageType[] = [];

                if (msg.imageUuid != null) {
                    imgs = await this._messageImageService.getGroupMessageImages(author, msg);
                }

                messages.push({
                    author: author,
                    type: msg.type,
                    msg: msg.body,
                    imgs: imgs,
                    to: "group",
                    toUuid: msg.toGroupUuid,
                    time: msg.createdAt
                });

                count++;

                if (count == groupMessages.length) { resolve(); }
            });

            if (count == groupMessages.length) { resolve(); }
        });

        messages = this.sortMessages(messages);

        return messages;
    }
}

export default MessageService;