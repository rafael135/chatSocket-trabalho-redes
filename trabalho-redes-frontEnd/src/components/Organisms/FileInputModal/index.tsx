import { Modal } from "flowbite-react";
import { MutableRefObject } from "react";



type props = {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    fileInputRef: MutableRefObject<HTMLInputElement | null>;
}

const FileInputModal = ({ show, setShow, files, setFiles, fileInputRef }: props) => {

    const handleLabelDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    }

    const handleLabelDrop = (e: React.DragEvent) => {
        e.preventDefault();

        if(fileInputRef == null) {
            return;
        }

        setFiles(Array.from(e.dataTransfer.files));
        setShow(false);
    }

    return (
        <Modal show={(show == true)} onClose={() => { setShow(false); }} >
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
                    multiple={true}
                    hidden={true}
                    ref={fileInputRef}
                />
            </Modal.Body>
        </Modal>
    )
}

export default FileInputModal;