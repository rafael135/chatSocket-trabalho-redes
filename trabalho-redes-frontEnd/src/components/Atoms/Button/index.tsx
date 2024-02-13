import { MutableRefObject, ReactNode } from "react";
import styled from "styled-components";


const StyledButton = styled.button({
    display: "flex",
    justifyContent: "center",
    color: "#FFF",
    backgroundColor: "rgb(28 100 242)",
    alignItems: "center",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    transition: "all cubic-bezier(0.4, 0, 0.2, 1) 200ms",
    ":hover": {
        backgroundColor: "rgb(26, 86, 219)"
    }
});



type props = {
    className?: string;
    children: string | ReactNode;
    onClick: (() => Promise<void>) | (() => void);
    ref?: MutableRefObject<HTMLButtonElement | null>;
};

const Button = ({ className, children, onClick, ref }: props) => {
    return(
        <StyledButton
            className={`${className}`}
            onClick={onClick}
            ref={ref}
        >
            {children}
        </StyledButton>
    );
}

export default Button;