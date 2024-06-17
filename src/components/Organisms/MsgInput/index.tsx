import { ChatContext } from "@/contexts/ChatContext";
import { MenuContext } from "@/contexts/MenuContext";
import { SocketContext } from "@/contexts/SocketContext";
import { uploadMessageFile } from "@/lib/actions";
import { MessageType, SelectedChatInfo, UserMessage } from "@/types/Message";
import { UserGroupMsg, UserPrivateMsg } from "@/types/Socket";
import { User } from "@/types/User";
import { queryClient } from "@/utils/queryClient";
import { QueryCache } from "@tanstack/react-query";
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import { useContext, useEffect, useState } from "react";
import { BsArrowRight, BsEmojiNeutralFill, BsPaperclip } from "react-icons/bs";
import { Socket } from "socket.io-client";
import styled from "styled-components";

const StyledBtnFiles = styled.svg.attrs(() => ({}))`

`;

type props = {
    selectedFiles: File[];
    loggedUser: User;
    clearFiles: () => void;
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

const MsgInput = ({ selectedFiles, loggedUser, clearFiles, setSelectedFiles }: props) => {

    const socketCtx = useContext(SocketContext)!;
    const chatCtx = useContext(ChatContext)!;
    const menuCtx = useContext(MenuContext)!;

    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const [msgInput, setMsgInput] = useState<string>("");

    const [sendingMsg, setSendingMsg] = useState<boolean>(false);



    const handleEmojiClicked = (emoji: EmojiClickData) => {
        setSelectedEmoji(emoji.emoji);
    }

    const handleNewMsg = async () => {
        if ((msgInput.length > 0 || selectedFiles.length > 0) && chatCtx.activeChat != null && socketCtx.socket != null) {

            //console.log(selectedChat);

            let filesPaths: string[] = [];

            if (selectedFiles.length > 0) {
                //let filesPaths: string[] = [];
                let filesForm = new FormData();


                for (let i = 0; i < selectedFiles.length; i++) {
                    filesForm.append("files", selectedFiles[i]);
                }

                filesForm.set("userUuid", loggedUser.uuid);

                type FileUploadResponse = {
                    filePaths: string[];
                    status: number;
                };

                let req = await fetch("/api/image/upload", {
                    method: "POST",
                    body: filesForm,
                    headers: {
                        Accept: "application/json"
                    }
                });

                let uploadResponse: FileUploadResponse = await req.json();

                if (uploadResponse.status == 201) {
                    filesPaths = uploadResponse.filePaths;
                }

                //let res = await uploadMessageFile(loggedUser.uuid, selectedFiles);
                //filesPaths = res;
            }

            setSendingMsg(true);

            if (chatCtx.activeChat.type == "group") {
                let msg: UserGroupMsg = {
                    groupUuid: chatCtx.activeChat.uuid,
                    type: (filesPaths.length == 0) ? "msg" : "img",
                    imgs: filesPaths,
                    msg: msgInput
                };

                socketCtx.socket.emit("user_group_msg", msg);
                
            } else {
                let msg: UserPrivateMsg = {
                    userUuid: chatCtx.activeChat.uuid,
                    type: (filesPaths.length == 0) ? "msg" : "img",
                    imgs: filesPaths,
                    msg: msgInput
                };

                //console.log(msg);

                socketCtx.socket.emit("user_private_msg", msg);
            }

            setSelectedFiles([]);
            setMsgInput("");
            setSendingMsg(false);

            return;
        }
    }

    useEffect(() => {
        if (selectedEmoji != null) {
            setMsgInput(msgInput + selectedEmoji);
            setSelectedEmoji(null);
        }
    }, [selectedEmoji]);

    return (
        <>
            {(showEmojiPicker == true) &&
                <div className="absolute bottom-12 left-0">
                    <EmojiPicker
                        onEmojiClick={handleEmojiClicked}
                        emojiStyle={EmojiStyle.APPLE}
                        theme={Theme.DARK}
                        lazyLoadEmojis={true}
                    />
                </div>
            }

            <div className="h-12 w-full px-2 mt-auto flex gap-2 items-center bg-gray-300 border border-solid border-t-gray-400/70 border-b-gray-400/70 overflow-hidden">
                <BsEmojiNeutralFill
                    className={`w-8 h-8 fill-gray-500/60 rounded-full
                        ${(socketCtx.socket == null || chatCtx.activeChat == null || sendingMsg == true) ? "cursor-default" : "cursor-pointer hover:fill-gray-500/80 hover:bg-black/10 active:fill-gray-500"}
                    `}
                    onClick={() => { if (chatCtx.activeChat != null) { setShowEmojiPicker(!showEmojiPicker); } }}
                />

                <input
                    className="flex flex-1 text-slate-800 bg-gray-100 border-none py-1 px-2 rounded-lg w-full text-xl focus:outline-none focus:shadow-none focus:border-none focus:ring-0"
                    placeholder=""
                    type="text"
                    value={msgInput}
                    onKeyUp={(e) => { if (e.key == "Enter" && chatCtx.activeChat != null) { handleNewMsg(); } }}
                    onChange={(e) => { setMsgInput(e.target.value); }}
                    disabled={(chatCtx.activeChat == null || sendingMsg == true) ? true : false}
                />

                <form
                    className="hidden"
                    action="">

                </form>

                <BsPaperclip
                    className={`w-8 h-8 fill-gray-500/60 rounded-full
                        ${(socketCtx.socket == null || chatCtx.activeChat == null || sendingMsg == true) ? "cursor-default" : "cursor-pointer hover:fill-gray-500/80 hover:bg-black/10 active:fill-gray-500"}
                    `}
                    onClick={() => { if (socketCtx.socket != null && chatCtx.activeChat != null && sendingMsg != true) { menuCtx.setShowFileInput(true); } }}
                />

                <BsArrowRight
                    className={`w-8 h-8 p-0.5 fill-gray-500/60 rounded-full
                        ${(socketCtx.socket == null || chatCtx.activeChat == null || sendingMsg == true) ? "cursor-default" : "cursor-pointer hover:fill-gray-500/80 hover:bg-black/10 active:fill-gray-500"}
                    `}
                    onClick={() => { if (chatCtx.activeChat != null && sendingMsg != true) { handleNewMsg(); } }}
                />
            </div>
        </>
    );
}

export default MsgInput;