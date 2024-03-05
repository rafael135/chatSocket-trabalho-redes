"use client"

import { UserContext } from "@/contexts/UserContext";
//import socket from "@/helpers/Socket";
import { User, UserFriend } from "@/types/User";
import { Label, Modal, TextInput } from "flowbite-react";
import { useContext, useState, useRef, useEffect, useLayoutEffect } from "react";

import { MessagesContext } from "@/contexts/MessagesContext";
import { ImgSendType, MessageType, SelectedChatInfo } from "@/types/Message";

import { BsArrowRight, BsEmojiNeutralFill, BsGearFill, BsPaperclip, BsPlus } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import MessagesContainer from "../../MessagesContainer";
import AnnexedFile from "../../Molecules/AnexxedFile/index";
import { useRouter } from "next/navigation";
import FileInputModal from "../../Organisms/FileInputModal";
import { SocketContext } from "@/contexts/SocketContext";
import { Group } from "@/types/Group";
import { getUserGroups, getUserFriends } from "@/lib/actions";
import GroupCard from "../../Organisms/GroupCard";
import Button from "../../Atoms/Button";
import Image from "next/image";
import Paragraph from "../../Atoms/Paragraph";
import UserCard from "../../Organisms/UserCard";
import CreateNewGroupModal from "../../Organisms/CreateNewGroupCard";
import MsgInput from "../../Organisms/MsgInput";

import { Tabs, Tab, TabsHeader, TabsBody, TabPanel } from "@material-tailwind/react";
import FriendCard from "../../Organisms/FriendCard";
import styled from "styled-components";
import UserConfigModal from "./Modals/UserConfigModal";

//import { headers } from "next/headers";



