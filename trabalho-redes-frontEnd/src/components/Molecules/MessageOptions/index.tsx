"use client"

import { UserContext } from "@/contexts/UserContext";
import { MessageType } from "@/types/Message";
import React, { MouseEventHandler, useContext } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";




type props = {
    msg: MessageType;
    show: boolean;
    OnClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
};

const MessageOptions = ({ msg, show, OnClick }: props) => {

    const userCtx = useContext(UserContext)!;


    return(
        <span className={`${(show == true) ? "z-10" : "-z-10"} p-1 -mt-[1px] bg-gray-50 flex justify-center items-center fixed cursor-pointer transition-all
            ${(userCtx.user!.uuid == msg.author!.uuid) ? "float-left rounded-l-md" : "float-right rounded-r-md"}
            ${(show == true && userCtx.user!.uuid == msg.author!.uuid) ? "-ml-[21px] border border-solid border-l-gray-500/40 border-b-gray-500/40 border-t-gray-500/40" : ""}
            ${(show == true && userCtx.user!.uuid != msg.author!.uuid) ? "-mr-[21px] border border-solid border-r-gray-500/40 border-b-gray-500/40 border-t-gray-500/40" : ""}
            hover:bg-gray-200 group
        `}
        onClick={OnClick}
        
        >
            <BsThreeDotsVertical
                className="fill-slate-800/60 w-3 h-auto transition-all group-hover:fill-blue-600"
            />
        </span>
    );
}


export default MessageOptions;