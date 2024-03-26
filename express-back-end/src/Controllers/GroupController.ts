import { Request, Response } from "express";
import { User } from "../Models/User";
import { GroupRelation, GroupRelationInstance } from "../Models/GroupRelation";
import { Group, GroupInstance } from "../Models/Group";
import GroupService from "../Services/GroupService";


class GroupController {
    public static async getUserGroups(req: Request, res: Response) {
        let { userUuid } = req.params;

        let user = await User.findOne({
            where: {
                uuid: userUuid
            }
        });

        if (user == null) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        let groupRelations = await GroupRelation.findAll({
            where: {
                userUuid: user.uuid
            }
        });

        let groups = await new Promise<GroupInstance[]>((resolve) => {
            let grs: GroupInstance[] = [];

            groupRelations.forEach(async (groupR) => {
                let group = await Group.findOne({
                    where: {
                        uuid: groupR.groupUuid
                    }
                }) as GroupInstance;

                grs.push(group);

                if (grs.length == groupRelations.length) {
                    resolve(grs);
                }
            });

            if (grs.length == groupRelations.length) { resolve([]); }
        });

        res.status(200);
        return res.send({
            groups: groups,
            status: 200
        });
    }

    public static async createNewGroup(req: Request, res: Response) {
        let { groupName, userUuid } = req.body;

        if (groupName == null || userUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let user = await User.findOne({ where: { uuid: userUuid } });

        if (user == null) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        let newGroup = await GroupService.newGroup(groupName, userUuid);

        if(newGroup != null) {
            res.status(201);
            return res.send({
                group: newGroup,
                status: 201
            });
        } else {
            res.status(500);
            return res.send({
                status: 500
            });
        }
        
    }
}

export default GroupController;