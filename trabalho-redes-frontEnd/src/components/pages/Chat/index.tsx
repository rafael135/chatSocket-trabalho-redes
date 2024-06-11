"use client"

import { UserContext } from "@/contexts/UserContext";
//import socket from "@/helpers/Socket";
import { User, UserFriend } from "@/types/User";
import { useContext, useState, useRef, useEffect, useLayoutEffect, ReactNode } from "react";

import { MessagesContext } from "@/contexts/MessagesContext";
import { ImgSendType, MessageType, SelectedChatInfo } from "@/types/Message";

import { BsGearFill, BsPersonFillAdd, BsPlus } from "react-icons/bs";
import { SlEnvolopeLetter } from "react-icons/sl";
import { EmojiClickData } from "emoji-picker-react";
import MessagesContainer from "@/components/Organisms/MessagesContainer";
import AnnexedFile from "../../Molecules/AnexxedFile/index";
import { useRouter } from "next/navigation";
import FileInputModal from "../../Organisms/FileInputModal";
import { SocketContext } from "@/contexts/SocketContext";
import { Group } from "@/types/Group";
import { getUserGroups, getUserFriends } from "@/lib/actions";
import GroupCard from "../../Organisms/GroupCard";
import Button from "../../Atoms/Button";
import CreateNewGroupModal from "./Modals/CreateNewGroupModal";
import MsgInput from "../../Organisms/MsgInput";

import { Tabs, Tab, TabsHeader, TabsBody, TabPanel } from "@material-tailwind/react";
import FriendCard from "../../Organisms/FriendCard";
import styled from "styled-components";
import UserConfigModal from "./Modals/UserConfigModal";
import AddFriendModal from "./Modals/AddFriendModal";
import ContextMenu from "@/components/Molecules/ContextMenu";
import PendingInvitationsModal from "./Modals/PendingInvitationsModal";
import Paragraph from "@/components/Atoms/Paragraph";
import { MenuContext } from "@/contexts/MenuContext";
import ImageModal from "@/components/Organisms/ImageModal";
import { ChatContext } from "@/contexts/ChatContext";
import ShowChatPhotoModal from "./Modals/ShowChatPhotoModal";

//import { headers } from "next/headers";



const StyledChatsContainer = styled.div({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    gap: "0.5rem",
    padding: "0.375rem",
    overflowY: "scroll",
    overflowX: "hidden",
    scrollbarWidth: "thin",
    scrollbarColor: "rgb(79, 134, 241) transparent"
});

