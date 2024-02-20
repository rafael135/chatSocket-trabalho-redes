import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";
import { UserInstance } from "./User";

export interface GroupMessageInstance extends Model {
    uuId: string;
    fromUserUuId: string;
    user: UserInstance;
    toGroupUuId: string;
    body: string;
    createdAt: string;
    updatedAt: string;
}

export const GroupMessage = sequelize.define<GroupMessageInstance>("GroupMessage", {
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
    toGroupUuId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
        defaultValue: ""
    }
});