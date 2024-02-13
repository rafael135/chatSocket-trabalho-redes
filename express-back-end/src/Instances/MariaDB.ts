import { Sequelize } from "sequelize";

export const mariaDb = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PWD as string,
    {
        dialect: "mariadb",
        host: process.env.DB_HOST as string,
        port: Number.parseInt(process.env.DB_PORT as string)
    }
);