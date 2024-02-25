"use client"

//import socket from "@/helpers/Socket";

import Message from "./Message";
import { User } from "@/types/User";
import { ImgReceiveType, MessageType, SelectedChatInfo } from "@/types/Message";
import { Socket } from "socket.io-client";
import { useGroupMessages, useMessages } from "@/utils/queries";
import { Spinner } from "flowbite-react";
import { useEffect } from "react";
import { queryClient } from "@/utils/queryClient";



type props = {
    socket: Socket;
    loggedUser: User;
    selectedChat: SelectedChatInfo;
    messages: MessageType[];
    setMessages: (messages: MessageType[]) => void;
}

const MessagesContainer = ({ socket, loggedUser, selectedChat, messages, setMessages }: props) => {
    
    const messageQuery = useMessages(selectedChat.uuId, selectedChat.type);
    //const msgQuery = queryClient.getQueryData([`${(selectedChat?.type == "group") ? "group" : "user"}`, `${selectedChat?.uuId}`]);


    // Monitora se há um novo usuario, se sim, adiciona uma mensagem com o usuario que entrou no chat
    socket.on("new-user", (usr: User) => {
        //let newMsg: MessageType = { msg: ``, type: "new-user", author: usr };

        //setMessages([...messages, newMsg]);
    });

    type GroupMsg = {
        user: User;
        grouUuId: string;
        msg: string;
    }

    // Monitora se há uma nova mensagem
    socket.on("new_group_msg", (msg: MessageType) => {
        setMessages([...messages, msg]);
    });

    // Monitora se há uma imagem
    socket.on("new-img", (usr: User, img: ImgReceiveType) => {
        //let newImg: MessageType = { msg: img.msg, imgs: img.imgs, author: usr, type: "img" };

        //setMessages([...messages, newImg]);
    });

    useEffect(() => {
        if(messageQuery.data != undefined) {
            setMessages([...messageQuery.data])
        }
    }, [messageQuery.data])

    return (
        <div className={`w-full flex flex-col gap-2 p-2 ${(messageQuery.isFetching == true || messageQuery.isLoading == true) ? "justify-center items-center" : ""}`}>
            {(messageQuery.isFetching == true || messageQuery.isLoading == true) &&
                <Spinner className="w-12 h-auto my-auto fill-blue-600" />
            }

            {(messages.length > 0 && messageQuery.isFetching == false && messageQuery.isLoading == false) &&
                messages.map((msg, idx) => {
                    return <Message msg={msg} loggedUser={loggedUser} key={idx} />
                })
            }
        </div>
    );
}

export default MessagesContainer;