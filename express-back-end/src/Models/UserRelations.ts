import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";


export interface UserRelationInstance extends Model {
    uuId: string;
    fromUserUuId: string;
    toUserUuId: string;
    createdAt: string;
    updatedAt: string;
}

export const UserRelation = sequelize.define<UserRelationInstance>("UserRelation", {
    uuId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    fromUserUuId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    toUserUuId: {
        type: DataTypes.UUID,
        allowNull: false
    }
});