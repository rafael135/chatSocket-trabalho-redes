import { MenuContext } from "@/contexts/MenuContext";
import { Modal } from "flowbite-react";
import { ChangeEvent, MutableRefObject, useContext } from "react";



type props = {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    fileInputRef: MutableRefObject<HTMLInputElement | null>;
}

const FileInputModal = ({ files, setFiles, fileInputRef }: props) => {

    const menuCtx = useContext(MenuContext)!;

    const handleLabelDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    }

    const handleLabelDrop = (e: React.DragEvent) => {
        e.preventDefault();

        if(fileInputRef == null) {
            return;
        }

        setFiles(Array.from(e.dataTransfer.files));
        menuCtx.setShowFileInput(false);
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if(fileInputRef == null) {
            return;
        }

        setFiles(Array.from(e.target.files!));
        menuCtx.setShowFileInput(false);
    }

    return (
        <Modal show={(menuCtx.showFileInput == true)} onClose={() => { menuCtx.setShowFileInput(false); }} >
            <Modal.Header>

            </Modal.Header>

            <Modal.Body>
                <label
                    className="w-full h-24 flex justify-center items-center border border-solid border-gray-500/40 rounded-lg hover:bg-black/10"
                    htmlFor="files"
                    onDragOver={handleLabelDragOver}
                    onDrop={handleLabelDrop}
                >
                    {(files.length == 0) &&
                        <h2 className="text-2xl">Solte a(s) imagen(s) aqui</h2>
                    }

                    {(files.length > 0) &&
                        files.map((file, idx) => {
                            return <div key={idx}></div>
                        })
                    }
                </label>
                <input
                    id="files"
                    type="file"
                    onChange={handleInputChange}
                    multiple={true}
                    hidden={true}
                    ref={fileInputRef}
                />
            </Modal.Body>
        </Modal>
    )
}

export default FileInputModal;