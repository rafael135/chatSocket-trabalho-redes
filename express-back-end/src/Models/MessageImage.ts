import { DataTypes, Model } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";

export interface MessageImageInstance extends Model {
    uuid: string;
    nextImageUuid: string | null;
    path: string;
    createdAt: string;
    updatedAt: string;
}

export const MessageImage = sequelize.define<MessageImageInstance>("MessageImage", {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    nextImageUuid: {
        type: DataTypes.UUID,
        allowNull: true
    },
    path: {
        type: DataTypes.STRING(255),
        allowNull: false
    }

}, {
    timestamps: true,
});