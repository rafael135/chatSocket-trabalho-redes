import { ReactNode } from "react";

type props = {
    className?: string;
    contentEditable?: boolean;
    children: string | ReactNode;
};

const Paragraph = ({ className, contentEditable, children }: props) => {

    return(
        <p
            className={`${className}`}
            suppressContentEditableWarning={true}
            contentEditable={contentEditable}
        >
            {children}
        </p>
    );
}

export default Paragraph;