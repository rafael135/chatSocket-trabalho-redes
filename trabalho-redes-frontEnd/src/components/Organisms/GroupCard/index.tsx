import { getGroupMessages } from "@/lib/actions";
import { Group } from "@/types/Group";
import { GroupMessage } from "@/types/Message";
import { User } from "@/types/User";
import { useLayoutEffect, useState } from "react";
import { Socket } from "socket.io-client";


type props = {
    group: Group;
    loggedUser: User;
    socket: Socket;
}

const GroupCard = ({ group, loggedUser, socket }: props) => {
    
    const [groupMessages, setGroupMessages] = useState<GroupMessage[]>([]);

    useLayoutEffect(() => {
        getGroupMessages(group.uuId).then((res) => {
            setGroupMessages(res);
        });
    }, [groupMessages]);

    return(
        <div className="w-full h-8 border-solid border-b border-b-gray-600/40">
            {group.uuId}
        </div>
    );
}

export default GroupCard;