import { ReactNode } from "react";

type props = {
    className?: string;
    contentEditable?: boolean;
    title?: string;
    onClick?: (e: React.MouseEvent) => void | Promise<void>
    children: string | ReactNode;
};

const Paragraph = ({ className, contentEditable, title, onClick, children }: props) => {

    return(
        <p
            title={title}
            className={`${className}`}
            onClick={onClick}
            suppressContentEditableWarning={true}
            contentEditable={contentEditable}
        >
            {children}
        </p>
    );
}

export default Paragraph;