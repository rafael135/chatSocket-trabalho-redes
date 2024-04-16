"use client"

import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";



type props = {
    x: number;
    y: number;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    closeOnClick?: boolean;
    children: ReactNode;
};

const ContextMenu = ({ x, y, show, setShow, closeOnClick, children }: props) => {

    //const [position, setPosition] = useState<{ x: number; y: number; }>({ x: x, y: y });

    const [positionX, setPositionX] = useState<number>(x);
    const [positionY, setPositionY] = useState<number>(y);

    const contextMenuRef = useRef<HTMLDivElement>(null);
    //const [showContext, setShowContext] = useState<boolean>(false);

    useEffect(() => {
        if(typeof window != "undefined") {
            if((contextMenuRef.current!.clientWidth + positionX + 4) > window.innerWidth) {
                setPositionX(positionX - ((window.innerWidth - positionX) + 4));
            }

            if((contextMenuRef.current!.clientHeight + positionY + 4) > window.innerHeight) {
                setPositionY(positionY - ((window.innerHeight - positionY) + 4));
            }

            
        }
    }, [positionX, positionY]);

    return(
        <div
            className="absolute z-20 py-1 border border-solid bg-white border-gray-600/40 shadow"
            style={{ top: `${positionY}px`, left: `${positionX}px` }}
            ref={contextMenuRef}
        >
            {children}
        </div>
    );
}

export default ContextMenu;