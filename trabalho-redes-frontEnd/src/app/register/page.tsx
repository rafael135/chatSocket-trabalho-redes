"use client"

import Button from "@/components/Atoms/Button";
import Label from "@/components/Atoms/Label";
import TextInput from "@/components/Atoms/TextInput";
import { registerAuthenticate } from "@/lib/actions";
import { ReactNode, useState } from "react";
import styled from "styled-components";

const StyledRegisterForm = styled.form({
    width: "",
    padding: "1.5rem",
    overflow: "auto",
    flex: "1 1 0%",
    backgroundColor: "#FFF",
    borderRadius: "0.5rem",
    border: "1px solid rgba(75, 85, 99, 0.4)"
});

const Register = () => {

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    return(
        <div className="flex w-full h-screen justify-center items-center">
            <StyledRegisterForm
                className="max-w-xs sm:max-w-md"
                action={registerAuthenticate}
            >
                <Label htmlfor="name" content="Nome:" />
                <TextInput className="mb-2" name="name" value={name} setValue={setName} />

                <Label htmlfor="email" content="Email:" />
                <TextInput type="email" className="mb-2" name="email" value={email} setValue={setEmail} />

                <Label htmlfor="password" content="Senha:" />
                <TextInput type="password" className="mb-2" name="password" value={password} setValue={setPassword} />
                
                <Label htmlfor="confirmPassword" content="Repita a senha:" />
                <TextInput type="password" className="mb-2" name="confirmPassword" value={confirmPassword} setValue={setConfirmPassword} />

                <Button
                    className="w-full"
                    onClick={() => {  }}
                >
                    Registrar-se
                </Button>
            </StyledRegisterForm>
        </div>
    );
}

export default Register;