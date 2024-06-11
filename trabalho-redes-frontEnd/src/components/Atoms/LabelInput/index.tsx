import { MutableRefObject, useEffect, useState } from "react";



type props = {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    className?: string;
    readOnly?: boolean;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    inputRef?: MutableRefObject<HTMLInputElement | null>;
};

const LabelInput = ({ value, setValue, className, readOnly, onKeyDown, inputRef }: props) => {


    const [inputSize, setInputSize] = useState<number>(value.length * 11);

    useEffect(() => {
        setInputSize(value.length * 11);
    }, [value]);

    return(
        <input
            type="text"
            className={`bg-transparent p-0 m-0 border-none focus:border-none focus:ring-0 ${className}`}
            style={{ width: `${inputSize}px`, lineHeight: 1 }}
            value={value}
            onChange={(e) => setValue(e.target!.value)}
            readOnly={readOnly}
            onKeyDown={onKeyDown}
            ref={inputRef}
        />
    );
}

export default LabelInput;