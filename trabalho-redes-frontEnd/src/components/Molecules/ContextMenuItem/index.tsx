import { MouseEvent, ReactNode } from "react";


type props = {
    children: ReactNode;
    onClick: (e: MouseEvent<HTMLDivElement>) => void;
};

const ContextMenuItem = ({ children, onClick }: props) => {



    return(
        <div
            className="text-slate-900 transition-all hover:bg-blue-600"
            onClick={(e) => onClick(e)}
        >
            {children}
        </div>
    );
}

export default ContextMenuItem;