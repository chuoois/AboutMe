import { DataSource } from "typeorm";
import { dbOptions } from "@/server/config/orm.config";

export const AppDataSource = new DataSource(dbOptions);