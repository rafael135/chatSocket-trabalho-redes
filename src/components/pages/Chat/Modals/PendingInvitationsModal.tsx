import Button from "@/components/Atoms/Button";
import Paragraph from "@/components/Atoms/Paragraph";
import Modal from "@/components/Organisms/Modal";
import ModalHeader from "@/components/Organisms/Modal/ModalHeader";
import PendingFriendCard from "@/components/Organisms/PendingFriendCard";
import { MenuContext } from "@/contexts/MenuContext";
import { UserContext } from "@/contexts/UserContext";
import { addOrRemoveFriend, getPendingFriends } from "@/lib/actions";
import { FaArrowRotateRight } from "react-icons/fa6";
import { User, UserFriend } from "@/types/User";
import { Spinner } from "flowbite-react";
import { useContext, useEffect, useLayoutEffect, useState } from "react";



type props = {
    updateFriendList: (newFriend: UserFriend, operation: "add" | "del") => void;
};

const PendingInvitationsModal = ({ updateFriendList }: props) => {

    const userCtx = useContext(UserContext)!;
    const menuCtx = useContext(MenuContext)!;

    const [pendingFriends, setPendingFriends] = useState<UserFriend[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleAcceptFriend = async (friendUuid: string, friend: UserFriend) => {
        setLoading(true);
        let res = await addOrRemoveFriend(friendUuid);

        if (res != null) {
            updateFriendList(friend, "add");
            setPendingFriends([...pendingFriends.filter((fr) => fr.uuid != friendUuid)]);
        }
        setLoading(false);
    }

    const handlePendingFriends = async () => {
        setLoading(true);

        let res = await getPendingFriends(userCtx.user!.uuid);

        setPendingFriends(res);
        setLoading(false);
    }



    return (
        <Modal
            show={menuCtx.showPendingInvitations}
            closeFn={() => menuCtx.setShowPendingInvitations(false)}
            className="h-full"
            dismissible={true}
        >
            <ModalHeader closeFn={() => menuCtx.setShowPendingInvitations(false)}>
                <Paragraph className="text-xl">Solicitações pendentes</Paragraph>
            </ModalHeader>

            <div className="flex flex-col gap-2 px-2 py-3 h-full">
                <div className={`flex-1 p-1 flex flex-col overflow-y-auto overflow-x-hidden border border-solid border-gray-600/40 rounded-lg ${(loading == true || pendingFriends.length == 0) ? "justify-center items-center" : ""}`}>
                    {(pendingFriends.length > 0 && loading == false) &&
                        pendingFriends.map((friend, idx) => {
                            return <PendingFriendCard key={idx} updateUserFriendList={updateFriendList} handleOnAccept={handleAcceptFriend} friend={friend} idx={idx} />
                        })
                    }

                    {(loading == true) &&
                        <Spinner className="w-8 h-auto fill-blue-600" />
                    }

                    {(pendingFriends.length == 0 && loading == false) &&
                        <Paragraph className="text-base text-slate-700">
                            Nenhuma solicitação encontrada
                        </Paragraph>
                    }
                </div>

                <Button
                    onClick={handlePendingFriends}
                    className={`w-full flex gap-1 ${(loading == true) ? "disabled" : ""}`}
                    disabled={(loading == true)}
                >
                    Recarregar
                    <FaArrowRotateRight className="fill-white" />
                </Button>

            </div>
        </Modal>
    );
}

export default PendingInvitationsModal;