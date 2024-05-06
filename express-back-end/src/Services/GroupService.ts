import { Group, GroupInstance } from "../Models/Group";
import { GroupAdmin } from "../Models/GroupAdmin";
import { GroupInvitation } from "../Models/GroupInvitation";
import { GroupRelation } from "../Models/GroupRelation";
import { User, UserInstance } from "../Models/User";



class GroupService {
    public async newGroup(name: string, userUuid: string) {
        let newGroup: GroupInstance | null = null;

        try {
            newGroup = await Group.create({
                name: name
            });
    
            await GroupRelation.create({
                groupUuid: newGroup.uuid,
                userUuid: userUuid
            });
    
            await GroupAdmin.create({
                userUuid: userUuid,
                groupUuid: newGroup.uuid
    
            });
        }
        catch(err) {
            console.error(err);
        }
        
        return newGroup
    }

    public async inviteUserToGroup(groupUuid: string, userUuid: string) {
        let isMember = await GroupRelation.findOne({
            where: {
                groupUuid: groupUuid,
                userUuid: userUuid
            }
        });

        if(isMember != null) {
            return null;
        }

        let newInvitation = await GroupInvitation.create({
            groupUuid: groupUuid,
            userUuid: userUuid
        });

        return newInvitation;
    }

    public async getGroupMembers(groupUuid: string) {
        let members = await GroupRelation.findAll({
            where: {
                groupUuid: groupUuid
            }
        });

        let users: UserInstance[] = [];

        let count = 0;
        let membersLength = members.length;

        await new Promise<void>(async (resolve) => {
            for(let i = 0; i < membersLength; i++) {
                let user = await User.findOne({
                    where: {
                        uuid: members[i].userUuid
                    }
                });

                if(user != null) {
                    user.id = undefined;
                    user.password = undefined;

                    users.push(user);
                }
                count++;

                if(count == membersLength) { resolve(); }
            }

            if(count == membersLength) { resolve(); }
        });

        return users;        
    }

    public async removeMemberFromGroup(groupUuid: string, memberUuid: string) {
        let isAdmin = await GroupAdmin.findOne({
            where: {
                groupUuid: groupUuid,
                userUuid: memberUuid
            }
        });

        if(isAdmin != null) {
            await isAdmin.destroy();
        }

        let res = await GroupRelation.destroy({
            where: {
                groupUuid: groupUuid,
                userUuid: memberUuid
            },
            limit: 1
        });

        let groupRelations = await GroupRelation.count({
            where: {
                groupUuid: groupUuid
            }
        });

        if(groupRelations == 0) {
            await Group.destroy({
                where: {
                    uuid: groupUuid
                }
            });
        }

        return res > 0 ? true : false;
    }
}

export default GroupService;