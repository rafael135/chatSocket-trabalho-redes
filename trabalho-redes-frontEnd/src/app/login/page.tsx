"use client"

import Button from "@/components/Atoms/Button";
import Label from "@/components/Atoms/Label";
import TextInput from "@/components/Atoms/TextInput";
import { UserContext } from "@/contexts/UserContext";
import { checkInputErrors } from "@/helpers/inputValidation";
import { loginAuthenticate, registerAuthenticate } from "@/lib/actions";
import { InputErrorType } from "@/types/Form";
import { User } from "@/types/User";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import styled from "styled-components";

const StyledLoginForm = styled.form({
    width: "",
    padding: "1.5rem",
    overflow: "auto",
    flex: "1 1 0%",
    backgroundColor: "#FFF",
    borderRadius: "0.5rem",
    border: "1px solid rgba(75, 85, 99, 0.4)"
});

export type LoginStateType = {
    errors: InputErrorType[]
} | null;

const initialState: LoginStateType = {
    errors: []
}

const Login = () => {
    
    const userCtx = useContext(UserContext)!;

    //const formStatus = useFormStatus();
    //const [formState, form] = useFormState<LoginStateType, FormData>(loginAuthenticate, initialState);

    const router = useRouter();

    const defaultPlaceholders = [
        "Email", "Senha"
    ];

    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    const formRef = useRef<HTMLFormElement | null>(null);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const validateInputs = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(email != "" && password != "") {
            //formRef.current!.submit();

            try {
                const req = await axios.post("/api/auth/login", {
                    email: email,
                    password: password,
                });

                const res: { status: number, user: User, token: string, errors?: InputErrorType[] } = req.data;

                if(res.status == 400) {
                    checkInputErrors([emailRef, passwordRef], defaultPlaceholders, res.errors!);
                    return;
                }

                if(res.status == 200) {
                    console.log(userCtx);
                    userCtx.setToken(res.token);
                    userCtx.setUser(res.user);

                    setTimeout(() => {
                        router.push("/");
                    }, 600);
                }
            }
            catch(err) {
                console.error(err);
            }

            

            return;
        }

        let errors: InputErrorType[] = [];

        if(email == "") {
            errors.push({ target: "email", msg: "Email não preenchido!" });
        }

        if(password == "") {
            errors.push({ target: "password", msg: "Senha não preenchida!" });
        }

        checkInputErrors([emailRef, passwordRef], defaultPlaceholders, errors);
    }

    //useEffect(() => {
    //    
    //}, [formState])

    return(
        <div className="flex w-full h-screen justify-center items-center">
            <StyledLoginForm
                className="max-w-xs sm:max-w-md"
                //action={form}
                ref={formRef}
                //aria-disabled={formStatus.pending}
                onSubmit={validateInputs}
            >
                <Label htmlfor="email" content="Email:" />
                <TextInput inputRef={emailRef} type="email" className="mb-2" name="email" value={email} setValue={setEmail} />

                <Label htmlfor="password" content="Senha:" />
                <TextInput inputRef={passwordRef} type="password" className="mb-2" name="password" value={password} setValue={setPassword} />

                <Button
                    className="w-full"
                    onClick={() => {  }}
                >
                    Login
                </Button>
            </StyledLoginForm>
        </div>
    );
}

export default Login;