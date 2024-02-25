"use client"

import { MessageType } from "@/types/Message";
import { User } from "@/types/User";


type props = {
    msg: MessageType;
    loggedUser: User;
}

const Message = ({ msg, loggedUser }: props) => {
    return (
        <>
            {(msg.type == "new-user") &&
                <div className={`px-4 py-2 max-w-[45%] flex flex-row border border-gray-500/40 bg-gray-50 rounded-lg shadow-md self-start`}>
                    <h2 className="text-xl font-bold mr-2">{msg.author!.name}</h2>
                    <p className="text-xl"> se juntou ao chat</p>
                </div>
            }

            {(msg.type == "exit-user") &&
                <div className={`px-4 py-2 max-w-[45%] flex flex-row border border-gray-500/40 bg-gray-50 rounded-lg shadow-md self-start`}>
                    <h2 className="text-xl font-bold mr-2 text-red-600">{msg.author?.name}</h2>
                    <p className="text-xl text-red-500">saiu do chat</p>
                </div>
            }

            {(msg.type == "msg") &&
                <div className={`px-4 py-2 max-w-[45%] flex flex-col border border-gray-500/40 bg-gray-50 rounded-lg shadow-md ${(loggedUser.uuId == msg.author!.uuId) ? "self-end" : "self-start"}`}>
                    <h2 className="text-2xl font-bold">{msg.author!.name}</h2>

                    <p className="text-xl truncate">{msg.msg}</p>
                </div>
            }

            {(msg.type == "img") &&
                <div className={`px-4 py-2 max-w-[45%] flex flex-col gap-1 border border-gray-500/40 bg-gray-50 rounded-lg shadow-md ${(loggedUser.uuId == msg.author!.uuId) ? "self-end" : "self-start"}`}>
                    <h2 className="text-2xl font-bold">{msg.author!.name}</h2>

                    {(msg.imgs?.map((img, idx) => {
                        return (
                            <img key={idx} className="w-full h-auto" src={`data:image/png;base64, ${img}`} />
                        )
                    }))}

                    <p className="text-xl truncate">{msg.msg}</p>
                </div>
            }
        </>
    );
}

export default Message;