const StyledChatsContainer = styled.div({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "0.375rem",
    overflowY: "scroll",
    scrollbarWidth: "thin",
    scrollbarColor: "rgb(79, 134, 241) transparent"
});

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

    const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

    // Armazena o emoji selecionado
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

    const [userGroups, setUserGroups] = useState<Group[]>([]);
    const [userFriends, setUserFriends] = useState<UserFriend[]>([]);

    const [selectedChat, setSelectedChat] = useState<SelectedChatInfo | null>(null);

    const [showCreateGroupModal, setShowCreateGroupModal] = useState<boolean>(false);

    const handleNewMsg = async () => {
        // Caso haja algum arquivo selecionado
        if (files.length > 0) {

            // Monto a mensagem com autor, imgs e texto
            let msg: ImgSendType = { user: userCtx!.user!, msg: msgInput.trim(), imgs: files };

            // Envio ao servidor a mensagem com as imagens
            socketCtx.socket!.emit("send-img", msg);

            // Reseto os arquivos e a entrada de texto
            setFiles([]);
            setMsgInput("");
            return;
        }

        // Envio de mensagem normal(sem img)
        if (msgInput != "") {
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

    const handleConfigBtn = () => {
        setShowConfigModal(true);
    }

    useEffect(() => {
        if (files.length > 0) {
            setShowFileInput(false);
        }
    }, [files]);

    useEffect(() => {
        if (selectedEmoji != null) {
            setMsgInput(msgInput + selectedEmoji);
            setSelectedEmoji(null);
        }
    }, [selectedEmoji]);

    useLayoutEffect(() => {
        if ((userCtx!.token == "" || userCtx.user == null) && userCtx.initialized == true) {
            router.push("/login");
            return;
        }

        if (userCtx?.user != null && userCtx.token != "" && userCtx.initialized == true) {
            getUserGroups(userCtx.user.uuId).then((res) => {
                setUserGroups(res);
            });

            getUserFriends(userCtx.user.uuId).then((res) => {
                setUserFriends(res);
            });
        }

        if (userCtx?.token != "") {
            socketCtx.socket?.connect();
        }

        //console.log(userCtx.token);


    }, [socketCtx.socket, userCtx.initialized]);

    useEffect(() => {
        //console.log(selectedChat);
    }, [selectedChat]);

    return (
        <>
            {(showCreateGroupModal == true) &&
                <CreateNewGroupModal show={showCreateGroupModal} setShow={setShowCreateGroupModal} addGroup={handleAddGroup} loggedUser={userCtx!.user!} />
            }

            {(showConfigModal == true) &&
                <UserConfigModal show={showConfigModal} setShow={setShowConfigModal} loggedUser={userCtx.user!} />
            }

            {(userCtx.token != "") &&
                <div className="h-full flex flex-row bg-gray-200/90 border-solid border border-gray-400/70 shadow-lg">
                    <div className="w-60 flex flex-col min-w-60 max-h-max overflow-hidden bg-gray-50">
                        {/*userCtx.usersList.map((usr, idx) => {
                            return <UserCard key={idx} loggedUser={userCtx.user!} user={usr} />
                        })*/}
                        <div className="p-4 border-solid border-b h-[80px] border-gray-500/40">
                            <Button
                                onClick={handleShowCreateGroupBtn}
                                className="!bg-transparent border-solid border border-gray-500/40 !duration-100 !text-slate-800 hover:!bg-gray-200 active:!bg-blue-500 group"
                                title="Criar grupo"
                            >
                                <BsPlus className="fill-blue-600 w-8 h-auto hover:!bg-transparent transition-all group-active:fill-white" />
                                <p className="transition-all group-hover:!bg-transparent group-hover:!text-slate-800 group-active:!text-white">Criar grupo</p>
                            </Button>
                        </div>

                        <div className="flex-1 pt-1.5" style={{ maxHeight: "calc(100% - 128px)" }}>
                            <Tabs className="h-full flex flex-col" value="friends">
                                <TabsHeader placeholder={""} className="bg-gray-200 mx-1.5">
                                    <Tab placeholder="Friends" key={"friends"} value={"friends"}>
                                        Amigos
                                    </Tab>

                                    <Tab placeholder="Groups" key="groups" value="groups">
                                        Grupos
                                    </Tab>
                                </TabsHeader>

                                <TabsBody className="relative h-full" placeholder="" animate={{
                                    initial: { x: 250 },
                                    mount: { x: 0 },
                                    unmount: { x: 250 }
                                }}>
                                    <TabPanel value="friends" className="h-full max-h-full p-0">
                                        <StyledChatsContainer>
                                            {
                                                userFriends.map((friend, idx) => {
                                                    return <FriendCard
                                                        key={idx}
                                                        idx={idx}
                                                        setSelected={handleSelectedChat}
                                                        friend={friend}
                                                        loggedUser={userCtx?.user!}
                                                        socket={socketCtx.socket!}
                                                        className={`${(selectedChat?.type == "user" && selectedChat.index == idx) ? "selected" : ""}`}
                                                    />
                                                })
                                            }
                                        </StyledChatsContainer>

                                    </TabPanel>

                                    <TabPanel value="groups" className="flex h-full max-h-fit overflow-hidden p-0">
                                        <StyledChatsContainer>
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
                                        </StyledChatsContainer>

                                    </TabPanel>
                                </TabsBody>
                            </Tabs>
                        </div>

                        <div className="h-12 flex px-1 justify-start items-center border-t border-solid border-gray-500/40">
                            <Button
                                onClick={handleConfigBtn}
                                className="!bg-transparent border-solid border border-gray-500/40 !duration-100 !text-slate-800 hover:!bg-gray-200 active:!bg-blue-500 group"
                                title="Configurações"
                            >
                                <BsGearFill className="fill-blue-600 w-5 h-auto hover:!bg-transparent transition-all group-active:fill-white" />
                                {/*<p className="transition-all group-hover:!bg-transparent group-hover:!text-slate-800 group-active:!text-white"></p>*/}
                            </Button>
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

                        {(userCtx.user != null && selectedChat != null) &&
                            <div>

                            </div>
                        }

                        {/* Container com as mensagens do chat selecionado */}
                        {(userCtx!.user != null && selectedChat != null) &&

                            <MessagesContainer
                                socket={socketCtx.socket!}
                                loggedUser={userCtx!.user}
                                selectedChat={selectedChat}
                                messages={messagesCtx!.messages}
                                setMessages={messagesCtx!.setMessages}
                            />
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