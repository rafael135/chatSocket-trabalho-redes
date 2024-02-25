import { ReactNode } from "react";

type props = {
    className?: string;
    children: string | ReactNode;
};

const Paragraph = ({ className, children }: props) => {

    return(
        <p className={`${className}`}>
            {children}
        </p>
    );
}

export default Paragraph;