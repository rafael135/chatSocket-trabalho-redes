import Paragraph from "@/components/Atoms/Paragraph";
import { User } from "@/types/User";
import Image from "next/image";

type props = {
    user: User;
};

const UserCard = ({ user }: props) => {
    return (
        <div className="flex flex-row items-center gap-1.5">
            <Image
                width={48}
                height={48}
                className="rounded-full bg-gray-300"
                src={user.avatarSrc ?? ""}
                alt="Foto do contato"
                loading="lazy"
            />

            <Paragraph className="">
                {user.name}
            </Paragraph>
        </div>
    );
}

export default UserCard;