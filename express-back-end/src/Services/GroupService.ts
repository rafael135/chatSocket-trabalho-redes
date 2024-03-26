import { Group, GroupInstance } from "../Models/Group";
import { GroupAdmin } from "../Models/GroupAdmin";
import { GroupRelation } from "../Models/GroupRelation";



class GroupService {
    public static async newGroup(name: string, userUuid: string) {
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
}

export default GroupService;