const Chat = () => {

    // Contexto do usuario e mensagens
    const userCtx = useContext(UserContext)!;
    const chatCtx = useContext(ChatContext)!;
    const socketCtx = useContext(SocketContext)!;

    // Contexto para exibição de menus
    const menuCtx = useContext(MenuContext)!;



    const router = useRouter();

    // String do userName a ser setado no "login" e String do texto da caixa de mensagens
    const [msgInput, setMsgInput] = useState<string>("");

    // Array de arquivos selecionados
    const [files, setFiles] = useState<File[]>([]);

    // Referencia do elemento de input
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Armazena o emoji selecionado
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

    const [userGroups, setUserGroups] = useState<Group[]>([]);
    const [userFriends, setUserFriends] = useState<UserFriend[]>([]);

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
        menuCtx.setShowFileInput(true);
    }

    const handleFileDragLeave = (e: React.DragEvent) => {

    }


    const handleEmojiClicked = (emoji: EmojiClickData) => {
        setSelectedEmoji(emoji.emoji);
    }

    const handleSelectedChat = (info: SelectedChatInfo) => {
        chatCtx.setActiveChat(info);

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
        menuCtx.setShowCreateGroupModal(true);
    }

    const handleAddGroup = (group: Group) => {
        setUserGroups([...userGroups, group]);
    }

    const handleShowAddFriendBtn = () => {
        menuCtx.setShowAddFriendModal(true);
    }

    const handleConfigBtn = () => {
        menuCtx.setShowConfigModal(true);
    }

    const updateUserFriendList = (friend: UserFriend, operation: "add" | "del") => {
        //console.log(friend);        

        switch (operation) {
            case "add":
                setUserFriends([...userFriends, friend]);
                break;

            case "del":
                if (chatCtx.activeChat?.uuid == friend.uuid) {
                    chatCtx.setActiveChat(null);
                }

                let friends = userFriends.filter((fr) => fr.nickName != friend.nickName);
                setUserFriends([...friends]);
                break;
        }
    }

    const updateUserGroupList = (group: Group, operation: "add" | "del") => {
        switch (operation) {
            case "add":
                setUserGroups([...userGroups, group]);
                break;

            case "del":
                if (chatCtx.activeChat?.uuid == group.uuid) {
                    chatCtx.setActiveChat(null);
                }

                let groups = userGroups.filter((gr) => gr.uuid != group.uuid && gr.createdAt != group.createdAt);
                setUserGroups([...groups]);
                break;
        }
    }

    const handlePendingInvitationsBtn = async () => {
        menuCtx.setShowPendingInvitations(true);
    }

    const handleClearFiles = async () => {
        setFiles([]);
    }

    useEffect(() => {
        if (files.length > 0) {
            menuCtx.setShowFileInput(false);
        }
    }, [files]);

    useEffect(() => {
        if (selectedEmoji != null) {
            setMsgInput(msgInput + selectedEmoji);
            setSelectedEmoji(null);
        }
    }, [selectedEmoji]);

    useEffect(() => {

        const handleClick = () => { menuCtx.setShowContextMenu(false); };

        if (menuCtx.showContextMenu == true) {
            setTimeout(() => {
                window.addEventListener("click", handleClick);
            }, 80);
        }

        return () => window.removeEventListener("click", handleClick);
    }, [menuCtx.showContextMenu]);

    useLayoutEffect(() => {
        if ((userCtx!.token == "" || userCtx.user == null) && userCtx.initialized == true) {
            router.push("/login");
            return;
        }

        if (userCtx?.user != null && userCtx.token != "" && userCtx.initialized == true) {
            getUserGroups(userCtx.user.uuid).then((res) => {
                setUserGroups(res);
            });

            getUserFriends(userCtx.user.uuid).then((res) => {
                setUserFriends(res);
                //console.log(res);
            });
        }

        if (userCtx?.token != "") {
            socketCtx.socket?.connect();
        }

        //console.log(userCtx.token);


    }, [socketCtx.socket, userCtx.initialized]);

    return (
        <>
            {(menuCtx.showCreateGroupModal == true) &&
                <CreateNewGroupModal addGroup={handleAddGroup} />
            }

            {(menuCtx.showAddFriendModal == true) &&
                <AddFriendModal updateFriendList={updateUserFriendList} />
            }

            {(menuCtx.showConfigModal == true) &&
                <UserConfigModal />
            }

            {(menuCtx.showPendingInvitations == true) &&
                <PendingInvitationsModal updateFriendList={updateUserFriendList} />
            }

            {(menuCtx.showImageModal == true) &&
                <ImageModal />
            }

            {(menuCtx.showContextMenu == true) &&
                <ContextMenu
                    closeOnClick={true}
                >
                    {menuCtx.contextMenuItems}
                </ContextMenu>
            }

            {(menuCtx.showChatPhotoModal == true) &&
                <ShowChatPhotoModal />
            }

            {(userCtx.token != "") &&
                <div className="h-full flex flex-row bg-gray-200/90 border-solid border border-gray-400/70 shadow-lg">
                    <div className="w-60 flex flex-col min-w-60 max-h-max overflow-hidden bg-gray-50">
                        <div className="py-4 px-2 flex justify-around border-solid border-b h-[80px] border-gray-500/40">
                            <Button
                                onClick={handleShowCreateGroupBtn}
                                className="!bg-transparent border-solid border border-gray-500/40 !duration-100 !text-slate-800 hover:!bg-gray-200 active:!bg-blue-500 group"
                                title="Criar grupo"
                            >
                                <BsPlus className="fill-blue-600 w-8 h-auto hover:!bg-transparent transition-all group-active:fill-white" />
                                <p className="transition-all group-hover:!bg-transparent group-hover:!text-slate-800 group-active:!text-white">Criar grupo</p>
                            </Button>

                            <Button
                                onClick={handleShowAddFriendBtn}
                                className="!bg-transparent border-solid border border-gray-500/40 !duration-100 hover:!bg-gray-200 active:!bg-blue-500 group"
                                title="Adicionar Amigo"
                            >
                                <BsPersonFillAdd className="fill-blue-600 w-8 h-auto hover:!bg-transparent group-active:fill-white" />
                            </Button>
                        </div>

                        <div className="flex-1 pt-1.5" style={{ maxHeight: "calc(100% - 128px)" }}>
                            <Tabs className="h-full flex flex-col" value="friends">
                                {/* @ts-ignore */}
                                <TabsHeader placeholder={""} className="bg-gray-200 mx-1.5">
                                    {/* @ts-ignore */}
                                    <Tab placeholder="Friends" key={"friends"} value={"friends"}>
                                        Amigos
                                    </Tab>
                                    {/* @ts-ignore */}
                                    <Tab placeholder="Groups" key="groups" value="groups">
                                        Grupos
                                    </Tab>
                                </TabsHeader>
                                
                                {/* @ts-ignore */}
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
                                                        isSelected={(chatCtx.activeChat?.type == "user" && chatCtx.activeChat.index == idx) ? true : false}
                                                        setSelected={handleSelectedChat}
                                                        friend={friend}
                                                        updateUserFriendList={updateUserFriendList}
                                                        className={`${(chatCtx.activeChat?.type == "user" && chatCtx.activeChat.index == idx) ? "selected" : ""}`}
                                                    />
                                                })
                                            }

                                            {(userFriends.length == 0) &&
                                                <Paragraph
                                                    className="text-center"
                                                >
                                                    Você não possui nenhum amigo
                                                </Paragraph>
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
                                                        updateUserGroupList={updateUserGroupList}
                                                        className={`${(chatCtx.activeChat?.type == "group" && chatCtx.activeChat.index == idx) ? "selected" : ""}`}
                                                    />
                                                })
                                            }

                                            {(userGroups.length == 0) &&
                                                <Paragraph
                                                    className="text-center"
                                                >
                                                    Você não está participando de nenhum grupo
                                                </Paragraph>
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

                            <Button
                                onClick={handlePendingInvitationsBtn}
                                className="!ms-auto !bg-transparent border-solid border border-gray-500/40 !duration-100 !text-slate-800 hover:!bg-gray-200 active:!bg-blue-500 group"
                                title="Pedidos de Amizade"
                            >
                                <SlEnvolopeLetter className="fill-blue-600 w-5 h-auto hover:!bg-transparent transition-all group-active:fill-white" />
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
                        {(menuCtx.showFileInput == true && chatCtx.activeChat != null) &&
                            <FileInputModal files={files} setFiles={setFiles} fileInputRef={fileInputRef} />
                        }

                        {(userCtx.user != null && chatCtx.activeChat != null) &&
                            <div>

                            </div>
                        }

                        {/* Container com as mensagens do chat selecionado */}
                        {(userCtx!.user != null && chatCtx.activeChat != null) &&

                            <MessagesContainer
                                selectedChat={chatCtx.activeChat}
                                userFriends={userFriends}
                                userGroups={userGroups}
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
                            selectedFiles={files}
                            loggedUser={userCtx.user!}
                            clearFiles={handleClearFiles}
                            setSelectedFiles={setFiles}
                        />
                    </div>
                </div>
            }
        </>

    );
}


export default Chat;