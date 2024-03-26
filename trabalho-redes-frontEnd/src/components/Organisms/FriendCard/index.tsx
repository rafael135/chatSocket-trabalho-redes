import Paragraph from "@/components/Atoms/Paragraph";
import { SelectedChatInfo } from "@/types/Message";
import { User, UserFriend } from "@/types/User";
import Image from "next/image";
import { BsPersonFill } from "react-icons/bs";
import { Socket } from "socket.io-client";
import styled from "styled-components";



const StyledUserCard = styled.div.attrs(() => ({}))`
    width: 100%;
    height: 66px;
    padding-left: 0.25rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    //border-bottom: 1px solid rgb(75 85 99 / 0.4);
    cursor: pointer;
    border: 1px solid rgb(75 85 99 / 0.4);
    border-radius: 8px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    gap: 4px;

    
    &.selected {
        background-color: rgb(28 100 242);
        color: #FFF;
    }
    &.selected p {
        color: #FFF;
    }

    &.selected svg {
        
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


    return (
        <>
            <StyledUserCard className={className} onClick={() => setSelected({ index: idx, name: friend.name, srcImg: friend.avatarSrc, type: "user", uuid: friend.uuid })}>
                <div className="h-12 w-12 max-w-12 max-h-12 flex justify-center items-center border border-solid border-gray-600/40 bg-white rounded-full">
                    {(friend?.avatarSrc != null) &&
                        <Image
                            loading="lazy"
                            width={40}
                            height={40}
                            quality={100}
                            src={`/${friend.avatarSrc}`}
                            alt="Avatar"
                            className="rounded-full"
                        />
                    }

                    {(friend?.avatarSrc == null) &&
                        <BsPersonFill className="w-10 h-auto fill-slate-700" />
                    }
                </div>

                <Paragraph className="flex-1 mt-0.5 text-slate-800 text-lg font-normal truncate">{friend.name}</Paragraph>
            </StyledUserCard>
        </>
    );
}

export default FriendCard;