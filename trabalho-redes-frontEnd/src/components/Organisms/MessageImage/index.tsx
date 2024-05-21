import { MessageImageType } from "@/types/Message";
import { User } from "@/types/User";
import { BiExpand } from "react-icons/bi";
import Image from "next/image";
import { MouseEvent, useContext } from "react";
import { MenuContext } from "@/contexts/MenuContext";
import style from "./style.module.css";


type props = {
    image: MessageImageType;
    loggedUser: User;
};

const MessageImage = ({ image, loggedUser }: props) => {

    const menuCtx = useContext(MenuContext)!;

    const handleExpandImageBtn = (e: MouseEvent<HTMLDivElement>) => {
        menuCtx.setImageUrlModal(`/${image.path}`);
        menuCtx.setShowImageModal(true);
    }

    return(
        <div className="relative h-[100px] w-auto group">
            <div
                className={`${style["btn-expand"]} z-40 w-6 h-6 justify-center items-center rounded-full absolute top-1 left-1 hidden cursor-pointer hover:bg-blue-500 group-hover:flex group`}
                title="Expandir Imagem"
                onClick={handleExpandImageBtn}
            >
                <BiExpand className="transition-all hover:fill-white" />
            </div>

            <Image
                alt={`Imagem`}
                loading="lazy"
                fill={true}
                className="absolute top-0 bottom-0 left-0 right-0"
                src={`/${image.path}`}
            />
        </div>
    )
};

export default MessageImage;