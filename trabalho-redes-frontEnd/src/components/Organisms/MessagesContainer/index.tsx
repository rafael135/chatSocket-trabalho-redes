"use client"

//import socket from "@/helpers/Socket";

import Message from "../../Organisms/Message";
import { User, UserFriend } from "@/types/User";
import { ImgReceiveType, MessageType, SelectedChatInfo } from "@/types/Message";
import { Socket } from "socket.io-client";
import { useGroupMessages, useMessages } from "@/utils/queries";
import { Spinner } from "flowbite-react";
import { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import { queryClient } from "@/utils/queryClient";
import Image from "next/image";
import Paragraph from "../../Atoms/Paragraph";
import Button from "../../Atoms/Button";

import { PiArrowDownBold } from "react-icons/pi";
import { BsPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import UserInfo from "../UserInfo";
import GroupInfo from "../GroupInfo";
import ContextMenuItem from "@/components/Molecules/ContextMenuItem";
import { Group } from "@/types/Group";



type props = {
    socket: Socket;
    loggedUser: User;
    selectedChat: SelectedChatInfo;
    userFriends: UserFriend[];
    userGroups: Group[];
    messages: MessageType[];
    setMessages: (messages: MessageType[]) => void;
    showContextMenu: boolean;
    setShowContextMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setContextMenuItems: React.Dispatch<React.SetStateAction<ReactNode>>;
    setContextMenuPosition: React.Dispatch<React.SetStateAction<{ x: number, y: number }>>;
}

const MessagesContainer = ({ socket, loggedUser, selectedChat, userFriends, userGroups, messages, setMessages, showContextMenu, setShowContextMenu, setContextMenuItems, setContextMenuPosition }: props) => {

    const messageQuery = useMessages(selectedChat.uuid, selectedChat.type);
    //const msgQuery = queryClient.getQueryData([`${(selectedChat?.type == "group") ? "group" : "user"}`, `${selectedChat?.uuid}`]);

    const [showChatInfo, setShowChatInfo] = useState<boolean>(false);

    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const handleBtnRecent = () => {
        messagesContainerRef.current?.scrollBy({
            behavior: "smooth",
            top: messagesContainerRef.current.scrollHeight
        });
    }

    const handleContextMenuOptions = (e: MouseEvent<HTMLDivElement>) => {
        setContextMenuPosition({ x: e.pageX, y: e.pageY });

        setContextMenuItems(
            <>
                <ContextMenuItem
                    onClick={() => setShowChatInfo(true)}
                >
                    Mais informações
                </ContextMenuItem>
            </>
        );

        setShowContextMenu(true);
    }


    // Monitora se há um novo usuario, se sim, adiciona uma mensagem com o usuario que entrou no chat
    socket.on("new-user", (usr: User) => {
        //let newMsg: MessageType = { msg: ``, type: "new-user", author: usr };

        //setMessages([...messages, newMsg]);
    });

    socket.on("new_private_msg", (msg: MessageType) => {
        setMessages([...messages, msg]);
    });

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
        if (messageQuery.data != undefined) {
            setMessages([...messageQuery.data]);
        }


    }, [messageQuery.data])

    useEffect(() => {
        setTimeout(() => {
            messagesContainerRef.current?.scrollBy({
                behavior: "smooth",
                top: messagesContainerRef.current.scrollHeight
            });
        }, 90);
    }, [messages]);

    return (
        <div className="relative w-full flex-1 overflow-hidden">
            <div className="w-full px-2 h-16 bg-gray-200 flex gap-3 justify-start items-center border-b border-solid border-b-gray-600/40">

                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-solid border-gray-600/40">
                    {(selectedChat.srcImg != null) &&
                        <Image
                            loading="lazy"
                            fill={true}
                            quality={90}
                            src={`/${selectedChat.srcImg}`}
                            alt="Avatar"
                            className="rounded-full"
                        />
                    }

                    {(selectedChat.srcImg == null) &&
                        <div className="absolute z-10 top-0 bottom-0 left-0 right-0 flex justify-center items-center cursor-pointer rounded-full hover:bg-black/10">
                            <BsPersonFill className="w-10 h-auto fill-slate-700" />
                        </div>
                    }
                </div>

                <Paragraph>
                    {`${(selectedChat.type == "group") ? "Grupo: " : ""}${selectedChat.name}`}
                </Paragraph>

                <div
                    className="ms-auto w-6 h-6 flex justify-center items-center transition-all rounded-full cursor-pointer hover:bg-gray-600/40 active:bg-gray-600/60 group"
                    onClick={(e) => handleContextMenuOptions(e)}
                >
                    <BsThreeDotsVertical className="w-4 h-auto bg-transparent fill-slate-700 group-hover:fill-blue-600" />
                </div>
            </div>

            <div
                style={{ height: "calc(100% - 64px)", scrollbarWidth: "thin" }}
                ref={messagesContainerRef}
                className={`relative overflow-y-auto overflow-x-hidden w-full flex flex-col gap-2 p-0 ${(showChatInfo == false) ? "pt-2" : ""} ${(messageQuery.isFetching == true || messageQuery.isLoading == true) ? "justify-center items-center h-full" : ""}`}
            >
                {(messageQuery.isFetching == false && messageQuery.isLoading == false && showChatInfo == true) && (selectedChat.type == "user") &&
                    <UserInfo userFriend={userFriends[selectedChat.index]} selectedChat={selectedChat} setShowChatInfo={setShowChatInfo} />
                }

                {(messageQuery.isFetching == false && messageQuery.isLoading == false && showChatInfo == true) && (selectedChat.type == "group") &&
                    <GroupInfo userGroup={userGroups[selectedChat.index]} selectedChat={selectedChat} setShowChatInfo={setShowChatInfo} />
                }

                {(messageQuery.isFetching == true || messageQuery.isLoading == true) &&
                    <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
                        <Spinner className="w-12 h-auto my-auto fill-blue-600" />
                    </div>
                }

                {(messages.length > 0 && messageQuery.isFetching == false && messageQuery.isLoading == false) &&
                    messages.map((msg, idx) => {
                        return <Message msg={msg} loggedUser={loggedUser} key={idx} />
                    })
                }
            </div>
        </div>
    );
}

export default MessagesContainer;