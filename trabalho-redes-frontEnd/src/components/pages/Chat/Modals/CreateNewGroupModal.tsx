

import Button from "@/components/Atoms/Button";
import Label from "@/components/Atoms/Label";
import TextInput from "@/components/Atoms/TextInput";
import { createNewGroup } from "../../../../lib/actions";
import { Group } from "@/types/Group";
import { User } from "@/types/User";
import { Modal } from "flowbite-react"
import { useContext, useState } from "react";
import Paragraph from "@/components/Atoms/Paragraph";
import { MenuContext } from "@/contexts/MenuContext";
import { UserContext } from "@/contexts/UserContext";


type props = {
    //createNewGroup: (groupName: string, userUuid: string) => Promise<Group | null>;
    addGroup: (group: Group) => void;
};

const CreateNewGroupModal = ({ addGroup }: props) => {

    const userCtx = useContext(UserContext)!;
    const menuCtx = useContext(MenuContext)!;

    const [groupName, setGroupName] = useState<string>("");

    const handleCreateGroupBtn = async () => {
        let res = await createNewGroup(groupName, userCtx.user!.uuid);

        if(res != null) {
            addGroup(res);
            menuCtx.setShowCreateGroupModal(false);
        }
    }

    return(
        <Modal
            show={menuCtx.showCreateGroupModal}
            onClose={() => menuCtx.setShowCreateGroupModal(false)}
        >
            <Modal.Header >
                <Paragraph className="text-xl">Criar Grupo</Paragraph>
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