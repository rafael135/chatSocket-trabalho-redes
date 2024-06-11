import DefaultChatPhoto from "@/components/Atoms/DefaultChatPhoto";
import Paragraph from "@/components/Atoms/Paragraph";
import { User } from "@/types/User";
import Image from "next/image";
import { BsPersonFill } from "react-icons/bs";

type props = {
    user: User;
    className?: string;
};

const UserCard = ({ user, className }: props) => {
    return (
        <div className={`flex flex-row items-center gap-1.5 p-1 border border-solid border-gray-600/40 rounded-lg
            ${className}
        `}>
            <div className="h-14 w-14 max-w-14 max-h-14 flex justify-center items-center border border-solid border-gray-600/40 bg-white rounded-full">
                {(user.avatarSrc != null) &&
                    <Image
                        loading="lazy"
                        width={48}
                        height={48}
                        quality={100}
                        src={`/${user.avatarSrc}`}
                        alt="Avatar"
                        className="rounded-full"
                    />
                }

                {(user.avatarSrc == null) &&
                    <DefaultChatPhoto />
                }
            </div>
            
            <div className="flex flex-col truncate">
                <Paragraph className="mt-0.5 pe-2 text-slate-800 text-lg font-normal truncate">{user.name}</Paragraph>
                <Paragraph className="text-slate-700 font-light truncate">{user.nickName}</Paragraph>
            </div>
            
        </div>
    );
}

export default UserCard;