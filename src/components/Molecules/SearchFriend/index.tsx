import Button from "@/components/Atoms/Button";
import { UserFriend } from "@/types/User";
import Image from "next/image";
import { useEffect } from "react";
import { BsPersonFill, BsPlus } from "react-icons/bs";
import { MdDelete, MdDone } from "react-icons/md";




type props = {
    friend: UserFriend;
    idx: number;
    addFriend: (userUuid: string, idx: number) => void;
};
const SearchFriend = ({ friend, idx, addFriend }: props) => {

    return (
        <div className="w-[33.3333%] lg:w-[50%] p-1 bg-white border border-solid border-gray-600/30 rounded-md shadow-md flex flex-row gap-1">
            <div className="relative w-12 h-12 flex justify-center items-center rounded-full border border-solid border-gray-600/40">
                {(friend?.avatarSrc != null) &&
                    <Image
                        loading="lazy"
                        fill={true}
                        quality={100}
                        src={`/${friend.avatarSrc}`}
                        alt="Avatar"
                        className="rounded-full"
                    />
                }

                {(friend?.avatarSrc == null) &&
                    <BsPersonFill className="w-10 h-auto fill-slate-700" />
                }
            </div>

            <div className="inline-flex flex-col gap-0 truncate max-w-fit">
                <span className="text-base text-ellipsis truncate cursor-help" title={friend.name}>{friend.name}</span>
                <span className="text-xs text-slate-900 text-ellipsis truncate cursor-help" title={friend.nickName}>{friend.nickName}</span>
            </div>

            <Button
                className={`w-8 h-8 !p-0 !ms-auto max-w-max  border border-solid border-gray-600/40 group
                    ${(friend.isPending == true || friend.isFriend == true) ? "!bg-white hover:!bg-red-600" : "!bg-white hover:!bg-blue-600"}
                `}
                title={`
                    ${(friend.isFriend == true && friend.isPending == false) ? "Desfazer amizade" : ""}
                    ${(friend.isFriend == false && friend.isPending == true) ? "Cancelar solicitação" : ""}
                    ${(friend.isFriend == false && friend.isPending == false) ? "Adicionar amigo" : ""}
                `}
                onClick={() => addFriend(friend.uuid, idx)}
            >
                {(friend.isFriend == true || friend.isPending == true) &&
                    <MdDelete className="w-6 h-auto fill-red-600 transition-all hover:!bg-transparent group-hover:fill-white" />
                }

                {(friend.isFriend == false && friend.isPending == false) &&
                    <BsPlus className="w-6 h-auto fill-blue-600 transition-all hover:!bg-transparent group-hover:fill-white" />
                }
                
            </Button>
        </div>
    );
}

export default SearchFriend;