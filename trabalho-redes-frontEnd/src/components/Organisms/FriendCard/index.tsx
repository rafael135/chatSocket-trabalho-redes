import Paragraph from "@/components/Atoms/Paragraph";
import { SelectedChatInfo } from "@/types/Message";
import { User, UserFriend } from "@/types/User";
import { Socket } from "socket.io-client";
import styled from "styled-components";



const StyledUserCard = styled.div.attrs(() => ({}))`
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
    friend: UserFriend;
    setSelected: (info: SelectedChatInfo) => void;
    loggedUser: User;
    socket: Socket;
    className?: string;
}

const FriendCard = ({ idx, friend, setSelected, loggedUser, socket, className }: props) => {


    return(
        <StyledUserCard className={className} onClick={() => setSelected({ index: idx, name: friend.name, srcImg: friend.avatarSrc, type: "user", uuId: friend.uuId })}>
            <Paragraph className="text-slate-800 text-lg font-normal">{friend.name}</Paragraph>
        </StyledUserCard>
    );
}

export default FriendCard;