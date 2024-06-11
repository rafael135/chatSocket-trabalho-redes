import DefaultChatPhoto from "@/components/Atoms/DefaultChatPhoto";
import Modal from "@/components/Organisms/Modal";
import ModalHeader from "@/components/Organisms/Modal/ModalHeader";
import { ChatContext } from "@/contexts/ChatContext";
import { MenuContext } from "@/contexts/MenuContext";
import { UserContext } from "@/contexts/UserContext";
import { isUserGroupAdmin } from "@/lib/actions";
import Image from "next/image";
import { useContext, useRef, useState } from "react";
import { BsImage } from "react-icons/bs";


type props = {

};

const ShowChatPhotoModal = ({  }: props) => {

    const userCtx = useContext(UserContext)!;
    const menuCtx = useContext(MenuContext)!;
    const chatCtx = useContext(ChatContext)!;

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handlePhotoClick = async () => {
        let res = await isUserGroupAdmin(chatCtx.activeChat!.uuid, userCtx.user!.uuid);

        if(res == false) {

        } else {
            
        }
    }

    return(
        <Modal
            show={menuCtx.showChatPhotoModal}
            closeFn={() => menuCtx.setShowChatPhotoModal(false)}
        >
            <ModalHeader
                closeFn={() => menuCtx.setShowChatPhotoModal(false)}
                title={`Foto do ${(chatCtx.activeChat?.type == "user") ? "usuário" : "grupo"}`}
            />

            <div
                className="relative my-6 mx-auto flex w-80 h-80 rounded-full justify-center items-center overflow-hidden border border-solid border-gray-600/40 cursor-pointer group"
                onClick={handlePhotoClick}
            >
                <div
                    className=
                    {`
                        hidden
                        justify-center items-center
                        absolute top-0 bottom-0 left-0 right-0
                        bg-black/10
                        group-hover:bg-black/20
                        group-hover:flex
                        transition-all
                    `}
                    
                >
                    <BsImage className="w-8 h-auto fill-white" />
                </div>

                {(chatCtx.activeChat?.srcImg != undefined) &&
                    <Image
                        src={chatCtx.activeChat.srcImg}
                        alt="Foto"
                        width={256}
                        height={256}
                        className=""
                    />
                }

                {(chatCtx.activeChat?.srcImg == undefined) &&
                    <DefaultChatPhoto className="w-64" />
                }
            </div>
        </Modal>
    );
}

export default ShowChatPhotoModal;