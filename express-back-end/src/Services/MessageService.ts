import { Op } from "sequelize";
import { GroupMessage, GroupMessageInstance } from "../Models/GroupMessage";
import { MessageImage, MessageImageInstance } from "../Models/MessageImage";
import { User, UserInstance } from "../Models/User";
import { UserMessage, UserMessageInstance } from "../Models/UserMessage";
import MessageImageService from "./MessageImageService";
import { MessageImageType, MessageType, onUserGroupMsgType, onUserPrivateMsgType } from "./WebSocket";


class MessageService {
    public static async saveGroupMessage(author: UserInstance, msgData: onUserGroupMsgType): Promise<GroupMessageInstance | null> {
        let imgs = msgData.imgs;

        let messageImages: MessageImageInstance[] = [];
        let socketImgs: MessageImageType[] = [];

        if (imgs.length > 0) {
            messageImages = await MessageImageService.createMessageImages(imgs);
            socketImgs = await MessageImageService.messageImagesToSocketImages(author, messageImages);
        }

        let message = await GroupMessage.create({
            fromUserUuid: author.uuid,
            toGroupUuid: msgData.groupUuid,
            imageUuid: (messageImages.length > 0) ? messageImages[0].uuid : null,
            type: msgData.type,
            body: msgData.msg
        });

        message.imgs = socketImgs;

        return message;
    }

    public static async savePrivateUserMessage(author: UserInstance, msgData: onUserPrivateMsgType): Promise<UserMessageInstance | null> {
        let imgs = msgData.imgs;

        let messageImages: MessageImageInstance[] = [];
        let socketImgs: MessageImageType[] = [];

        if (imgs.length > 0) {
            messageImages = await MessageImageService.createMessageImages(imgs);
            socketImgs = await MessageImageService.messageImagesToSocketImages(author, messageImages);
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

    private static sortMessages(messages: MessageType[]) {
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

    public static async getUserMessages(userUuid: string) {
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

        /* userMessages = userMessages.sort((a, b) => {
            let dateA = new Date(a.createdAt).getTime();
            let dateB = new Date(b.createdAt).getTime();

            if (dateA > dateB) {
                return 1;
            } else if (dateA < dateB) {
                return -1;
            } else {
                return 0;
            }
        }); */

        let messages: MessageType[] = [];

        await new Promise<void>((resolve) => {
            let count = 0;

            userMessages.forEach(async (msg) => {
                let author = (await User.findOne({ where: { uuid: msg.fromUserUuid } }))!;
                author.password = undefined;
                author.id = undefined;

                let imgs: MessageImageType[] = [];

                if (msg.imageUuid != null) {
                    imgs = await MessageImageService.getUserMessageImages(author, msg);
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

    public static async getGroupMessages(groupUuid: string) {
        let groupMessages = await GroupMessage.findAll({
            where: {
                toGroupUuid: groupUuid
            },
            order: [
                ["createdAt", "ASC"]
            ]
        });

        /* groupMessages = groupMessages.sort((a, b) => {
            let dateA = new Date(a.createdAt).getTime();
            let dateB = new Date(b.createdAt).getTime();

            if (dateA > dateB) {
                return 1;
            } else if (dateA < dateB) {
                return -1;
            } else {
                return 0;
            }
        }); */

        let messages: MessageType[] = [];

        await new Promise<void>((resolve) => {
            let count = 0;

            groupMessages.forEach(async (msg) => {
                let author = (await User.findOne({ where: { uuid: msg.fromUserUuid } }))!;
                author.password = undefined;
                author.id = undefined;

                let imgs: MessageImageType[] = [];

                if (msg.imageUuid != null) {
                    imgs = await MessageImageService.getGroupMessageImages(author, msg);
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