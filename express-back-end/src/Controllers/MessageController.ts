import { Request, Response } from "express";
import { GroupMessage, GroupMessageInstance } from "../Models/GroupMessage";
import { User } from "../Models/User";

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
        }) as GroupMessageInstance[];
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
    });
    
    res.status(200);
    return res.send({
        groupMessages: groupMessages,
        status: 200
    });
}