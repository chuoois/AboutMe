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
  synchronize: process.env.NODE_ENV === "development", // Chỉ auto-sync ở dev
  logging: process.env.NODE_ENV === "development",
  entities: ENTITIES,
  charset: "utf8mb4",
  timezone: "+07:00",
};