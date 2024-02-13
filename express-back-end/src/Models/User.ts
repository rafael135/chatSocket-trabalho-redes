import { Model, DataTypes } from "sequelize";
import { mariaDb as sequelize } from "../Instances/MariaDB";

export interface UserInstance extends Model {
    id: number,
    privateRoom: string | null;
    name: string;
    email: string;
    password: string;
}

export const User = sequelize.define<UserInstance>("User", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    privateRoom: {
        type: DataTypes.STRING,
        defaultValue: null,
        unique: true
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
    }

    
});