import { Request, Response } from "express";
import { User } from "../Models/User";
import { GroupRelation, GroupRelationInstance } from "../Models/GroupRelation";
import { Group, GroupInstance } from "../Models/Group";

export const getUserGroups = async (req: Request, res: Response) => {
    let { userUuId } = req.params;

    let user = await User.findOne({
        where: {
            uuId: userUuId
        }
    });

    if(user == null) {
        res.status(401);
        return res.send({
            status: 401
        });
    }

    let groupRelations = await GroupRelation.findAll({
        where: {
            userUuId: user.uuId
        }
    }) as GroupRelationInstance[];

    let groups = await new Promise<GroupInstance[]>((resolve) => {
        let grs: GroupInstance[] = [];

        let groupRLength = groupRelations.length;
        let count = 0;

        groupRelations.forEach(async (groupR) => {
            let group = await Group.findOne({
                where: {
                    uuId: groupR.groupUuId
                }
            }) as GroupInstance;
    
            grs.push(group);
            count++;

            if(count == groupRLength) {
                resolve(grs);
            }
        });
    });
    
    res.status(200);
    return res.send({
        groups: groups,
        status: 200
    });
}

export const createNewGroup = async (req: Request, res: Response) => {
    let creatorUuId = req.body;

    console.log(creatorUuId);
}