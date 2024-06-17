import { SetStateAction } from "react";
import { BsFileArrowUpFill, BsX } from "react-icons/bs";

type props = {
    file: File;
    files: File[];
    setFiles: React.Dispatch<SetStateAction<File[]>>;
    fileIndex: number;
}

const AnnexedFile = ({ file, fileIndex, files, setFiles }: props) => {

    const handleRemoveFileBtn = (idx: number) => {
        setFiles(files.filter((f, index) => {
            if(index != idx) {
                return f;
            }
        }));
    }

    return (
        <div className="max-w-[256px] flex gap-1 items-center">
            <BsFileArrowUpFill
                className="fill-blue-500 w-12 h-12" 
            />

            <p className="truncate">{file.name}</p>

            <BsX
                className="w-6 h-6 fill-red-600 bg-transparent transition-all ease-in-out duration-150 cursor-pointer hover:fill-red-700 hover:bg-black/10 active:bg-black/20"
                onClick={() => { handleRemoveFileBtn(fileIndex); }}
            />
        </div>
    );
}

export default AnnexedFile;