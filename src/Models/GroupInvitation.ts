import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";


export interface GroupInvitationInstance extends Model {
    uuid: string;
    groupUuid: string;
    userUuid: string;
    createdAt: string;
    updatedAt: string;
}

export const GroupInvitation = sequelize.define<GroupInvitationInstance>("GroupInvitation", {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    groupUuid: {
        type: DataTypes.UUID,
        allowNull: false
    },
    userUuid: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: "groupInvitations"
});