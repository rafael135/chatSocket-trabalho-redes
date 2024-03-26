import { MessageType, SelectedChatInfo, UserMessage } from "@/types/Message";
import { UserGroupMsg, UserPrivateMsg } from "@/types/Socket";
import { queryClient } from "@/utils/queryClient";
import { QueryCache } from "@tanstack/react-query";
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
import { useEffect, useState } from "react";
import { BsArrowRight, BsEmojiNeutralFill, BsPaperclip } from "react-icons/bs";
import { Socket } from "socket.io-client";



type props = {
    selectedChat: SelectedChatInfo | null;
    selectedFiles: File[];
    setShowFileInput: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    socket: Socket | null;
    messages: MessageType[];
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
};

const MsgInput = ({ selectedChat, selectedFiles, setShowFileInput, setSelectedFiles, socket, messages, setMessages }: props) => {

    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const [msgInput, setMsgInput] = useState<string>("");



    const handleEmojiClicked = (emoji: EmojiClickData) => {
        setSelectedEmoji(emoji.emoji);
    }

    const handleNewMsg = () => {
        if(selectedFiles.length == 0 && msgInput.length > 0 && selectedChat != null && socket != null) {
            
            //console.log(selectedChat);

            if(selectedChat.type == "group") {
                let msg: UserGroupMsg = {
                    groupUuid: selectedChat.uuid,
                    msg: msgInput
                };

                socket.emit("user_group_msg", msg);
                setMsgInput("");
            } else {
                let msg: UserPrivateMsg = {
                    userUuid: selectedChat.uuid,
                    msg: msgInput
                };

                //console.log(msg);

                socket.emit("user_private_msg", msg);
                setMsgInput("");
            }

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
                    className="w-8 h-8 fill-gray-500/60 rounded-full cursor-pointer hover:fill-gray-500/80 hover:bg-black/10 active:fill-gray-500"
                    onClick={() => { setShowEmojiPicker(!showEmojiPicker) }}
                />
                
                <input
                    className="flex flex-1 text-slate-800 bg-gray-100 border-none py-1 px-2 rounded-lg w-full text-xl focus:outline-none focus:shadow-none focus:border-none focus:ring-0"
                    placeholder=""
                    type="text"
                    value={msgInput}
                    onKeyUp={(e) => { if (e.key == "Enter"  && selectedChat != null) { handleNewMsg(); } }}
                    onChange={(e) => { setMsgInput(e.target.value); }}
                    disabled={(socket == null) ? true : false}
                />

                <BsPaperclip
                    className="w-8 h-8 fill-gray-500/60 rounded-full cursor-pointer hover:fill-gray-500/80 hover:bg-black/10 active:fill-gray-500"
                    onClick={() => { setShowFileInput(true); }}
                />

                <BsArrowRight
                    className="w-8 h-8 p-0.5 fill-gray-500/60 rounded-full cursor-pointer hover:fill-gray-500/80 hover:bg-black/10 active:fill-gray-500"
                    onClick={() => { handleNewMsg(); }}
                />
            </div>
        </>
    );
}

export default MsgInput;