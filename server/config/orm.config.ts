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
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
  ssl: process.env.DB_SSL === "false" ? undefined : {
    rejectUnauthorized: false,
  },
  connectTimeout: 30000, // Tăng lên 30s cho chắc chắn
  extra: {
    connectionLimit: 1, // Trong môi trường Serverless, 1 là đủ và an toàn nhất
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  }
};

