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

const markToClean = (inputRef: RefObject<HTMLInputElement>, defaultPlaceholder: string) => {
    inputRef.current!.placeholder = defaultPlaceholder;
    
    const cleanEvent = () => {
        inputRef.current!.value = "";

        inputRef.current!.removeEventListener("click", cleanEvent);
    }

    inputRef.current!.addEventListener("click", cleanEvent);
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

            /* if(error.target == "all") {

            } */
        });
    });

    if(resolvedErrors == errorsLength) {
        return;
    }

    
}