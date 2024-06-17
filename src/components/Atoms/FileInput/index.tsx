import { ChangeEvent, DragEvent, MutableRefObject } from "react";
import styled from "styled-components";


const StyledFileLabel = styled.label.attrs(() => ({}))`

`;

const StyledFileInput = styled.input({
    display: "none"
});


type props = {
    className?: string;
    name: string;
    label: string;
    ref?: MutableRefObject<HTMLInputElement | null>;

    onChange: (e: ChangeEvent) => void;
    onDragEnter?: (e: DragEvent) => void;
    onDragLeave?: (e: DragEvent) => void;
};

const FileInput = ({ className, name, label, ref, onChange, onDragEnter, onDragLeave }: props) => {

    <>
        <StyledFileLabel
            htmlFor={name}
            className={`${className}`}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
        >

        </StyledFileLabel>

        <StyledFileInput
            name={name}
            id={name}
            ref={ref}
            type="file"
            accept="image"
            onChange={onChange}
        />
    </>
}

export default FileInput;