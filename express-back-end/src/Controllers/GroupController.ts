import { Request, Response } from "express";
import { User } from "../Models/User";
import { GroupRelation, GroupRelationInstance } from "../Models/GroupRelation";
import { Group, GroupInstance } from "../Models/Group";
import GroupService from "../Services/GroupService";
import AuthController from "./AuthController";


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

    public static async getGroupMembers(req: Request, res: Response) {
        let { groupUuid } = req.params as { groupUuid: string | null };

        if(groupUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let members = await GroupService.getGroupMembers(groupUuid);

        res.status(200);
        return res.send({
            groupMembers: members,
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

    public static async inviteUserToGroup(req: Request, res: Response) {
        let { groupUuid, userUuid } = req.params as { groupUuid: string | null, userUuid: string | null };

        if(groupUuid == null || userUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let invitation = await GroupService.inviteUserToGroup(groupUuid, userUuid);

        if(invitation == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        res.status(201);
        return res.send({
            groupInvitation: invitation,
            status: 201
        });
    }

    public static async exitFromGroup(req: Request, res: Response) {
        let { groupUuid } = req.params as { groupUuid: string | null };

        if(groupUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string | null;

        let loggedUser = await AuthController.checkCookie(authCookie);

        if(loggedUser == false) {
            res.status(403);
            return res.send({
                status: 403
            });
        }

        let success = await GroupService.removeMemberFromGroup(groupUuid, loggedUser.uuid);

        if(success == false) {
            res.status(406);
            return res.send({
                status: 406
            });
        }

        res.status(200);
        return res.send({
            status: 200
        });
    }
}

export default GroupController;