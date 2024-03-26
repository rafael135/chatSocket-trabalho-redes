import Button from "@/components/Atoms/Button";
import Paragraph from "@/components/Atoms/Paragraph";
import { Spinner } from "flowbite-react";
import { useEffect } from "react";
import { MdCheck, MdError } from "react-icons/md";
import styled from "styled-components";



const StyledLoadingStatus = styled.div({
    backgroundColor: "rgb(255 255 255 / 0.6)",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    justifyContent: "center",
    alignItems: "center",
});

type props = {
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    error: boolean;
    setError: React.Dispatch<React.SetStateAction<boolean>>;
    msg: string;
};

const LoadingStatus = ({ setShow, loading, error, setError, msg }: props) => {


    useEffect(() => {
        if(loading == false) {
            //setTimeout(() => {
            //    setShow(false);
            //}, 4000);
        }
    }, [loading]);

    return (
        <StyledLoadingStatus>
            {(loading == true) &&
                <Spinner className="w-6 h-auto fill-blue-600" />
            }

            {(error == false && loading == false) &&
                <MdCheck className="w-6 h-auto fill-green-600" />
            }
            {(error == true && loading == false) &&
                <MdError className="w-6 h-auto fill-red-600" />
            }

            <Paragraph
                className={`${(error == true) ? "text-red-600" : ""}`}
            >
                {(loading == true) ? "Aguarde..." : msg}
            </Paragraph>

            {(loading == false) &&
                <Button
                    className={`${(error == true) ? "!bg-red-600 hover:!bg-red-700" : "!bg-green-600 hover:!bg-green-700"}`}
                    onClick={() => { setError(false); setShow(false); }}
                >
                    Ok
                </Button>
            }

        </StyledLoadingStatus>
    );
}

export default LoadingStatus;