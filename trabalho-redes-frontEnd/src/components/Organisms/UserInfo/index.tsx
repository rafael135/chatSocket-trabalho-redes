import ContextMenuItem from "@/components/Molecules/ContextMenuItem";
import { SelectedChatInfo } from "@/types/Message";
import { UserFriend } from "@/types/User";
import { MouseEvent, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BsX } from "react-icons/bs";




type props = {
    selectedChat: SelectedChatInfo;
    setShowChatInfo: React.Dispatch<React.SetStateAction<boolean>>;
    userFriend: UserFriend;
};

const UserInfo = ({ selectedChat, setShowChatInfo, userFriend }: props) => {


    const date = new Date(Date.parse(userFriend.createdAt));

    const day = `${(date.getDay() < 10) ? `0${date.getDay()}` : date.getDay()}`;
    const month = `${(date.getMonth() < 10) ? `0${date.getMonth()}` : date.getMonth()}`;

    return(
        <AnimatePresence>
            <motion.div
                initial={{ y: -300 }}
                animate={{ y: 0 }}
                exit={{ y: -300 }}
                transition={{ duration: 0.2, type: "tween" }}
                className="static top-0 left-0 right-0 bg-gray-100 shadow flex flex-col mb-2"
            >
                <div className="flex flex-row items-center px-1 pt-0.5">
                    <div className="flex-1 text-slate-800 font-bold">
                        Nickname: <span className="font-normal">{userFriend.nickName}</span>
                    </div>

                    <span
                        className="h-8 w-8 flex justify-center items-center rounded-xl cursor-pointer hover:bg-black/10 group"
                        onClick={() => setShowChatInfo(false)}
                    >
                        <BsX className="w-5 h-auto fill-red-600" />
                    </span>
                </div>

                <div
                    className=""
                >
                    <div className="flex-1 text-slate-800 font-bold px-1">
                        Amigo desde: <span className="font-normal">{`${day}/${month}/${date.getFullYear()}`}</span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default UserInfo;