import { GroupMessage, GroupMessageInstance } from "../Models/GroupMessage";
import { MessageImage, MessageImageInstance } from "../Models/MessageImage";
import { UserInstance } from "../Models/User";
import { UserMessage, UserMessageInstance } from "../Models/UserMessage";
import { MessageImageType, onUserGroupMsgType, onUserPrivateMsgType } from "./WebSocket";


class MessageService {
    public static async saveGroupMessage(fromUser: UserInstance, msgData: onUserGroupMsgType): Promise<GroupMessageInstance | null> {
        let message = await GroupMessage.create({
            fromUserUuid: fromUser.uuid,
            toGroupUuid: msgData.groupUuid,
            type: msgData.type,
            body: msgData.msg
        });

        return message;
    }

    public static async savePrivateUserMessage(fromUser: UserInstance, msgData: onUserPrivateMsgType): Promise<UserMessageInstance | null> {
        console.log(msgData.imgs);

        let imgs = msgData.imgs;

        let messageImages: MessageImageInstance[] = [];

        if(imgs.length > 0) {
            imgs.reverse();

            for(let i = 0; i < imgs.length; i++) {
                messageImages.push(await MessageImage.create({
                    nextImageUuid: (messageImages.length > 0) ? messageImages[i-1].uuid : null,
                    path: imgs[i]
                }));
            }

            messageImages.reverse();
        }

        let socketImgs: MessageImageType[] = [];

        for(let i = 0; i < messageImages.length; i++) {
            socketImgs.push({
                authorUuid: fromUser.uuid,
                path: messageImages[i].path
            });
        }

        let message = await UserMessage.create({
            fromUserUuid: fromUser.uuid,
            toUserUuid: msgData.userUuid,
            imageUuid: (messageImages.length > 0) ? messageImages[0].uuid : null,
            type: msgData.type,
            body: msgData.msg
        });

        message.imgs = socketImgs;

        return message;
    }
}

export default MessageService;