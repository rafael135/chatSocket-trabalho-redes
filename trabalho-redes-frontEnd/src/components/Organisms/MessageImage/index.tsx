import { MessageImageType } from "@/types/Message";
import { User } from "@/types/User";
import Image from "next/image";


type props = {
    image: MessageImageType;
    loggedUser: User;
};

const MessageImage = ({ image, loggedUser }: props) => {



    return(
        <div className="relative h-[100px] w-auto group">
            <div
                className="z-40 w-6 h-6 bg-slate-800/30 justify-center items-center rounded-full absolute top-1 right-1 hidden cursor-pointer group-hover:flex"
            >
                
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