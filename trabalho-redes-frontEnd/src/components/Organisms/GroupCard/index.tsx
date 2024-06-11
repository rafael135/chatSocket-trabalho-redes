import Paragraph from "@/components/Atoms/Paragraph";
import ContextMenuItem from "@/components/Molecules/ContextMenuItem";
import { MenuContext } from "@/contexts/MenuContext";
import { exitGroup, getGroupMessages } from "@/lib/actions";
import { Group } from "@/types/Group";
import { GroupMessage, MessageType, SelectedChatInfo } from "@/types/Message";
import { User } from "@/types/User";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { MouseEvent, ReactNode, useContext, useLayoutEffect, useState } from "react";
import { BsPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import styled from "styled-components";


const StyledGroupCard = styled.div.attrs(() => ({}))`
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
    group: Group;
    setSelected: (info: SelectedChatInfo) => void;
    updateUserGroupList: (group: Group, operation: "add" | "del") => void;
    className?: string;
}

const GroupCard = ({ idx, group, setSelected, updateUserGroupList, className }: props) => {
    const menuCtx = useContext(MenuContext)!;

    const [groupMessages, setGroupMessages] = useState<MessageType[]>([]);

    const handleExitGroup = async () => {
        let res = await exitGroup(group.uuid);

        if (res == true) {
            updateUserGroupList(group, "del");
            menuCtx.setShowContextMenu(false);
            menuCtx.setShowChatInfo(false);
        }
    }

    const handleGroupOptions = (e: MouseEvent<HTMLDivElement>) => {
        menuCtx.setContextMenuPositionX(e.pageX);
        menuCtx.setContextMenuPositionY(e.pageY);

        menuCtx.setContextMenuItems(
            <>
                <ContextMenuItem
                    onClick={handleExitGroup}
                >
                    Sair do Grupo
                </ContextMenuItem>
            </>
        );

        menuCtx.setShowContextMenu(true);
    }

    useLayoutEffect(() => {
        getGroupMessages(group.uuid).then((res) => {
            setGroupMessages(res);
        });
    }, []);

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
                <StyledGroupCard className={className} onClick={() => { setSelected({ index: idx, name: group.name, srcImg: group.groupImg, type: "group", uuid: group.uuid }); menuCtx.setShowChatInfo(false); }}>
                    <div className="h-12 w-12 max-w-12 max-h-12 flex justify-center items-center border border-solid border-gray-600/40 bg-white rounded-full">
                        {(group.groupImg != null) &&
                            <Image
                                loading="lazy"
                                width={40}
                                height={40}
                                quality={100}
                                src={`/${group.groupImg}`}
                                alt="Avatar"
                                className="rounded-full"
                            />
                        }

                        {(group.groupImg == null) &&
                            <BsPersonFill className="w-10 h-auto fill-slate-700" />
                        }
                    </div>

                    <Paragraph className="flex-1 mt-0.5 text-slate-800 text-lg font-normal truncate">{group.name}</Paragraph>

                    <div
                        className="w-6 h-6 absolute top-2 right-2 flex justify-center items-center transition-all rounded-full hover:bg-gray-600/40 active:bg-gray-600/60 group"
                        onClick={(e) => handleGroupOptions(e)}
                    >
                        <BsThreeDotsVertical className="w-4 h-auto bg-transparent fill-slate-700 group-hover:fill-blue-600" />
                    </div>
                </StyledGroupCard>
            </motion.div>
        </AnimatePresence>
    );
}

export default GroupCard;