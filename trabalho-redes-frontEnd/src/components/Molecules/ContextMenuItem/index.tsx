import { MouseEvent, ReactNode } from "react";


type props = {
    children: ReactNode;
    onClick: (e?: MouseEvent<HTMLDivElement>) => void;
};

const ContextMenuItem = ({ children, onClick }: props) => {



    return(
        <div
            className="text-slate-900 cursor-pointer px-2 py-1 transition-all hover:bg-blue-600 hover:text-white"
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export default ContextMenuItem;