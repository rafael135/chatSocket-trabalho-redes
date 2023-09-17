import { User } from "@/types/User"

type props = {
    user: User;
    loggedUser: User;
}

const UserCard = ({ user, loggedUser }: props) => {
    

    return (
        <div className={`px-2 py-4 border border-solid border-b-gray-400/70 ${(user.ip == loggedUser.ip) ? "text-blue-500" : "text-slate-800"}`}>
            {(user.ip == loggedUser.ip) ? `Você (${user?.name})` : `${user?.name}`}
        </div>
    );
}

export default UserCard;