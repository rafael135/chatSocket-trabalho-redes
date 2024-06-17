"use client"

import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

export type MenuContextType = {
    showFileInput: boolean;
    setShowFileInput: Dispatch<SetStateAction<boolean>>;
    showConfigModal: boolean;
    setShowConfigModal: Dispatch<SetStateAction<boolean>>;
    showCreateGroupModal: boolean;
    setShowCreateGroupModal: Dispatch<SetStateAction<boolean>>;
    showAddFriendModal: boolean;
    setShowAddFriendModal: Dispatch<SetStateAction<boolean>>;
    showPendingInvitations: boolean;
    setShowPendingInvitations: Dispatch<SetStateAction<boolean>>;
    showImageModal: boolean;
    setShowImageModal: Dispatch<SetStateAction<boolean>>;
    showChatInfo: boolean;
    setShowChatInfo: Dispatch<SetStateAction<boolean>>;
    showChatPhotoModal: boolean;
    setShowChatPhotoModal: Dispatch<SetStateAction<boolean>>;
    imageUrlModal: string;
    setImageUrlModal: Dispatch<SetStateAction<string>>;
    showContextMenu: boolean;
    setShowContextMenu: Dispatch<SetStateAction<boolean>>;
    contextMenuItems: ReactNode;
    setContextMenuItems: Dispatch<SetStateAction<ReactNode>>;
    contextMenuPositionX: number;
    setContextMenuPositionX: Dispatch<SetStateAction<number>>
    contextMenuPositionY: number;
    setContextMenuPositionY: Dispatch<SetStateAction<number>>
};

export const MenuContext = createContext<MenuContextType | null>(null);


export const MenuContextProvider = ({ children }: { children: ReactNode }) => {

    // Controla se a entrada de arquivos deve ser exibido
    const [showFileInput, setShowFileInput] = useState<boolean>(false);


    const [showConfigModal, setShowConfigModal] = useState<boolean>(false);


    const [showCreateGroupModal, setShowCreateGroupModal] = useState<boolean>(false);


    const [showAddFriendModal, setShowAddFriendModal] = useState<boolean>(false);


    const [showPendingInvitations, setShowPendingInvitations] = useState<boolean>(false);


    const [showChatInfo, setShowChatInfo] = useState<boolean>(false);
    const [showChatPhotoModal, setShowChatPhotoModal] = useState<boolean>(false);

    
    const [showImageModal, setShowImageModal] = useState<boolean>(false);
    const [imageUrlModal, setImageUrlModal] = useState<string>("");



    const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
    const [contextMenuPositionX, setContextMenuPositionX] = useState<number>(0);
    const [contextMenuPositionY, setContextMenuPositionY] = useState<number>(0);
    const [contextMenuItems, setContextMenuItems] = useState<ReactNode>();

    return(
        <MenuContext.Provider
            value={{
                showFileInput: showFileInput,
                setShowFileInput: setShowFileInput,
                showConfigModal: showConfigModal,
                setShowConfigModal: setShowConfigModal,
                showCreateGroupModal: showCreateGroupModal,
                setShowCreateGroupModal: setShowCreateGroupModal,
                showAddFriendModal: showAddFriendModal,
                setShowAddFriendModal: setShowAddFriendModal,
                showPendingInvitations: showPendingInvitations,
                setShowPendingInvitations: setShowPendingInvitations,
                showImageModal: showImageModal,
                setShowImageModal: setShowImageModal,
                showChatInfo: showChatInfo,
                setShowChatInfo: setShowChatInfo,
                showChatPhotoModal: showChatPhotoModal,
                setShowChatPhotoModal: setShowChatPhotoModal,
                imageUrlModal: imageUrlModal,
                setImageUrlModal: setImageUrlModal,

                showContextMenu: showContextMenu,
                setShowContextMenu: setShowContextMenu,
                contextMenuPositionX: contextMenuPositionX,
                setContextMenuPositionX: setContextMenuPositionX,
                contextMenuPositionY: contextMenuPositionY,
                setContextMenuPositionY: setContextMenuPositionY,
                contextMenuItems: contextMenuItems,
                setContextMenuItems: setContextMenuItems
            }}
        >
            { children }
        </MenuContext.Provider>
    );
}