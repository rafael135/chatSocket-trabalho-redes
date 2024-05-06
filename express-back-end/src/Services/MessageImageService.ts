import { GroupMessageInstance } from "../Models/GroupMessage";
import { MessageImage, MessageImageInstance } from "../Models/MessageImage";
import { UserInstance } from "../Models/User";
import { UserMessageInstance } from "../Models/UserMessage";
import { MessageImageType } from "./WebSocket";




class MessageImageService {
    public async createMessageImages(imgs: MessageImageType[]) {
        let messageImages: MessageImageInstance[] = [];

        imgs.reverse();

        for (let i = 0; i < imgs.length; i++) {
            messageImages.push(await MessageImage.create({
                nextImageUuid: (messageImages.length > 0) ? messageImages[i - 1].uuid : null,
                path: imgs[i]
            }));
        }

        messageImages.reverse();

        return messageImages;
    }

    public async messageImagesToSocketImages(author: UserInstance, messageImages: MessageImageInstance[]) {
        let socketImgs: MessageImageType[] = [];

        for (let i = 0; i < messageImages.length; i++) {
            socketImgs.push({
                authorUuid: author.uuid,
                path: messageImages[i].path
            });
        }

        return socketImgs;
    }

    public async getUserMessageImages(author: UserInstance, msg: UserMessageInstance) {
        let imgs: MessageImageType[] = [];

        let currentImageUuid: string | null = msg.imageUuid;

        do {
            let img: MessageImageInstance = (await MessageImage.findOne({ where: { uuid: currentImageUuid } }))!;

            imgs.push({
                authorUuid: author.uuid,
                path: img.path
            });

            currentImageUuid = img.nextImageUuid;


        } while (currentImageUuid != null);

        return imgs;
    }

    public async getGroupMessageImages(author: UserInstance, msg: GroupMessageInstance) {
        let imgs: MessageImageType[] = [];

        let currentImageUuid: string | null = msg.imageUuid;

        do {
            let img: MessageImageInstance = (await MessageImage.findOne({ where: { uuid: currentImageUuid } }))!;

            imgs.push({
                authorUuid: author.uuid,
                path: img.path
            });

            currentImageUuid = img.nextImageUuid;
        } while (currentImageUuid != null);

        return imgs;
    }
}

export default MessageImageService;