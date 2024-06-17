import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";

export interface GroupAdminInstance extends Model {
    uuid: string;
    userUuid: string;
    groupUuid: string;
    createdAt: string;
    updatedAt: string;
};

export const GroupAdmin = sequelize.define<GroupAdminInstance>("GroupAdmin", {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
    },
    userUuid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    groupUuid: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true
});