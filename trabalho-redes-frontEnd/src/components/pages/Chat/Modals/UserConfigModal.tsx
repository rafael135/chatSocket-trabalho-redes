import Paragraph from "@/components/Atoms/Paragraph";
import ChangeAvatarModal from "./ChangeAvatarModal";
import Modal from "@/components/Organisms/Modal";
import ModalHeader from "@/components/Organisms/Modal/ModalHeader";
import { User } from "@/types/User";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { BsImage, BsPersonFill } from "react-icons/bs";
import { MdCheck, MdEdit } from "react-icons/md";
import LabelInput from "@/components/Atoms/LabelInput";
import LoadingStatus from "@/components/Molecules/LoadingStatus";
import { userChangeName } from "@/lib/actions";
import { UserContext } from "@/contexts/UserContext";



type props = {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    loggedUser: User;
}

const UserConfigModal = ({ show, setShow, loggedUser }: props) => {

    const userCtx = useContext(UserContext)!;

    const [editingUserName, setEditingUserName] = useState<boolean>(false);
    const userNameInputRef = useRef<HTMLInputElement | null>(null);
    const [userName, setUserName] = useState<string>(loggedUser.name);

    const [showLoading, setShowLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [loadingMsg, setLoadingMsg] = useState<string>("");

    const [showChangeAvatarModal, setShowChangeAvatarModal] = useState<boolean>(false);

    const handleEditUserNameBtn = () => {
        setEditingUserName(true);
        userNameInputRef.current!.focus();
    }

    const handleChangeNameBtn = async () => {
        setEditingUserName(false);

        if(userName == userCtx.user!.name) {
            return;
        }

        setShowLoading(true);
        setLoading(true);

        let res = await userChangeName(userName);

        if(res == true) {
            setLoadingMsg("Nome alterado com sucesso!");
            userCtx.setUser({...userCtx.user!, name: userName});
        } else {
            setLoadingMsg("Erro ao tentar alterar o nome!");
            setError(true);

            setUserName(userCtx.user!.name);
        }

        setLoading(false);
    }

    const handleUserNameInputKeyDown = (e: React.KeyboardEvent) => {
        if(e.key == "Enter") {
            e.preventDefault();
            handleChangeNameBtn();
        }
    }

    useEffect(() => {
        
    }, [loading]);

    return(
        <>
            <Modal
                show={show}
                closeFn={() => setShow(false)}
                dismissible={true}
                className="relative"
            >
                <ModalHeader closeFn={() => setShow(false)}>
                    <Paragraph className="text-xl">Configurações de Usuário</Paragraph>
                </ModalHeader>

                {(showLoading == true) &&
                    <LoadingStatus setShow={setShowLoading} loading={loading} error={error} setError={setError} msg={loadingMsg} />
                }

                <div className="px-2 py-3">
                    <div className="flex flex-row gap-1">
                        <div
                            className="relative w-[60px] h-[60px] rounded-full border border-solid border-gray-600/40 overflow-hidden group"
                            onClick={() => setShowChangeAvatarModal(!showChangeAvatarModal)}
                        >
                            {(loggedUser.avatarSrc != null) &&
                                <Image
                                    loading="lazy"
                                    fill={true}
                                    quality={100}
                                    src={`/${loggedUser.avatarSrc}`}
                                    alt="Avatar"
                                    className="rounded-full"
                                />
                            }

                            <div
                                className="z-20 hidden top-0 bottom-0 left-0 right-0 justify-center items-center cursor-pointer bg-black/20 rounded-full group-hover:flex group-hover:absolute"
                            >
                                <BsImage className="w-8 h-auto fill-white" />
                            </div>

                            {(loggedUser.avatarSrc == null) &&
                                <div className="absolute z-10 top-0 bottom-0 left-0 right-0 flex justify-center items-center cursor-pointer rounded-full hover:bg-black/10">
                                    <BsPersonFill className="w-12 h-auto fill-slate-700" />
                                </div>
                            }
                            
                        </div>
                        
                        <div className="flex flex-col">
                            <div className="flex flex-row gap-1">
                                <LabelInput
                                    className={`text-xl`}
                                    value={userName}
                                    setValue={setUserName}
                                    readOnly={(editingUserName == false) ? true : false}
                                    onKeyDown={handleUserNameInputKeyDown}
                                    inputRef={userNameInputRef}
                                />
                                {(editingUserName == true) &&
                                    <MdCheck
                                        className="fill-green-600 w-3 h-auto place-self-start cursor-pointer transition-all hover:fill-green-700 hover:scale-110"
                                        onClick={handleChangeNameBtn}
                                        title="Salvar Alterações"
                                    />
                                }

                                {(editingUserName == false) &&
                                    <MdEdit
                                        className="fill-slate-800 w-3 h-auto place-self-start cursor-pointer transition-all hover:fill-slate-900 hover:scale-110"
                                        onClick={handleEditUserNameBtn}
                                        title="Editar"
                                    />
                                }
                            </div>

                            <div className="flex flex-row">
                                <Paragraph
                                    className=""
                                >
                                    {loggedUser.email}
                                </Paragraph>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </Modal>

            {(showChangeAvatarModal == true) &&
                <ChangeAvatarModal show={showChangeAvatarModal} setShow={setShowChangeAvatarModal} loggedUser={loggedUser} />
            }
        </>
    );
}

export default UserConfigModal;