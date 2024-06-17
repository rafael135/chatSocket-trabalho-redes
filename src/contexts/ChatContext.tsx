"use client"

import { Group } from "@/types/Group";
import { MessageType, SelectedChatInfo } from "@/types/Message";
import { UserFriend } from "@/types/User";
import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";


type ChatContextType = {
    activeChat: SelectedChatInfo | null;
    setActiveChat: Dispatch<SetStateAction<SelectedChatInfo | null>>;
    messages: MessageType[];
    setMessages: Dispatch<SetStateAction<MessageType[]>>;
    friends: UserFriend[];
    setFriends: Dispatch<SetStateAction<UserFriend[]>>;
    groups: Group[];
    setGroups: Dispatch<SetStateAction<Group[]>>;
};

export const ChatContext = createContext<ChatContextType | null>(null);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {

    const [activeChat, setActiveChat] = useState<SelectedChatInfo | null>(null);
    const [messages, setMessages] = useState<MessageType[]>([]);

    const [friends, setFriends] = useState<UserFriend[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);

    return(
        <ChatContext.Provider
            value={{ 
                activeChat: activeChat, setActiveChat: setActiveChat,
                messages: messages, setMessages: setMessages,
                friends: friends, setFriends: setFriends,
                groups: groups, setGroups: setGroups
            }}
        >
            { children }
        </ChatContext.Provider>
    );
}

