import { Request, Response } from "express";
import AuthController from "./AuthController";
import { User, UserInstance } from "../Models/User";
import { UserRelation, UserRelationInstance } from "../Models/UserRelation";
import { Op, Sequelize } from "sequelize";
import FriendService from "../Services/FriendService";
import UserService from "../Services/UserService";


class UserController {
    
    static async changeAvatar(req: Request, res: Response) {
        const { filePath }: { filePath: string | null } = req.body;

        if (filePath == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string | null;

        let loggedUser = await AuthController.checkCookie(authCookie);

        if (loggedUser == false) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        loggedUser.avatarSrc = filePath;
        await loggedUser.save();

        res.status(201);
        return res.send({
            status: 201
        });
    }

    static async changeName(req: Request, res: Response) {
        const { newName }: { newName: string | null } = req.body;

        //console.log(newName);

        if (newName == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string | null;

        let loggedUser = await AuthController.checkCookie(authCookie);

        if (loggedUser == false) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        loggedUser.name = newName;

        try {
            await loggedUser.save();
        } catch (err) {
            console.error(err);
            res.status(500);
            return res.send({
                status: 500
            });
        }

        res.status(200);
        return res.send({
            status: 200
        });
    }


    static async getUserFriends(req: Request, res: Response) {
        let { userUuid } = req.params;

        if (userUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string | null;

        let loggedUser = await AuthController.checkCookie(authCookie);

        if (loggedUser == false) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        let userFriends = await FriendService.userFriends(loggedUser.uuid);

        res.status(200);
        return res.send({
            userFriends: userFriends,
            status: 200
        });
    }

    static async searchFriends(req: Request, res: Response) {
        let { searchName } = req.query as { searchName: string | null };

        if (searchName == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string | null;

        let loggedUser = await AuthController.checkCookie(authCookie);

        if(loggedUser == false) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        let users = await UserService.getUsersByNickName(searchName, loggedUser.uuid);

        res.status(200);
        return res.send({
            users: users,
            status: 200
        });
    }

    static async addFriend(req: Request, res: Response) {
        const { userUuid }: { userUuid: string | null } = req.body;

        if(userUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let authCookie = req.cookies.auth_session as string | null;

        let loggedUser = await AuthController.checkCookie(authCookie);

        if(loggedUser == false) {
            res.status(401);
            return res.send({
                status: 401
            });
        }

        let friendRelation = await FriendService.addOrRemoveFriend(loggedUser.uuid, userUuid);



        if(friendRelation.isFriend == false && friendRelation.isPending == true) {
            res.status(200);
            return res.send({
                friend: {
                    isPending: true,
                    isfriend: false
                },
                status: 200
            });
        } else if(friendRelation.isFriend == false && friendRelation.isPending == false) {
            res.status(200);
            return res.send({
                friend: {
                    isPending: false,
                    isfriend: false
                },
                status: 200
            });
        }

        let friend = (await User.findOne({
            where: {
                uuid: friendRelation.friend!.toUserUuid
            }
        }))!;

        res.status(201);
        return res.send({
            friend: {
                uuid: friend.uuid,
                isFriend: true,
                isPending: friendRelation?.isPending,
                avatarSrc: friend.avatarSrc,
                name: friend.name,
                nickName: friend.nickName,
                email: friend.email
            },
            status: 201
        });
    }

    static async getUserPendingFriends(req: Request, res: Response) {
        let { userUuid } = req.params as { userUuid: string | null };

        if(userUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let pendingFriends = await FriendService.getPendingFriends(userUuid);

        res.status(200);
        return res.send({
            pendingFriends: pendingFriends,
            status: 200
        });
    }

    static async getUserInfo(req: Request, res: Response) {
        let { userUuid } = req.params as { userUuid: string | null };

        if(userUuid == null) {
            res.status(400);
            return res.send({
                status: 400
            });
        }

        let user = await UserService.getUserInfo(userUuid);

        if(user == null) {
            res.status(404);
            return res.send({
                status: 404
            });
        }

        res.status(200);
        return res.send({
            user: {
                uuid: user.uuid,
                avatarSrc: user.avatarSrc,
                name: user.name,
                nickName: user.nickName,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            status: 200
        });
    }
}

export default UserController;



/* export const changeAvatar = async (req: Request, res: Response) => {
    const { filePath }: { filePath: string | null } = req.body;

    if (filePath == null) {
        res.status(400);
        return res.send({
            status: 400
        });
    }

    let authCookie = req.cookies.auth_session as string | null;

    let loggedUser = await AuthController.checkCookie(authCookie);

    if (loggedUser == false) {
        res.status(401);
        return res.send({
            status: 401
        });
    }

    loggedUser.avatarSrc = filePath;
    await loggedUser.save();

    res.status(201);
    return res.send({
        status: 201
    });
}

export const changeName = async (req: Request, res: Response) => {
    const { newName }: { newName: string | null } = req.body;

    //console.log(newName);

    if (newName == null) {
        res.status(400);
        return res.send({
            status: 400
        });
    }

    let authCookie = req.cookies.auth_session as string | null;

    let loggedUser = await AuthController.checkCookie(authCookie);

    if (loggedUser == false) {
        res.status(401);
        return res.send({
            status: 401
        });
    }

    loggedUser.name = newName;

    try {
        await loggedUser.save();
    } catch (err) {
        console.error(err);
        res.status(500);
        return res.send({
            status: 500
        });
    }

    res.status(200);
    return res.send({
        status: 200
    });
}

export const getUserFriends = async (req: Request, res: Response) => {
    let { userUuid } = req.params;

    if (userUuid == null) {
        res.status(400);
        return res.send({
            status: 400
        });
    }

    let authCookie = req.cookies.auth_session as string | null;

    let loggedUser = await AuthController.checkCookie(authCookie);

    if (loggedUser == false) {
        res.status(401);
        return res.send({
            status: 401
        });
    }


    let userFriends: UserRelationInstance[] = await UserRelation.findAll({
        where: {
            [Op.or]: {
                fromUserUuid: userUuid,
                toUserUuid: userUuid
            }
        }
    });

    let friends: UserInstance[] = [];

    await new Promise<void>((resolve) => {
        let count = 0;

        userFriends.forEach(async (friend) => {
            let user = (await User.findOne({
                where: {
                    uuid: (friend.fromUserUuid != userUuid) ? friend.fromUserUuid : friend.toUserUuid
                }
            }))!;

            user.password = undefined;
            user.id = undefined;

            friends.push(user);
            count++;

            if (count == userFriends.length) { resolve(); }
        });

        if (count == userFriends.length) { resolve(); }
    });


    res.status(200);
    return res.send({
        userFriends: friends,
        status: 200
    });
}


export const searchFriends = async (req: Request, res: Response) => {
    let { searchName } = req.query as { searchName: string | null };

    if (searchName == null) {
        res.status(400);
        return res.send({
            status: 400
        });
    }


    let users = (await User.findAll({
        where: {
            nickName: {
                [Op.like]: `${searchName}%`
            }
        }
    })).map((usr, idx) => {
        usr.password = undefined;
        return usr;
    });

    res.status(200);
    return res.send({
        users: users,
        status: 200
    });
} */