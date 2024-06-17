import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";
import { UserInstance } from "./User";


export interface UserRelationInstance extends Model {
    uuid: string;
    user?: UserInstance;
    fromUserUuid: string;
    toUserUuid: string;
    createdAt: string;
    updatedAt: string;
}

export const UserRelation = sequelize.define<UserRelationInstance>("UserRelation", {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    fromUserUuid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    toUserUuid: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true
});