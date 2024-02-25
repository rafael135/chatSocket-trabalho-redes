

import Button from "@/components/Atoms/Button";
import Label from "@/components/Atoms/Label";
import TextInput from "@/components/Atoms/TextInput";
import { createNewGroup } from "../../../lib/actions";
import { Group } from "@/types/Group";
import { User } from "@/types/User";
import { Modal } from "flowbite-react"
import { useState } from "react";


type props = {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    //createNewGroup: (groupName: string, userUuId: string) => Promise<Group | null>;
    addGroup: (group: Group) => void;
    loggedUser: User;
};

const CreateNewGroupModal = ({ show, setShow, addGroup, loggedUser }: props) => {

    const [groupName, setGroupName] = useState<string>("");

    const handleCreateGroupBtn = async () => {
        console.log("dasdadsadasdadsa");

        let res = await createNewGroup(groupName, loggedUser.uuId);

        console.log(res);

        if(res != null) {
            addGroup(res);
            setShow(false);
        }
    }

    return(
        <Modal
            show={show}
            onClose={() => setShow(false)}
        >
            <Modal.Header >

            </Modal.Header>

            <Modal.Body>
                <Label content="Nome do grupo:" htmlfor="groupName" />
                <TextInput
                    name="groupName"
                    value={groupName}
                    setValue={setGroupName}
                    type="text"
                />

                <Button
                    className="mt-2"
                    onClick={handleCreateGroupBtn}
                >
                    Criar grupo
                </Button>
            </Modal.Body>
        </Modal>
    );
}

export default CreateNewGroupModal;