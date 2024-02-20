import { Model, DataTypes } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";

export interface GroupRelationInstance extends Model {
    uuId: string;
    groupUuId: string;
    userUuId: string;
    createdAt: string;
    updatedAt: string;
}

export const GroupRelation = sequelize.define("GroupRelation", {
    uuId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    groupUuId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    userUuId: {
        type: DataTypes.UUID,
        allowNull: false
    }
});