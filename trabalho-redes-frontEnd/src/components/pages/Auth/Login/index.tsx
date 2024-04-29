import Button from "@/components/Atoms/Button";
import Label from "@/components/Atoms/Label";
import TextInput from "@/components/Atoms/TextInput";
import LoadingStatus from "@/components/Molecules/LoadingStatus";
import { UserContext } from "@/contexts/UserContext";
import { checkInputErrors } from "@/helpers/inputValidation";
import { InputErrorType } from "@/types/Form";
import { User } from "@/types/User";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useContext, useRef, useState } from "react";
import styled from "styled-components";

const StyledLoginForm = styled.form({
    //width: "",
    position: "relative",
    padding: "1.25rem 1.5rem",
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

    const [showLoadingStatus, setShowLoadingStatus] = useState<boolean>(false);
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("");


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

        if (email != "" && password != "") {
            //formRef.current!.submit();

            try {
                setLoadingStatus(true);
                setShowLoadingStatus(true);
                const req = await axios.post("/api/auth/login", {
                    email: email,
                    password: password,
                }, { validateStatus: () => true });

                const res: { status: number, user: User, token: string, errors?: InputErrorType[] } = req.data;

                if (res.status != 200) {
                    let msgAllIndex = res.errors!.findIndex(err => err.target == "all");

                    if(msgAllIndex != -1) {
                        setErrorMsg(res.errors![msgAllIndex].msg);
                    }

                    setLoadingStatus(false);
                    setHasError(true);

                    checkInputErrors([emailRef, passwordRef], defaultPlaceholders, res.errors!);
                    return;
                }

                if (res.status == 200) {
                    
                    //console.log(userCtx);
                    userCtx.setToken(res.token);
                    userCtx.setUser(res.user);

                    setTimeout(() => {
                        router.push("/");
                    }, 600);
                }
            }
            catch (err) {
                console.error(err);
            }

            return;
        }

        let errors: InputErrorType[] = [];

        if (email == "") {
            errors.push({ target: "email", msg: "Email não preenchido!" });
        }

        if (password == "") {
            errors.push({ target: "password", msg: "Senha não preenchida!" });
        }

        checkInputErrors([emailRef, passwordRef], defaultPlaceholders, errors);
    }

    //useEffect(() => {
    //    
    //}, [formState])

    return (
        <div className="flex w-full h-screen justify-center items-center">
            <StyledLoginForm
                className="max-w-xs shadow-2xl sm:max-w-md"
                //action={form}
                ref={formRef}
                //aria-disabled={formStatus.pending}
                onSubmit={validateInputs}
            >
                {(showLoadingStatus == true) &&
                    <LoadingStatus setShow={setShowLoadingStatus} loading={loadingStatus} error={hasError} setError={setHasError} msg={errorMsg} />
                }
                

                <Label htmlfor="email" content="Email:" />
                <TextInput inputRef={emailRef} type="email" className="mb-2" name="email" value={email} setValue={setEmail} />

                <Label htmlfor="password" content="Senha:" />
                <TextInput inputRef={passwordRef} type="password" className="mb-2" name="password" value={password} setValue={setPassword} />

                <Button
                    className="w-full mb-2"
                    onClick={() => { }}
                >
                    Login
                </Button>

                <div className="">
                    Não possui uma conta? Faça seu <Link className="text-blue-600 hover:text-blue-700 hover:underline" href="/register">Registro</Link>
                </div>
            </StyledLoginForm>
        </div>
    );
}

export default Login;