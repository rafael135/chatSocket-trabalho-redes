import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";
import { UserInstance } from "./User";


export interface UserMessageInstance extends Model {
    uuId: string;
    fromUserUuId: string;
    user: UserInstance;
    toUserUuId: string;
    body: string;
    createdAt: string;
    updatedAt: string;
}

export const UserMessage = sequelize.define<UserMessageInstance>("UserMessage", {
    uuId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fromUserUuId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    toUserUuId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
        defaultValue: ""
    }
})