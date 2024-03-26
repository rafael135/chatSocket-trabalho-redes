import { GroupMessage, GroupMessageInstance } from "../Models/GroupMessage";
import { UserInstance } from "../Models/User";
import { UserMessage, UserMessageInstance } from "../Models/UserMessage";
import { onUserGroupMsgType, onUserPrivateMsgType } from "./WebSocket";


class MessageService {
    public static async saveGroupMessage(fromUser: UserInstance, msgData: onUserGroupMsgType): Promise<GroupMessageInstance | null> {
        let message = await GroupMessage.create({
            fromUserUuid: fromUser.uuid,
            toGroupUuid: msgData.groupUuid,
            body: msgData.msg
        });

        return message;
    }

    public static async savePrivateUserMessage(fromUser: UserInstance, msgData: onUserPrivateMsgType): Promise<UserMessageInstance | null> {
        let message = await UserMessage.create({
            fromUserUuid: fromUser.uuid,
            toUserUuid: msgData.userUuid,
            body: msgData.msg
        });

        return message;
    }
}

export default MessageService;