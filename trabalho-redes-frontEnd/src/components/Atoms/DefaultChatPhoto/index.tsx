import { BsPersonFill } from "react-icons/bs";


type props = {
    className?: string;
};

const DefaultChatPhoto = ({ className }: props) => {

    return(
        <BsPersonFill className={`w-10 h-auto fill-slate-700 ${className}`} />
    );
}

export default DefaultChatPhoto;