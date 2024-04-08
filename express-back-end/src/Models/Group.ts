import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";

export interface GroupInstance extends Model {
    uuid: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export const Group = sequelize.define<GroupInstance>("Group", {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(120),
        allowNull: false
    }
}, {
    timestamps: true
});