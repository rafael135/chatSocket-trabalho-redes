import dotenv from "dotenv";
import path from "path";
import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";

dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV?.replaceAll(' ', '')}`) });

export const mariaDb = new Sequelize(
    process.env.DB_NAME as string | undefined ?? "chatWs",
    process.env.DB_USER as string | undefined ?? "root",
    process.env.DB_PWD as string | undefined ?? "3541",
    {
        dialect: process.env.DB_DIALECT as Dialect | undefined ?? "mysql",
        host: process.env.DB_HOST as string | undefined ?? "localhost",
        port: Number.parseInt(process.env.DB_PORT as string | undefined ?? "5306"),
        models: [`${__dirname}/Models/**/*.model.ts`],
        pool: {
            min: 0,
            max: 10
        }
    }
);