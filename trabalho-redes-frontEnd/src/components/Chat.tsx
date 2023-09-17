"use client"

import { UserContext } from "@/contexts/UserContext";
import socket from "@/helpers/Socket";
import { User } from "@/types/User";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useContext, useState, useRef, useEffect } from "react";

import { MessagesContext } from "@/contexts/MessagesContext";
import { ImgSendType, MessageType } from "@/types/Message";



import fs from "fs/promises";

import { BsEmojiNeutralFill } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import UserCard from "./UserCard";
import MessagesContainer from "./MessagesContainer";
import AnnexedFile from "./AnnexedFile";

const Chat = () => {
    const userCtx = useContext(UserContext);
    const messagesCtx = useContext(MessagesContext);

    const [userName, setUserName] = useState<string>("");
    const [msgInput, setMsgInput] = useState<string>("");

    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [showFileInput, setShowFileInput] = useState<boolean>(false);

    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

    const handleLoginBtn = () => {
        if(userName != "") {
            socket.emit("join-request", { name: userName });

            socket.on("user-ok", (userList: User[], user: User) => {
                userCtx?.setUser(user);
                userCtx?.setUsersList(userList);
            });
        }
    }


    const handleNewMsg = async () => {
        if(files.length > 0) {

            let msg: ImgSendType = { user: userCtx!.user!, msg: msgInput.trim(), imgs: files};

            socket.emit("send-img", msg);

            
            setFiles([]);
            setMsgInput("");
            return;
        }

        if(msgInput != "") {
            let newMsg: MessageType = { author: userCtx!.user!, msg: msgInput.trim(), type: "msg" };

            socket.emit("send-msg", newMsg);

            setMsgInput("");
        }
    }

    const handleFileDragEnter = (e: React.DragEvent) => {
        setShowFileInput(true);
    }

    const handleFileDragLeave = (e: React.DragEvent) => {
        
    }

    const handleLabelDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    }

    const handleLabelDrop = (e: React.DragEvent) => {
        e.preventDefault();

        if(fileInputRef == null) {
            return;
        }

        setFiles(Array.from(e.dataTransfer.files));
        setShowFileInput(false);
    }


    const handleEmojiClicked = (emoji: EmojiClickData) => {
        setSelectedEmoji(emoji.emoji);
    }

    socket.on("new-user", (usr: User) => {
        userCtx!.setUsersList([...userCtx!.usersList, usr]);
    });

    socket.on("renew-users", (usrList: User[]) => {
        userCtx?.setUsersList(usrList);
    });

    socket.on("left-user", (userLeft: User) => {
        messagesCtx?.setMessages([...messagesCtx.messages, { author: userLeft, msg: "", type: "exit-user" }]);
    });

    socket.on("disconnect", () => {
        messagesCtx?.setMessages([...messagesCtx.messages, { author: null, msg: "Conexão perdida com o host!", type: "error" }]);
        userCtx?.setUsersList([]);
    });


    useEffect(() => {
        if(files.length > 0) {
            setShowFileInput(false);
        }
    }, [files]);

    useEffect(() => {
        if(selectedEmoji != null) {
            setMsgInput(msgInput + selectedEmoji);
        }
    }, [selectedEmoji]);

    return (
        <>
            {/* Modal para "Login" do usuario */}
            {(userCtx?.user?.ip == null) &&
                <Modal show={(userCtx?.user?.ip == null) ? true : false}>
                    <Modal.Body>
                        <form onSubmit={(e) => { e.preventDefault(); handleLoginBtn(); }}>
                            <div className="mb-1">
                                <Label
                                    htmlFor="name"
                                    value="Nome:"
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <TextInput
                                    className="flex-1"
                                    id="name"
                                    placeholder="Digite seu nome"
                                    required
                                    type="text"
                                    value={userName}
                                    onChange={(e) => { setUserName(e.target.value); }}
                                />
        
                                <Button color="success" onClick={handleLoginBtn}>
                                    Entrar
                                </Button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            }

            {(userCtx?.user?.ip != null) &&
                <div className="h-full flex flex-row bg-gray-200/90 border-solid border border-gray-400/70 shadow-lg">
                    <div className="w-60 bg-gray-50">
                        {userCtx.usersList.map((usr, idx) => {
                            return <UserCard key={idx} loggedUser={userCtx.user!} user={usr} />
                        })}
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



                        {(showFileInput == true) &&
                            <Modal show={(showFileInput == true)} onClose={() => { setShowFileInput(false); }} >
                                <Modal.Header>

                                </Modal.Header>

                                <Modal.Body>
                                    <label
                                        className="w-full h-24 flex justify-center items-center border border-solid border-gray-500/40 rounded-lg hover:bg-black/10" 
                                        htmlFor="files"
                                        onDragOver={handleLabelDragOver}
                                        onDrop={handleLabelDrop}
                                    >
                                        {(files.length == 0) &&
                                            <h2 className="text-2xl">Solte a(s) imagen(s) aqui</h2>
                                        }

                                        {(files.length > 0) &&
                                            files.map((file, idx) => {
                                                return <div key={idx}></div>
                                            })
                                        }
                                    </label>
                                    <input
                                        id="files"
                                        type="file"
                                        multiple={true}
                                        hidden={true}
                                        ref={fileInputRef}
                                    />
                                </Modal.Body>
                            </Modal>
                        }

                        <div className="w-full flex-1 overflow-auto">
                            <MessagesContainer loggedUser={userCtx!.user} messages={messagesCtx!.messages} setMessages={messagesCtx!.setMessages} />
                        </div>

                        {(files.length > 0) &&
                            <div className="w-full h-12 max-h-12 p-1 bg-slate-200 border border-solid border-t-gray-500/40 flex justify-end items-center">
                                {files.map((file, idx) => {
                                        return <AnnexedFile key={idx} file={file} fileIndex={idx} files={files} setFiles={setFiles} />
                                    })
                                }
                            </div>
                        }

                        <div className="h-12 w-full flex items-center bg-gray-300 border border-solid border-t-gray-400/70 border-b-gray-400/70 overflow-hidden">
                            <input 
                                className="flex flex-1 text-slate-800 bg-transparent border-none p-2 w-full text-xl focus:outline-none focus:shadow-none focus:border-none focus:ring-0"
                                placeholder=""
                                type="text"
                                value={msgInput}
                                onKeyUp={(e) => { if(e.key == "Enter") { handleNewMsg(); } }}
                                onChange={(e) => { setMsgInput(e.target.value); }}
                            />

                            <BsEmojiNeutralFill 
                                className="w-8 h-8 fill-gray-500/60 mr-2 rounded-full cursor-pointer hover:fill-gray-500/80 hover:bg-black/10 active:fill-gray-500"
                                onClick={() => { setShowEmojiPicker(!showEmojiPicker) }}
                            />
                        </div>
                    </div>
                </div>
            }
        </>
        
    );
}


export default Chat;