import { Model, DataTypes } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";

export interface UserInstance extends Model {
    id: number | undefined;
    uuid: string;
    name: string;
    nickName: string;
    email: string;
    password: string | undefined;
    avatarSrc?: string;
    createdAt: string;
    updatedAt: string;
}

export const User = sequelize.define<UserInstance>("User", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(90),
        allowNull: false
    },
    nickName: {
        type: DataTypes.STRING(120),
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
    },
    avatarSrc: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    }

    
}, {
    timestamps: true
});