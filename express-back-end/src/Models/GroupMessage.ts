import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";
import { UserInstance } from "./User";

export interface GroupMessageInstance extends Model {
    uuid: string;
    fromUserUuid: string;
    user: UserInstance;
    toGroupUuid: string;
    body: string;
    createdAt: string;
    updatedAt: string;
}

export const GroupMessage = sequelize.define<GroupMessageInstance>("GroupMessage", {
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
    toGroupUuid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
        defaultValue: ""
    }
});