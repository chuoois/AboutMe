import "reflect-metadata";
import { AppDataSource } from "./data-source";


/**
 * Hàm lấy DataSource, đảm bảo kết nối đã được khởi tạo (Singleton Pattern)
 */
let initializationPromise: Promise<any> | null = null;

export const getDataSource = async () => {
  // Kiểm tra biến môi trường
  const requiredEnv = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
  const missingEnv = requiredEnv.filter(env => !process.env[env]);
  
  if (missingEnv.length > 0) {
    console.error("[Database] Missing required environment variables:", missingEnv.join(", "));
  }

  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  // Chống race condition: Nếu đang init thì đợi cái cũ, không tạo cái mới
  if (!initializationPromise) {
    console.log("[Database] Initializing connection to:", process.env.DB_HOST);
    initializationPromise = AppDataSource.initialize()
      .then(() => {
        console.log("[Database] Connection initialized successfully.");
        return AppDataSource;
      })
      .catch((err) => {
        console.error("[Database] Error during Data Source initialization:", err);
        initializationPromise = null; // Reset để có thể thử lại
        throw err;
      });
  }

  return initializationPromise;
};



/**
 * Hàm đóng kết nối (Dùng khi shutdown server hoặc testing)
 */
export const closeDataSource = async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
};