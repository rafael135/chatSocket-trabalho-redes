"use client"

import { MessageType } from "@/types/Message";
import { ReactNode, createContext, useState } from "react";




type MessageContextType = {
    messages: MessageType[];
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}

export const MessagesContext = createContext<MessageContextType | null>(null);


export const MessagesProvider = ({ children }: { children: ReactNode }) => {

    const [messages, setMessages] = useState<MessageType[]>([]);


    return (
        <MessagesContext.Provider value={{ messages: messages, setMessages: setMessages }}>
            { children }
        </MessagesContext.Provider>
    )
}