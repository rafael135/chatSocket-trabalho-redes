import { ReactNode } from "react";



type props = {
    x: number;
    y: number;
    children: ReactNode;
};

const ContextMenu = ({ x, y, children }: props) => {


    return(
        <div
            className="border border-solid border-gray-600/40 shadow"
            style={{ top: `${x}px`, left: `${y}px` }}
        >
            {children}
        </div>
    );
}

export default ContextMenu;