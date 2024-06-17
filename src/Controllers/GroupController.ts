import { Request, Response } from "express";
import { User } from "../Models/User";
import { GroupRelation, GroupRelationInstance } from "../Models/GroupRelation";
import { Group, GroupInstance } from "../Models/Group";
import GroupService from "../Services/GroupService";
import AuthController from "./AuthController";
import { DELETE, GET, POST, before, route } from "awilix-express";
import checkToken from "../Middlewares/Auth";
import AuthService from "../Services/AuthService";
import { GroupAdmin } from "../Models/GroupAdmin";


@route("/api/group")
class GroupController {
    private readonly _authService: AuthService;
    private readonly _groupService: GroupService;

    constructor(authService: AuthService, groupService: GroupService) {
        this._authService = authService;
        this._groupService = groupService;
    }

    @route("/:groupUuid/members")
    @GET()
    public async getGroupMembers(req: Request, res: Response) {
        let { groupUuid } = req.params as { groupUuid: string | null };

        if(groupUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let members = await this._groupService.getGroupMembers(groupUuid);

        res.status(200);
        return res.send({
            groupMembers: members,
            status: 200
        });
    }

    @route("/")
    @POST()
    @before(checkToken)
    public async createNewGroup(req: Request, res: Response) {
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

        let newGroup = await this._groupService.newGroup(groupName, userUuid);

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

    @route("/:groupUuid/invite/:userUuid")
    @POST()
    @before(checkToken)
    public async inviteUserToGroup(req: Request, res: Response) {
        let { groupUuid, userUuid } = req.params as { groupUuid: string | null, userUuid: string | null };

        if(groupUuid == null || userUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let invitation = await this._groupService.inviteUserToGroup(groupUuid, userUuid);

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

    @route("/:groupUuid/exit")
    @DELETE()
    @before(checkToken)
    public async exitFromGroup(req: Request, res: Response) {
        let { groupUuid } = req.params as { groupUuid: string | null };

        if(groupUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string;

        let loggedUser = await this._authService.getLoggedUser(authCookie);

        if(loggedUser == null) {
            res.status(403);
            return res.send({
                status: 403
            });
        }

        let success = await this._groupService.removeMemberFromGroup(groupUuid, loggedUser.uuid);

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


    @route("/:groupUuid/admin/:userUuid")
    @GET()
    @before(checkToken)
    public async isUserGroupAdmin(req: Request, res: Response) {
        let authCookie = req.headers.auth_session as string;

        let loggedUser = await this._authService.getLoggedUser(authCookie);

        if(loggedUser == null) {
            res.status(403);
            return res.send({
                isAdmin: false,
                status: 403
            });
        }

        let { userUuid, groupUuid } = req.query as { userUuid: string | null, groupUuid: string | null };

        let groupAdmin = await GroupAdmin.findOne({
            where: {
                groupUuid: groupUuid,
                userUuid: userUuid
            }
        });

        if(groupAdmin != null) {
            res.status(200);
            return res.send({
                isAdmin: true,
                status: 200
            });
        } else {
            res.status(403);
            return res.send({
                isAdmin: false,
                status: 403
            });
        }
    }
}

export default GroupController;