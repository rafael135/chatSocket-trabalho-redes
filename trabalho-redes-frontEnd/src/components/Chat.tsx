"use client"

import { UserContext } from "@/contexts/UserContext";
//import socket from "@/helpers/Socket";
import { User, UserFriend } from "@/types/User";
import { Label, Modal, TextInput } from "flowbite-react";
import { useContext, useState, useRef, useEffect, useLayoutEffect } from "react";

import { MessagesContext } from "@/contexts/MessagesContext";
import { ImgSendType, MessageType, SelectedChatInfo } from "@/types/Message";

import { BsArrowRight, BsEmojiNeutralFill, BsPaperclip, BsPlus } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import MessagesContainer from "./MessagesContainer";
import AnnexedFile from "./Molecules/AnexxedFile/index";
import { useRouter } from "next/navigation";
import FileInputModal from "./Organisms/FileInputModal";
import { SocketContext } from "@/contexts/SocketContext";
import { Group } from "@/types/Group";
import { getUserGroups, getUserFriends } from "@/lib/actions";
import GroupCard from "./Organisms/GroupCard";
import Button from "./Atoms/Button";
import Image from "next/image";
import Paragraph from "./Atoms/Paragraph";
import UserCard from "./Organisms/UserCard";
import CreateNewGroupModal from "./Organisms/CreateNewGroupCard";
import MsgInput from "./Organisms/MsgInput";
//import { headers } from "next/headers";

