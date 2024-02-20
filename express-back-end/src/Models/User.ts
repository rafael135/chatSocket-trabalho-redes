import { Model, DataTypes } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";

export interface UserInstance extends Model {
    id: number | undefined;
    uuId: string;
    avatarSrc?: string;
    name: string;
    email: string;
    password: string | undefined;
    createdAt: string;
    updatedAt: string;
}

export const User = sequelize.define<UserInstance>("User", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    uuId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(90),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(140),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    }

    
});