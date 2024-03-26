import Paragraph from "@/components/Atoms/Paragraph";
import Modal from "@/components/Organisms/Modal";
import ModalHeader from "@/components/Organisms/Modal/ModalHeader";
import { UserContext } from "@/contexts/UserContext";
import { User } from "@/types/User";
import { useContext, useEffect, useRef, useState } from "react";




type props = {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    loggedUser: User;
}

const ChangeAvatarModal = ({ show, setShow, loggedUser }: props) => {

    const userCtx = useContext(UserContext)!;

    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    const handleLabelDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    }

    const handleLabelDrop = (e: React.DragEvent) => {
        e.preventDefault();

        if (fileInputRef == null) {
            return;
        }

        setFiles(Array.from(e.dataTransfer.files));
        setShow(false);
    }

    const handleSubmitForm = async () => {
        if (files.length > 0) {
            let form = new FormData(formRef.current!);
            form.append("userUuid", loggedUser.uuid);


            type ChangeAvatarResponse = {
                avatarPath?: string;
                status: number;
            };

            let req = await fetch(formRef.current!.action, {
                method: "POST",
                body: form,
                headers: {
                    "Accept": "application/json"
                }
            });

            let res: ChangeAvatarResponse = await req.json();

            if(res.status == 200) {
                userCtx.setUser({...userCtx.user!, avatarSrc: res.avatarPath});
            }
        }
    }

    useEffect(() => {
        handleSubmitForm();
    }, [files]);

    return(
        <Modal show={show} closeFn={() => setShow(false)} className="z-30">
            <ModalHeader closeFn={() => setShow(false)}>
                <Paragraph className="text-xl">Mudar Avatar</Paragraph>
            </ModalHeader>

            <div
                className="px-2 py-3 z-30"
            >
                <form
                    ref={formRef}
                    method="POST"
                    encType="multipart/form-data"
                    action="/api/user/changeAvatar"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label
                        className="w-full h-24 flex justify-center items-center cursor-pointer border border-dashed border-gray-500/40 rounded-lg hover:bg-black/10"
                        htmlFor="file"
                        onDragOver={handleLabelDragOver}
                        onDrop={handleLabelDrop}
                    >
                        {(files.length == 0) &&
                            <h2 className="text-2xl text-slate-700">Solte a imagem aqui</h2>
                        }

                        {(files.length > 0) &&
                            files.map((file, idx) => {
                                return <div key={idx}></div>
                            })
                        }
                    </label>
                    <input
                        id="file"
                        name="file"
                        type="file"
                        multiple={false}
                        hidden={true}
                        ref={fileInputRef}
                        onChange={(e) => setFiles(Array.from(e.target!.files!) ?? [])}
                    />
                </form>

            </div>
        </Modal>
    )
}

export default ChangeAvatarModal;