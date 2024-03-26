import Paragraph from "@/components/Atoms/Paragraph";
import { getGroupMessages } from "@/lib/actions";
import { Group } from "@/types/Group";
import { GroupMessage, MessageType, SelectedChatInfo } from "@/types/Message";
import { User } from "@/types/User";
import { useLayoutEffect, useState } from "react";
import { Socket } from "socket.io-client";
import styled from "styled-components";


const StyledGroupCard = styled.div.attrs(() => ({}))`
    width: 100%;
    padding-left: 0.25rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    //border-bottom: 1px solid rgb(75 85 99 / 0.4);
    cursor: pointer;
    border: 1px solid rgb(75 85 99 / 0.4);
    border-radius: 8px;

    
    &.selected {
        background-color: rgb(28 100 242);
        color: #FFF;
    }
    &.selected p {
        color: #FFF;
    }
`;


type props = {
    idx: number;
    group: Group;
    setSelected: (info: SelectedChatInfo) => void;
    loggedUser: User;
    socket: Socket;
    className?: string;
}

const GroupCard = ({ idx, group, setSelected, loggedUser, socket, className }: props) => {
    
    const [groupMessages, setGroupMessages] = useState<MessageType[]>([]);

    useLayoutEffect(() => {
        getGroupMessages(group.uuid).then((res) => {
            setGroupMessages(res);
        });
    }, []);

    return(
        <StyledGroupCard className={className} onClick={() => setSelected({ index: idx, name: group.name, type: "group", uuid: group.uuid })}>
            <Paragraph className="text-slate-800 text-lg font-normal">{group.name}</Paragraph>
        </StyledGroupCard>
    );
}

export default GroupCard;