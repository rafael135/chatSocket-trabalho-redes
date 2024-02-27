"use client"

import { MessageType } from "@/types/Message";
import { User } from "@/types/User";


type props = {
    msg: MessageType;
    loggedUser: User;
}

const Message = ({ msg, loggedUser }: props) => {
    const date = new Date(msg.time!);

    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();

    const hour = date.getHours();
    const minutes = date.getMinutes();

    const dateToShow = `${((hour < 10) ? `0${hour}` : `${hour}`)}:${((minutes < 10) ? `0${minutes}` : `${minutes}`)} ${((day < 10) ? `0${day}` : `${day}`)}/${((month < 10) ? `0${month}` : `${month}`)}/${year}`;

    return (
        <>
            
                {(msg.type == "new-user") &&
                    <div className={`break-words px-4 py-2 max-w-[45%] grid flex-row border border-gray-500/40 bg-gray-50 rounded-lg shadow-md self-start`}>
                        <h2 className="text-xl font-bold mr-2">{msg.author!.name}</h2>
                        <p className="text-xl"> se juntou ao chat</p>
                    </div>
                }

                {(msg.type == "exit-user") &&
                    <div className={`break-words px-4 py-2 max-w-[45%] grid flex-row border border-gray-500/40 bg-gray-50 rounded-lg shadow-md self-start`}>
                        <h2 className="text-xl font-bold mr-2 text-red-600">{msg.author?.name}</h2>
                        <p className="text-xl text-red-500">saiu do chat</p>
                    </div>
                }

                {(msg.type == "msg") &&
                    <div className={`break-words px-4 py-2 max-w-[45%] grid flex-col border border-gray-500/40 bg-gray-50 rounded-lg shadow-md ${(loggedUser.uuId == msg.author!.uuId) ? "self-end" : "self-start"}`}>
                        <h2 className="text-2xl font-bold">{msg.author!.name}</h2>
                        <p className="text-xl break-all">{msg.msg}</p>
                        <p className="text-xs text-end font-light color-slate-700">{dateToShow}</p>
                    </div>
                }

                {(msg.type == "img") &&
                    <div className={`break-words px-4 py-2 max-w-[45%] grid flex-col gap-1 border border-gray-500/40 bg-gray-50 rounded-lg shadow-md ${(loggedUser.uuId == msg.author!.uuId) ? "self-end" : "self-start"}`}>
                        <h2 className="text-2xl font-bold">{msg.author!.name}</h2>

                        {(msg.imgs?.map((img, idx) => {
                            return (
                                <img key={idx} className="w-full h-auto" src={`data:image/png;base64, ${img}`} />
                            )
                        }))}

                        <p className="text-xl break-all">{msg.msg}</p>
                    </div>
                }
        </>
    );
}

export default Message;