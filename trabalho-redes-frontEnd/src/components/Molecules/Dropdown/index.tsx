import { ReactNode, useEffect, useRef, useState } from "react";



type props = {
    className?: string;
    children: ReactNode;
    icon?: ReactNode;
    label: string;
};

const Dropdown = ({ className, children, icon, label }: props) => {

    const btnRef = useRef<HTMLButtonElement | null>(null);
    const divRef = useRef(null);

    const [expand, setExpand] = useState<boolean>(false);


    useEffect(() => {
        
    }, [expand]);

    return(
        <>
            <button
                onClick={() => setExpand(!expand)}
                ref={btnRef}
                className={`flex justify-center items-center ${className}`}
            >

            </button>

            <div
                ref={divRef}
                className={`${(expand == true) ? "flex" : "hidden"} flex-col py-1`}
                style={{
                    
                }}
            >
                {children}
            </div>

        </>
    );
}

export default Dropdown;