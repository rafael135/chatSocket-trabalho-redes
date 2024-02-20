import React, { HTMLInputTypeAttribute, MutableRefObject } from "react";
import styled from "styled-components";

const StyledInput = styled.input({
    display: "block",
    color: "rgb(17 24 39)",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    padding: "0.625rem",
    backgroundColor: "rgb(249 250 251)",
    border: "solid 1px rgb(209 213 219)",
    borderRadius: "0.5rem",
    width: "100%",
    ":hover": {
        border: "1px solid #1C64F2"
    }
});

type props = {
    className?: string;
    type?: HTMLInputTypeAttribute;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    name: string;
    inputRef?: MutableRefObject<HTMLInputElement | null>;
    required?: boolean;
};

const TextInput = ({ className, type, value, setValue, name, inputRef, required }: props) => {

    return(
        <StyledInput
            name={name}
            id={name}
            type={type || "text"}
            value={value}
            onChange={(e) => { setValue(e.target!.value); }}
            className={`${className}`}
            ref={inputRef}
            required={required}
        />
    );
}

export default TextInput;