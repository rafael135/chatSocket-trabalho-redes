
import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";

export interface GroupInstance extends Model {
    uuId: string;
    name: string;
    groupAdmins: string;
    createdAt: string;
    updatedAt: string;
}

export const Group = sequelize.define<GroupInstance>("Group", {
    uuId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(120),
        allowNull: false
    },
    groupAdmins: {
        type: DataTypes.TEXT("tiny"),
        allowNull: false,
        defaultValue: ""
    }
});