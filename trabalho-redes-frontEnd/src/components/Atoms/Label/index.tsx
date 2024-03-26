import styled from "styled-components";


const StyledLabel = styled.label({
    color: "rgb(17 24 39)",
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    cursor: "default"
});

type props = {
    content: string;
    htmlfor?: string;
    className?: string;
};

const Label = ({ content, htmlfor, className }: props) => {
    return(
        <StyledLabel htmlFor={htmlfor} className={`${className}`}>
            {content}
        </StyledLabel>
    );
}

export default Label;