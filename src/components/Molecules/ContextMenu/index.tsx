"use client"

import { ReactNode, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MenuContext } from "@/contexts/MenuContext";



type props = {
    closeOnClick?: boolean;
    children: ReactNode;
};

const ContextMenu = ({ closeOnClick, children }: props) => {

    const menuCtx = useContext(MenuContext)!;

    //const [position, setPosition] = useState<{ x: number; y: number; }>({ x: x, y: y });

    const contextMenuRef = useRef<HTMLDivElement>(null);
    //const [showContext, setShowContext] = useState<boolean>(false);

    useEffect(() => {
        if(typeof window != "undefined") {
            if((contextMenuRef.current!.clientWidth + menuCtx.contextMenuPositionX + 4) > window.innerWidth) {
                menuCtx.setContextMenuPositionX(menuCtx.contextMenuPositionX - ((window.innerWidth - menuCtx.contextMenuPositionX) + 4));
            }

            if((contextMenuRef.current!.clientHeight + menuCtx.contextMenuPositionY + 4) > window.innerHeight) {
                menuCtx.setContextMenuPositionY(menuCtx.contextMenuPositionY - ((window.innerHeight - menuCtx.contextMenuPositionY) + 4));
            }
        }
    }, [menuCtx.contextMenuPositionX, menuCtx.contextMenuPositionY]);

    return(
        <motion.div
            className="absolute z-20 py-1 border border-solid bg-white border-gray-600/40 shadow"
            style={{ top: `${menuCtx.contextMenuPositionY}px`, left: `${menuCtx.contextMenuPositionX}px` }}
            ref={contextMenuRef}
            initial={{ scale: 0.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.125 }}
            exit={{ scale: 0.1 }}
        >
            {children}
        </motion.div>
    );
}

export default ContextMenu;