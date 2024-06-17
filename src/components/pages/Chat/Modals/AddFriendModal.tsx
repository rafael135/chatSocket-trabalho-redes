import Button from "@/components/Atoms/Button";
import Label from "@/components/Atoms/Label";
import Paragraph from "@/components/Atoms/Paragraph";
import TextInput from "@/components/Atoms/TextInput";
import SearchFriend from "@/components/Molecules/SearchFriend";
import Modal from "@/components/Organisms/Modal"
import ModalHeader from "@/components/Organisms/Modal/ModalHeader";
import { MenuContext } from "@/contexts/MenuContext";
import { addOrRemoveFriend, searchFriends } from "@/lib/actions";
import { UserFriend } from "@/types/User";
import { Spinner } from "flowbite-react";
import { useContext, useEffect, useState } from "react";



type props = {
    updateFriendList: (newFriend: UserFriend, operation: "add" | "del") => void;
};

const AddFriendModal = ({ updateFriendList }: props) => {

    const menuCtx = useContext(MenuContext)!;

    const [searchName, setSearchName] = useState<string>("");
    const [result, setResult] = useState<UserFriend[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const handleSearchBtn = async () => {
        if(searchName != "") {
            setLoading(true);

            let friends = await searchFriends(searchName);

            setLoading(false);
            setResult(friends);
        }
    }

    const handleAddFriend = async (userUuid: string, idx: number) => {
        
        let res = await addOrRemoveFriend(userUuid);

        //console.log(res);

        if(res.isPending == true && res.isFriend == false) {
            let friends = result;
            
            friends = friends.map((friend, index) => {
                if(idx == index) {
                    friend.isFriend = false;
                    friend.isPending = true;
                }

                return friend;
            });

            setResult([...friends]);
        } else if(res.isPending == false && res.isFriend == true) {
            let friends = result;
            
            friends = friends.map((friend, index) => {
                if(idx == index) {
                    friend.isFriend = true;
                    friend.isPending = false;
                }

                return friend;
            });

            setResult([...friends]);
            updateFriendList(res, "add");
        } else {
            let friends = result;
            
            friends = friends.map((friend, index) => {
                if(idx == index) {
                    friend.isFriend = false;
                    friend.isPending = false;
                }

                return friend;
            });

            setResult([...friends]);
            updateFriendList(res, "del");
        }
    }

    useEffect(() => {
        //console.log(result);
    }, [result]);

    return (
        <Modal
            show={menuCtx.showAddFriendModal}
            closeFn={() => menuCtx.setShowAddFriendModal(false)}
            dismissible={true}
            className="relative"
        >
            <ModalHeader closeFn={() => menuCtx.setShowAddFriendModal(false)}>
                <Paragraph className="text-xl">Adicionar Amigo</Paragraph>
            </ModalHeader>

            <div className="relative p-4 flex flex-col">

                <Label
                    content="Nome:"
                    htmlfor="searchName"
                    className="mb-1"
                />
                <TextInput
                    value={searchName}
                    setValue={setSearchName}
                    name="searchName"
                    className="mb-2"
                />

                <div className={`relative bg-gray-50 border border-solid border-gray-600/40 rounded-lg flex flex-row flex-wrap max-w-full gap-2 items-start justify-evenly mb-2
                    ${(result.length > 0) ? "p-1.5" : "border-none"}
                `}>

                    {(loading == false) && result.map((friend, idx) => {
                        return <SearchFriend key={idx} idx={idx} friend={friend} addFriend={handleAddFriend} />
                    })}

                    {(loading == true) &&
                        <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center">
                            <Spinner className="fill-blue-600 w-6 h-auto" />
                        </div>
                    }

                </div>

                <Button
                    onClick={handleSearchBtn}
                    className="!py-2"
                >
                    Procurar
                </Button>

            </div>
        </Modal>
    );
}

export default AddFriendModal;