import "reflect-metadata";
import { DataSource } from "typeorm";
import { ENTITIES } from "@/server/entities/entities-main";

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === "development",  
  logging: process.env.NODE_ENV === "development",
  entities: ENTITIES,
  charset: "utf8mb4",
  timezone: "+07:00",
});

let initialized = false;

export const getDataSource = async () => {
  if (!initialized) {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("TypeORM DataSource initialized");
    }
    initialized = true;
  }
  return AppDataSource;
};
