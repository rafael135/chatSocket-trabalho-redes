import { ReactNode, useLayoutEffect } from "react";



type props = {
    x: number;
    y: number;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    closeOnClick?: boolean;
    children: ReactNode;
};

const ContextMenu = ({ x, y, show, setShow, closeOnClick, children }: props) => {

    return(
        <div
            className="absolute z-20 py-1 border border-solid bg-white border-gray-600/40 shadow"
            style={{ top: `${y}px`, left: `${x}px` }}
        >
            {children}
        </div>
    );
}

export default ContextMenu;