const Chat = () => {

    // Contexto do usuario e mensagens
    const userCtx = useContext(UserContext)!;
    const messagesCtx = useContext(MessagesContext);
    const socketCtx = useContext(SocketContext)!;

    

    const router = useRouter();

    // String do userName a ser setado no "login" e String do texto da caixa de mensagens
    const [msgInput, setMsgInput] = useState<string>("");

    // Array de arquivos selecionados
    const [files, setFiles] = useState<File[]>([]);

    // Referencia do elemento de input
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Controla se a entrada de arquivos deve ser exibido
    const [showFileInput, setShowFileInput] = useState<boolean>(false);

    // Controla se o seletor de emoji deve ser exibido
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

    // Armazena o emoji selecionado
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

    const [userGroups, setUserGroups] = useState<Group[]>([]);
    const [userFriends, setUserFriends] = useState<UserFriend[]>([]);

    const [selectedChat, setSelectedChat] = useState<SelectedChatInfo | null>(null);

    const [showCreateGroupModal, setShowCreateGroupModal] = useState<boolean>(false);

    const handleNewMsg = async () => {
        // Caso haja algum arquivo selecionado
        if(files.length > 0) {

            // Monto a mensagem com autor, imgs e texto
            let msg: ImgSendType = { user: userCtx!.user!, msg: msgInput.trim(), imgs: files};

            // Envio ao servidor a mensagem com as imagens
            socketCtx.socket!.emit("send-img", msg);

            // Reseto os arquivos e a entrada de texto
            setFiles([]);
            setMsgInput("");
            return;
        }

        // Envio de mensagem normal(sem img)
        if(msgInput != "") {
            //let newMsg: MessageType = { author: userCtx!.user!, msg: msgInput.trim(), type: "msg" };

            //socketCtx.socket!.emit("send-msg", newMsg);
            setMsgInput("");
        }
    }

    const handleFileDragEnter = (e: React.DragEvent) => {
        setShowFileInput(true);
    }

    const handleFileDragLeave = (e: React.DragEvent) => {
        
    }


    const handleEmojiClicked = (emoji: EmojiClickData) => {
        setSelectedEmoji(emoji.emoji);
    }

    const handleSelectedChat = (info: SelectedChatInfo) => {
        setSelectedChat(info);
    }

    // Monitora se um novo usuario entrou ao chat(emitido pelo servidor)
    socketCtx.socket!.on("new-user", (usr: User) => {
        //userCtx!.setUsersList([...userCtx!.usersList, usr]);
    });

    // Monitora a necessidade de alterar a lista de usuarios
    socketCtx.socket!.on("renew-users", (usrList: User[]) => {
        //userCtx?.setUsersList(usrList);
    });

    // Monitora se um usuario saiu do chat
    socketCtx.socket!.on("left-user", (userLeft: User) => {
        //messagesCtx?.setMessages([...messagesCtx.messages, { author: userLeft, msg: "", type: "exit-user" }]);
    });

    // Exibe uma mensagem de alerta caso a conexão com o servidor caia
    socketCtx.socket!.on("disconnect", () => {
        //messagesCtx?.setMessages([...messagesCtx.messages, { author: null, msg: "Conexão perdida com o host!", type: "error" }]);
        //userCtx?.setUsersList([]);
    });

    const handleShowCreateGroupBtn = () => {
        setShowCreateGroupModal(true);
    }

    const handleAddGroup = (group: Group) => {
        setUserGroups([...userGroups, group]);
    }
    
    useEffect(() => {
        if(files.length > 0) {
            setShowFileInput(false);
        }
    }, [files]);

    useEffect(() => {
        if(selectedEmoji != null) {
            setMsgInput(msgInput + selectedEmoji);
            setSelectedEmoji(null);
        }
    }, [selectedEmoji]);

    useLayoutEffect(() => {
        if((userCtx!.token == "" || userCtx.user == null) && userCtx.initialized == true) {
            router.push("/login");
            return;
        }

        if(userCtx?.user != null && userCtx.token != "" && userCtx.initialized == true) {
            getUserGroups(userCtx.user.uuId).then((res) => {
                setUserGroups(res);
            });

            getUserFriends(userCtx.user.uuId).then((res) => {
                setUserFriends(res);
            });
        }

        if(userCtx?.token != "") {
            socketCtx.socket?.connect();
        }

        //console.log(userCtx.token);

        
    }, [socketCtx.socket, userCtx.initialized]);

    useEffect(() => {
        console.log(userGroups);
    }, [userGroups]);

    return (
        <>
            {(showCreateGroupModal == true) &&
                <CreateNewGroupModal show={showCreateGroupModal} setShow={setShowCreateGroupModal} addGroup={handleAddGroup} loggedUser={userCtx!.user!} />
            }

            {(userCtx.token != "") &&
                <div className="h-full flex flex-row bg-gray-200/90 border-solid border border-gray-400/70 shadow-lg">
                    <div className="w-60 bg-gray-50 overflow-y-auto">
                        {/*userCtx.usersList.map((usr, idx) => {
                            return <UserCard key={idx} loggedUser={userCtx.user!} user={usr} />
                        })*/}
                        <div className="p-4 border-solid border-b border-gray-500/40">
                            <Button
                                onClick={handleShowCreateGroupBtn}
                                className="!bg-transparent border-solid border border-gray-500/40 !duration-100 !text-slate-800 hover:!bg-gray-200 active:!bg-blue-500 group"
                                title="Criar grupo"
                            >
                                <BsPlus className="fill-blue-600 w-8 h-auto hover:!bg-transparent transition-all group-active:fill-white" />
                                <p className="transition-all group-hover:!bg-transparent group-hover:!text-slate-800 group-active:!text-white">Criar grupo</p>
                            </Button>
                        </div>

                        <div className="flex flex-col gap-2 p-1.5">
                            

                            {
                                userGroups.map((group, idx) => {
                                    return <GroupCard
                                        key={idx}
                                        idx={idx}
                                        setSelected={handleSelectedChat}
                                        group={group}
                                        loggedUser={userCtx?.user!}
                                        socket={socketCtx.socket!}
                                        className={`${(selectedChat?.type == "group" && selectedChat.index == idx) ? "selected" : ""}`}
                                    />
                                })
                            }
                        </div>


                        
                    </div>

                    <div
                        className="relative flex-1 h-full max-w-[100%] flex flex-col border border-solid border-l-gray-400/70"
                        onDragEnter={handleFileDragEnter}
                        onDragLeave={handleFileDragLeave}
                    >
                        
                        {/*}
                        {(showEmojiPicker == true) &&
                            <div className="absolute bottom-12 right-0">
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClicked}
                                    emojiStyle={EmojiStyle.APPLE}
                                    theme={Theme.DARK}
                                    lazyLoadEmojis={true}
                                />
                            </div>
                        }
                        */}


                        {/* Modal de input dos arquivos */}
                        {(showFileInput == true) &&
                            <FileInputModal show={showFileInput} setShow={setShowFileInput} files={files} setFiles={setFiles} fileInputRef={fileInputRef} />
                        }
                        
                        {/* Container com as mensagens do chat selecionado */}
                        {(userCtx!.user != null && selectedChat != null) &&
                            <div className="w-full flex-1 overflow-auto">
                                <MessagesContainer
                                    socket={socketCtx.socket!}
                                    loggedUser={userCtx!.user}
                                    selectedChat={selectedChat}
                                    messages={messagesCtx!.messages}
                                    setMessages={messagesCtx!.setMessages}
                                />
                            </div>
                        }
                        
                        {/* Arquivos anexados */}
                        {(files.length > 0) &&
                            <div className="w-full h-auto p-1 bg-slate-200 border border-solid border-t-gray-500/40 flex justify-end items-center">
                                {files.map((file, idx) => {
                                        return <AnnexedFile key={idx} file={file} fileIndex={idx} files={files} setFiles={setFiles} />
                                    })
                                }
                            </div>
                        }



                        <MsgInput
                            selectedChat={selectedChat}
                            selectedFiles={files}
                            setShowFileInput={setShowFileInput}
                            setSelectedFiles={setFiles}
                            socket={socketCtx.socket}
                            messages={messagesCtx!.messages}
                            setMessages={messagesCtx!.setMessages}
                        />
                    </div>
                </div>
            }
        </>
        
    );
}


export default Chat;