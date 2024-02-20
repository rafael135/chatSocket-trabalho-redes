import { InputErrorType } from "@/types/Form";
import { RefObject } from "react";

const showError = (inputRef: RefObject<HTMLInputElement>, defaultPlaceholder: string, msg: string) => {
    inputRef.current!.placeholder = msg;
    inputRef.current!.classList.add("errored");
    inputRef.current!.value = "";

    const errorEvent = () => {
        inputRef.current!.placeholder = defaultPlaceholder;
        inputRef.current!.classList.remove("errored");
        

        inputRef.current!.removeEventListener("click", errorEvent);
    }

    inputRef.current!.addEventListener("click", errorEvent);
}

export const checkInputErrors = (inputsRefs: RefObject<HTMLInputElement>[], defaultPlaceholders: string[], errors: InputErrorType[]) => {
    let errorsLength = errors.length;
    let resolvedErrors = 0;

    inputsRefs.forEach((input, idx) => {
        errors.forEach((error) => {
            if(error.target == input.current!.id) {
                resolvedErrors++;
                showError(input, defaultPlaceholders[idx], error.msg);
            }
        });
    });

    if(resolvedErrors == errorsLength) {
        return;
    }

    
}