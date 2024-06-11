import Paragraph from "@/components/Atoms/Paragraph";
import { UserContext } from "@/contexts/UserContext";
import { User, UserFriend } from "@/types/User";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useContext } from "react";
import { BsPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import { MdDone } from "react-icons/md";
import styled from "styled-components";

const StyledUserCard = styled.div.attrs(() => ({}))`
    position: relative;
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
        //background-color: rgb(28 100 242);
        //color: #FFF;
        border-color: rgb(28 100 242);
    }
    &.selected p {
        //color: #FFF;
    }

    &.selected svg {
        
    }
`;

type props = {
    idx: number;
    friend: UserFriend;
    updateUserFriendList: (friend: UserFriend, operation: "add" | "del") => void;
    handleOnAccept: (friendUuid: string, friend: UserFriend) => void;
    className?: string;
}


const PendingFriendCard = ({ idx, friend, updateUserFriendList, handleOnAccept, className }: props) => {

    const userCtx = useContext(UserContext)!;

    const handleAcceptFriend = () => {
        handleOnAccept(friend.uuid, friend);
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{
                    x: 400
                }}

                animate={{
                    x: 0
                }}

                transition={{
                    duration: 0.6,
                    type: "spring"
                }}

                exit={{ x: 500 }}
            >
                <StyledUserCard className={className}>
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

                    <div
                        className="w-6 h-6 absolute top-2 right-2 flex justify-center items-center transition-all rounded-full hover:bg-green-700/50 active:bg-green-700/70 group"
                        onClick={handleAcceptFriend}
                    >
                        <MdDone className="w-4 h-auto bg-transparent fill-green-700 group-hover:fill-white" />
                    </div>
                </StyledUserCard>
            </motion.div>
        </AnimatePresence>
    );
}

export default PendingFriendCard;