import Button from "@/components/Atoms/Button";
import Label from "@/components/Atoms/Label";
import TextInput from "@/components/Atoms/TextInput";
import { UserContext } from "@/contexts/UserContext";
import { checkInputErrors } from "@/helpers/inputValidation";
import { InputErrorType } from "@/types/Form";
import { User } from "@/types/User";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useContext, useRef, useState } from "react";
import styled from "styled-components";

const StyledRegisterForm = styled.form({
    width: "",
    padding: "1.25rem 1.5rem",
    overflow: "auto",
    flex: "1 1 0%",
    backgroundColor: "#FFF",
    borderRadius: "0.5rem",
    border: "1px solid rgba(75, 85, 99, 0.4)",
});

export type RegisterStateType = {
    errors: InputErrorType[]
} | null;

const initialState: RegisterStateType = {
    errors: []
}

const Register = () => {
    const userCtx = useContext(UserContext)!;

    //const formStatus = useFormStatus();
    //const [formState, form] = useFormState<RegisterStateType, FormData>(registerAuthenticate, initialState);

    const [showLoadingStatus, setShowLoadingStatus] = useState<boolean>(false);
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("");

    const router = useRouter();

    const defaultPlaceholders = [
        "Nome", "Email", "Senha", "Repita a senha"
    ];

    const nameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

    const formRef = useRef<HTMLFormElement | null>(null);

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const validateInputs = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(name != "" && email != "" && password != "" && confirmPassword != "") {
            //formRef.current!.submit();

            try {
                setLoadingStatus(true);
                setShowLoadingStatus(true);
                const req = await axios.post("/api/auth/register", {
                    name: name,
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword
                }, { validateStatus: () => true });

                const res: { status: number, user: User, token: string, errors?: InputErrorType[] } = req.data;

                if(res.status != 201) {
                    let msgAllIndex = res.errors!.findIndex(err => err.target == "all");

                    if(msgAllIndex != -1) {
                        setErrorMsg(res.errors![msgAllIndex].msg);
                    }

                    setLoadingStatus(false);
                    setHasError(true);

                    checkInputErrors([nameRef, emailRef, passwordRef, confirmPasswordRef], defaultPlaceholders, res.errors!);
                    return;
                }

                if(res.status == 201) {
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

        if(name == "") {
            errors.push({ target: "name", msg: "Nome não preenchido!" });
        }

        if(email == "") {
            errors.push({ target: "email", msg: "Email não preenchido!" });
        }

        if(password == "") {
            errors.push({ target: "password", msg: "Senha não preenchida!" });
        }

        if(confirmPassword != password) {
            errors.push({ target: "confirmPassword", msg: "Senhas diferentes!" });
        }

        checkInputErrors([nameRef, emailRef, passwordRef, confirmPasswordRef], defaultPlaceholders, errors);
    }

    //useEffect(() => {
    //    
    //}, [formState])

    return(
        <div className="flex w-full h-screen justify-center items-center">
            <StyledRegisterForm
                className="max-w-xs shadow-2xl sm:max-w-md"
                //action={form}
                ref={formRef}
                //aria-disabled={formStatus.pending}
                onSubmit={validateInputs}
            >
                <Label htmlfor="name" content="Nome:" />
                <TextInput inputRef={nameRef} className="mb-2" name="name" value={name} setValue={setName} />

                <Label htmlfor="email" content="Email:" />
                <TextInput inputRef={emailRef} type="email" className="mb-2" name="email" value={email} setValue={setEmail} />

                <Label htmlfor="password" content="Senha:" />
                <TextInput inputRef={passwordRef} type="password" className="mb-2" name="password" value={password} setValue={setPassword} />
                
                <Label htmlfor="confirmPassword" content="Repita a senha:" />
                <TextInput inputRef={confirmPasswordRef} type="password" className="mb-2" name="confirmPassword" value={confirmPassword} setValue={setConfirmPassword} />

                <Button
                    className="w-full mb-2"
                    onClick={() => {  }}
                >
                    Registrar-se
                </Button>

                <div className="">
                    Já possui uma conta? Faça seu <Link className="text-blue-600 hover:text-blue-700 hover:underline" href="/login">Login</Link>
                </div>
            </StyledRegisterForm>
        </div>
    );
}

export default Register;