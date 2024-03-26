import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";
import { UserInstance } from "./User";


export interface UserMessageInstance extends Model {
    uuid: string;
    fromUserUuid: string;
    user?: UserInstance;
    toUserUuid: string;
    body: string;
    createdAt: string;
    updatedAt: string;
}

export const UserMessage = sequelize.define<UserMessageInstance>("UserMessage", {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    fromUserUuid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    toUserUuid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
        defaultValue: ""
    }
})