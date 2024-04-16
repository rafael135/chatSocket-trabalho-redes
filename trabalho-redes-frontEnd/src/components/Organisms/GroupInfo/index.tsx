import { Group } from "@/types/Group";
import { SelectedChatInfo } from "@/types/Message"
import { ReactNode } from "react";



type props = {
    selectedChat: SelectedChatInfo;
    setShowChatInfo: React.Dispatch<React.SetStateAction<boolean>>;
    userGroup: Group;
}

const GroupInfo = ({ selectedChat, setShowChatInfo, userGroup }: props) => {


    return(
        <div className="absolute top-0 left-0 right-0">

        </div>
    )
}

export default GroupInfo;