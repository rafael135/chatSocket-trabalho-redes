import Button from "@/components/Atoms/Button";
import Paragraph from "@/components/Atoms/Paragraph";
import Modal from "@/components/Organisms/Modal";
import ModalHeader from "@/components/Organisms/Modal/ModalHeader";
import PendingFriendCard from "@/components/Organisms/PendingFriendCard";
import { addOrRemoveFriend, getPendingFriends } from "@/lib/actions";
import { User, UserFriend } from "@/types/User";
import { Spinner } from "flowbite-react";
import { useEffect, useLayoutEffect, useState } from "react";



type props = {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    updateFriendList: (newFriend: UserFriend, operation: "add" | "del") => void;
    loggedUser: User;
};

const PendingInvitationsModal = ({ show, setShow, updateFriendList, loggedUser }: props) => {

    const [pendingFriends, setPendingFriends] = useState<UserFriend[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleAcceptFriend = async (friendUuid: string, friend: UserFriend) => {
        setLoading(true);
        let res = await addOrRemoveFriend(friendUuid);

        if (res != null) {
            updateFriendList(friend, "add");
            setPendingFriends([...pendingFriends.filter((fr) => fr.uuid != friendUuid)]);
        }
    }

    const handlePendingFriends = async () => {
        setLoading(true);

        let res = await getPendingFriends(loggedUser.uuid);

        setPendingFriends(res);
        setLoading(false);
    }



    return (
        <Modal
            show={show}
            closeFn={() => setShow(false)}
            dismissible={true}
        >
            <ModalHeader closeFn={() => setShow(false)}>
                <Paragraph className="text-xl">Solicitações pendentes</Paragraph>
            </ModalHeader>

            <div className="px-2 py-3">
                <div className={`flex flex-col overflow-y-auto overflow-x-hidden ${(loading == true) ? "justify-center items-center" : ""}`}>
                    {(pendingFriends.length > 0 && loading == false) &&
                        pendingFriends.map((friend, idx) => {
                            return <PendingFriendCard key={idx} loggedUser={loggedUser} updateUserFriendList={updateFriendList} handleOnAccept={handleAcceptFriend} friend={friend} idx={idx} />
                        })
                    }

                    {(loading == true) &&
                        <Spinner className="w-6 h-auto fill-blue-600" />
                    }

                    {(pendingFriends.length == 0) && loading == false &&
                        <Button
                            onClick={handlePendingFriends}

                        >
                            Recarregar
                        </Button>
                    }
                </div>
            </div>
        </Modal>
    );
}

export default PendingInvitationsModal;