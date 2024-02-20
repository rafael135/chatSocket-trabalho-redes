"use client"

import { UserContext } from "@/contexts/UserContext";
//import socket from "@/helpers/Socket";
import { User } from "@/types/User";
import { Label, Modal, TextInput } from "flowbite-react";
import { useContext, useState, useRef, useEffect, useLayoutEffect } from "react";

import { MessagesContext } from "@/contexts/MessagesContext";
import { ImgSendType, MessageType } from "@/types/Message";

import { BsArrowRight, BsEmojiNeutralFill, BsPaperclip, BsPlus } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import MessagesContainer from "./MessagesContainer";
import AnnexedFile from "./Molecules/AnexxedFile/index";
import { useRouter } from "next/navigation";
import FileInputModal from "./Organisms/FileInputModal";
import { SocketContext } from "@/contexts/SocketContext";
import { Group } from "@/types/Group";
import { getUserGroups, createNewGroup } from "@/lib/actions";
import GroupCard from "./Organisms/GroupCard";
import Button from "./Atoms/Button";
import Image from "next/image";
import Paragraph from "./Atoms/Paragraph";
import UserCard from "./Organisms/UserCard";
import CreateNewGroupModal from "./Organisms/CreateNewGroupCard";

const Chat = () => {

    // Contexto do usuario e mensagens
    const userCtx = useContext(UserContext);
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
            let newMsg: MessageType = { author: userCtx!.user!, msg: msgInput.trim(), type: "msg" };

            socketCtx.socket!.emit("send-msg", newMsg);

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
        messagesCtx?.setMessages([...messagesCtx.messages, { author: userLeft, msg: "", type: "exit-user" }]);
    });

    // Exibe uma mensagem de alerta caso a conexão com o servidor caia
    socketCtx.socket!.on("disconnect", () => {
        messagesCtx?.setMessages([...messagesCtx.messages, { author: null, msg: "Conexão perdida com o host!", type: "error" }]);
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
        /*if(userCtx!.user == null) {
            router.push("/login");
            return;
        }*/

        if(userCtx?.user != null) {
            getUserGroups(userCtx.user.uuId).then((res) => {
                setUserGroups(res);
            });
        }

        socketCtx.socket?.connect();
    }, [socketCtx.socket, userCtx!.user]);

    useEffect(() => {
        
    }, [userGroups]);

    return (
        <>
            {(showCreateGroupModal == true) &&
                <CreateNewGroupModal show={showCreateGroupModal} setShow={setShowCreateGroupModal} createNewGroup={createNewGroup} addGroup={handleAddGroup} loggedUser={userCtx!.user!} />
            }

            {(userCtx?.token != "") &&
                <div className="h-full flex flex-row bg-gray-200/90 border-solid border border-gray-400/70 shadow-lg">
                    <div className="w-60 bg-gray-50">
                        {/*userCtx.usersList.map((usr, idx) => {
                            return <UserCard key={idx} loggedUser={userCtx.user!} user={usr} />
                        })*/}
                        <div className="p-4 border-solid border-b border-gray-500/40">
                            <Button
                                onClick={handleShowCreateGroupBtn}
                                className="!bg-transparent border-solid border border-gray-500/40 !text-slate-800 hover:!bg-gray-200 active:!bg-blue-500 group"
                                title="Criar grupo"
                            >
                                <BsPlus className="fill-blue-600 w-8 h-auto hover:!bg-transparent transition-all group-active:fill-white" />
                                <p className="transition-all group-hover:!bg-transparent group-hover:!text-slate-800 group-active:!text-white">Criar grupo</p>
                            </Button>
                        </div>

                        <div className="flex flex-col gap-2 p-1.5">
                            

                            {
                                userGroups.map((group, idx) => {
                                    return <GroupCard key={idx} group={group} loggedUser={userCtx?.user!} socket={socketCtx.socket!} />
                                })
                            }
                        </div>


                        
                    </div>

                    <div
                        className="relative flex-1 h-full flex flex-col border border-solid border-l-gray-400/70"
                        onDragEnter={handleFileDragEnter}
                        onDragLeave={handleFileDragLeave}
                    >
                    
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


                        {/* Modal de input dos arquivos */}
                        {(showFileInput == true) &&
                            <FileInputModal show={showFileInput} setShow={setShowFileInput} files={files} setFiles={setFiles} fileInputRef={fileInputRef} />
                        }
                        
                        {/* Container com as mensagens do chat selecionado */}
                        {(userCtx!.user != null) &&
                            <div className="w-full flex-1 overflow-auto">
                                <MessagesContainer socket={socketCtx.socket!} loggedUser={userCtx!.user} messages={messagesCtx!.messages} setMessages={messagesCtx!.setMessages} />
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

                        <div className="h-12 w-full mt-auto flex items-center bg-gray-300 border border-solid border-t-gray-400/70 border-b-gray-400/70 overflow-hidden">
                            <input 
                                className="flex flex-1 text-slate-800 bg-transparent border-none p-2 w-full text-xl focus:outline-none focus:shadow-none focus:border-none focus:ring-0"
                                placeholder=""
                                type="text"
                                value={msgInput}
                                onKeyUp={(e) => { if(e.key == "Enter") { handleNewMsg(); } }}
                                onChange={(e) => { setMsgInput(e.target.value); }}
                            />

                            <BsPaperclip
                                className="w-8 h-8 fill-gray-500/60 mr-2 rounded-full cursor-pointer hover:fill-gray-500/80 hover:bg-black/10 active:fill-gray-500"
                                onClick={() => { setShowFileInput(true); }}
                            />

                            <BsEmojiNeutralFill 
                                className="w-8 h-8 fill-gray-500/60 mr-2 rounded-full cursor-pointer hover:fill-gray-500/80 hover:bg-black/10 active:fill-gray-500"
                                onClick={() => { setShowEmojiPicker(!showEmojiPicker) }}
                            />

                            <BsArrowRight
                                className="w-8 h-8 p-0.5 fill-gray-500/60 mr-2 rounded-full cursor-pointer hover:fill-gray-500/80 hover:bg-black/10 active:fill-gray-500"
                                onClick={() => { handleNewMsg(); }}
                            />
                        </div>
                    </div>
                </div>
            }
        </>
        
    );
}


export default Chat;