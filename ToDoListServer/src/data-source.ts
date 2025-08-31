import "reflect-metadata"
import { DataSource } from "typeorm"
import { ToDoItem } from "./entity/ToDoItem"
import * as dotenv from "dotenv"

dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [ToDoItem],
    migrations: ["src/migration/**/*.ts"],
    synchronize: true,
    logging: true,
})
