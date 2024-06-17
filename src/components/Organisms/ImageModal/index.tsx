import React, { useContext } from "react";
import Modal from "../Modal";
import ModalHeader from "../Modal/ModalHeader";
import Image from "next/image";
import { MenuContext } from "@/contexts/MenuContext";




type props = {
    
};

const ImageModal = ({  }: props) => {

    const menuCtx = useContext(MenuContext)!;

    return(
        <Modal
            show={menuCtx.showImageModal}
            closeFn={() => menuCtx.setShowImageModal(false)}
            className="w-full h-full"
        >
            <ModalHeader
                closeFn={() => menuCtx.setShowImageModal(false)}
                title="Imagem"
            >

            </ModalHeader>

            <div className="relative flex justify-center items-center w-full h-full">
                <Image
                    alt={"Imagem"}
                    src={menuCtx.imageUrlModal}
                    loading="lazy"
                    fill={true}
                />
            </div>
        </Modal>
    );
}


export default ImageModal;