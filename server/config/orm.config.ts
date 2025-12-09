import { DataSourceOptions } from "typeorm";
import { ENTITIES } from "@/server/entities/entities-main";
import "dotenv/config"; 

export const dbOptions: DataSourceOptions = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306, 
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ENTITIES,
  charset: "utf8mb4",
  timezone: "+07:00",
};