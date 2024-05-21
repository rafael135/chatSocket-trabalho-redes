import ContextMenuItem from "@/components/Molecules/ContextMenuItem";
import { SelectedChatInfo } from "@/types/Message";
import { User, UserFriend } from "@/types/User";
import { MouseEvent, ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsX } from "react-icons/bs";
import { IoReload } from "react-icons/io5";
import { Group } from "@/types/Group";
import Paragraph from "@/components/Atoms/Paragraph";
import Button from "@/components/Atoms/Button";
import UserCard from "../UserCard";
import { useGroupMembers } from "@/utils/queries";
import { Spinner } from "flowbite-react";




type props = {
    selectedChat: SelectedChatInfo;
    setShowChatInfo: React.Dispatch<React.SetStateAction<boolean>>;
    userGroup: Group;
};

const GroupInfo = ({ selectedChat, setShowChatInfo, userGroup }: props) => {

    //const [isLoading, setIsLoading] = useState()
    //const [groupMembers, setGroupMembers] = useState<User[]>([]);

    const groupMembersQuery = useGroupMembers(userGroup.uuid);

    const date = new Date(Date.parse(userGroup.createdAt));
    const day = `${(date.getDay() < 10) ? `0${date.getDay()}` : date.getDay()}`;
    const month = `${(date.getMonth() < 10) ? `0${date.getMonth()}` : date.getMonth()}`;

    const handleLoadMembersBtn = async () => {
        //let res = await getGroupMembers(userGroup.uuid);
        //setGroupMembers(res);

        groupMembersQuery.refetch();
    }

    return(
        <AnimatePresence>
            <motion.div
                initial={{ y: -300 }}
                animate={{ y: 0 }}
                exit={{ y: -300 }}
                transition={{ duration: 0.2, type: "tween" }}
                className="static top-0 left-0 right-0 bg-gray-100 shadow flex flex-col mb-2"
            >
                <div className="flex flex-row items-center px-4 pt-0.5">
                    <div className="flex-1 text-slate-800 font-bold">
                        Nome: <span className="font-normal">{userGroup.name}</span>
                    </div>

                    <span
                        className="h-8 w-8 flex justify-center items-center rounded-xl cursor-pointer hover:bg-black/10 group"
                        onClick={() => setShowChatInfo(false)}
                    >
                        <BsX className="w-5 h-auto fill-red-600" />
                    </span>
                </div>

                <div
                    className="px-3"
                >
                    <div className="flex-1 text-slate-800 font-bold px-1">
                        Criado em: <span className="font-normal">{`${day}/${month}/${date.getFullYear()}`}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1 px-4">
                    <div className="flex ">
                        <Paragraph className="flex-1">Membros:</Paragraph>
                        <Button
                            className="!p-1 !me-2 group"
                            onClick={handleLoadMembersBtn}
                        >
                            <IoReload className="fill-white transition-all group-hover:fill-gray-100" />
                        </Button>
                    </div>
                    

                    <div className={`p-2 flex flex-row gap-2 border border-solid border-gray-600/40 mx-2 mb-2
                        ${(groupMembersQuery.isLoading == true || groupMembersQuery.isFetching == true) ? "justify-center items-center" : ""}
                    `}>

                        {(groupMembersQuery.data != undefined && groupMembersQuery.isFetching == false && groupMembersQuery.isLoading == false) &&
                            groupMembersQuery.data.map((member, idx) => {
                                return <UserCard className="w-1/3" user={member} key={idx} />
                            })
                        }

                        {(groupMembersQuery.isFetching == true || groupMembersQuery.isLoading == true) &&
                            <Spinner className="w-10 h-auto fill-blue-600" />
                        }
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default GroupInfo;