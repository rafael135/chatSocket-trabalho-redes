import { ReactNode } from "react";

type props = {
    className?: string;
    contentEditable?: boolean;
    title?: string;
    children: string | ReactNode;
};

const Paragraph = ({ className, contentEditable, title, children }: props) => {

    return(
        <p
            title={title}
            className={`${className}`}
            suppressContentEditableWarning={true}
            contentEditable={contentEditable}
        >
            {children}
        </p>
    );
}

export default Paragraph;