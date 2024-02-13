"use client"

import socket from "@/helpers/Socket";

import Message from "./Message";
import { User } from "@/types/User";
import { ImgReceiveType, MessageType } from "@/types/Message";



type props = {
    loggedUser: User;
    messages: MessageType[];
    setMessages: (messages: MessageType[]) => void;
}

const MessagesContainer = ({ loggedUser, messages, setMessages }: props) => {
    
    // Monitora se há um novo usuario, se sim, adiciona uma mensagem com o usuario que entrou no chat
    socket.on("new-user", (usr: User) => {
        let newMsg: MessageType = { msg: ``, type: "new-user", author: usr };

        setMessages([...messages, newMsg]);
    });

    // Monitora se há uma nova mensagem
    socket.on("new-msg", (msg: MessageType) => {
        setMessages([...messages, msg]);
    });

    // Monitora se há uma imagem
    socket.on("new-img", (usr: User, img: ImgReceiveType) => {
        let newImg: MessageType = { msg: img.msg, imgs: img.imgs, author: usr, type: "img" };

        setMessages([...messages, newImg]);
    });

    return (
        <div className="w-full flex flex-col gap-2 p-2">
            {(messages.length > 0) &&
                messages.map((msg, idx) => {
                    return <Message msg={msg} loggedUser={loggedUser} key={idx} />
                })
            }
        </div>
    );
}

export default MessagesContainer;