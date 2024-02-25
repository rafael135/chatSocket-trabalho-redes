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
    });

    let groups = await new Promise<GroupInstance[]>((resolve) => {
        let grs: GroupInstance[] = [];

        groupRelations.forEach(async (groupR) => {
            let group = await Group.findOne({
                where: {
                    uuId: groupR.groupUuId
                }
            }) as GroupInstance;

            grs.push(group);

            if(grs.length == groupRelations.length) {
                resolve(grs);
            }
        });

        if(grs.length == groupRelations.length) { resolve([]); }
    });
    
    res.status(200);
    return res.send({
        groups: groups,
        status: 200
    });
}

export const createNewGroup = async (req: Request, res: Response) => {
    let { groupName, userUuId } = req.body;

    if(groupName == null || userUuId == null) {
        res.status(400);
        return res.send({
            status: 400
        });
    }

    let user = await User.findOne({ where: { uuId: userUuId } });

    if(user == null) {
        res.status(401);
        return res.send({
            status: 401
        });
    }

    let newGroup = await Group.create({
        name: groupName,
        groupAdmins: `${user.id}`
    }) as GroupInstance;

    GroupRelation.create({
        groupUuId: newGroup.uuId,
        userUuId: user.uuId
    });

    res.status(201);
    return res.send({
        group: newGroup,
        status: 201
    });
}