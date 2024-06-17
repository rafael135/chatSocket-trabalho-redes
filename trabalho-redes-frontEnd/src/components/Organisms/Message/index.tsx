"use client"

import { MessageType } from "@/types/Message";
import { User } from "@/types/User";
import Image from "next/image";
import MessageImage from "../MessageImage";
import { useContext, useState } from "react";
import { UserContext } from "@/contexts/UserContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import MessageOptions from "@/components/Molecules/MessageOptions";
import { MenuContext } from "@/contexts/MenuContext";


type props = {
    msg: MessageType;
}

const Message = ({ msg }: props) => {
    const userCtx = useContext(UserContext)!;
    const menuCtx = useContext(MenuContext)!;

    const [showMessageOptions, setShowMessageOptions] = useState<boolean>(false);

    const date = new Date(msg.time!);

    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();

    const hour = date.getHours();
    const minutes = date.getMinutes();

    const dateToShow = `${((hour < 10) ? `0${hour}` : `${hour}`)}:${((minutes < 10) ? `0${minutes}` : `${minutes}`)} ${((day < 10) ? `0${day}` : `${day}`)}/${((month < 10) ? `0${month}` : `${month}`)}/${year}`;

    const handleMessageOptionsBtn = (e: React.MouseEvent<HTMLSpanElement>) => {
        
    }

    const handleOverMsg = () => {
        setShowMessageOptions(true);
    }

    const handleLeaveMsg = () => {
        setShowMessageOptions(false);
    }

    return (
        <>

            {(msg.type == "new-user") &&
                <div className={`break-words mx-2 px-4 py-2 max-w-[45%] grid flex-row border border-gray-500/40 bg-gray-50 rounded-lg shadow-md self-start`}>
                    <h2 className="text-xl font-bold mr-2">{msg.author!.name}</h2>
                    <p className="text-xl"> se juntou ao chat</p>
                </div>
            }

            {(msg.type == "exit-user") &&
                <div className={`break-words mx-2 px-4 py-2 max-w-[45%] grid flex-row border border-gray-500/40 bg-gray-50 rounded-lg shadow-md self-start`}>
                    <h2 className="text-xl font-bold mr-2 text-red-600">{msg.author?.name}</h2>
                    <p className="text-xl text-red-500">saiu do chat</p>
                </div>
            }

            {(msg.type == "msg") &&
                <div
                    className={`
                        relative overflow-clip break-words mx-2 px-4 py-2 max-w-[45%] grid flex-col border border-gray-500/40 bg-gray-50 shadow-md transition-all
                        ${(userCtx.user!.uuid == msg.author!.uuid) ? "self-end" : "self-start"}
                        ${(showMessageOptions == true) ? "!rounded-tl-none" : ""} rounded-lg
                    `}
                    onMouseOver={handleOverMsg}
                    onMouseLeave={handleLeaveMsg}
                >
                    <MessageOptions msg={msg} show={showMessageOptions} OnClick={handleMessageOptionsBtn} />
                    <h2 className="text-2xl font-bold">{msg.author!.name}</h2>
                    <p className="text-xl break-all">{msg.msg}</p>
                    <p className="text-xs text-end font-light color-slate-700">{dateToShow}</p>
                </div>
            }

            {(msg.type == "img") &&
                <div className={`break-words mx-2 px-4 py-2 max-w-[45%] grid flex-col gap-1 border border-gray-500/40 bg-gray-50 rounded-lg shadow-md ${(userCtx.user!.uuid == msg.author!.uuid) ? "self-end" : "self-start"}`}>
                    <h2 className="text-2xl font-bold">{msg.author!.name}</h2>

                    {(msg.imgs?.map((img, idx) => {
                        return (
                            <MessageImage image={img} key={idx} />
                        )
                    }))}

                    <p className="text-xl break-all">{msg.msg}</p>
                    <p className="text-xs text-end font-light color-slate-700">{dateToShow}</p>
                </div>
            }
        </>
    );
}

export default Message;