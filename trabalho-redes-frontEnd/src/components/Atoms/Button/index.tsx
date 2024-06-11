import React, { MutableRefObject, ReactNode } from "react";
import styled from "styled-components";


const StyledButton = styled.button({
    display: "flex",
    justifyContent: "center",
    color: "#FFF",
    backgroundColor: "rgb(28 100 242)",
    alignItems: "center",
    padding: "0.35rem 1rem",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    transition: "all cubic-bezier(0.4, 0, 0.2, 1) 200ms",
    ":hover": {
        backgroundColor: "rgb(26, 86, 219)"
    },
});



type props = {
    className?: string;
    title?: string;
    disabled?: boolean;
    children: string | ReactNode;
    onClick?: ((e: React.MouseEvent<HTMLButtonElement>) => Promise<void>) | ((e: React.MouseEvent<HTMLButtonElement>) => void);
    ref?: MutableRefObject<HTMLButtonElement | null>;
};

const Button = ({ className, title, disabled, children, onClick, ref }: props) => {
    return(
        <StyledButton
            title={title}
            disabled={disabled}
            className={`${className}`}
            onClick={onClick}
            ref={ref}
        >
            {children}
        </StyledButton>
    );
}

export default Button;