import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

export const mariaDb = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PWD as string,
    {
        dialect: "mysql",
        host: process.env.DB_HOST as string,
        port: Number.parseInt(process.env.DB_PORT as string)
    }
);