import "reflect-metadata";
import { AppDataSource } from "./data-source";


/**
 * Hàm lấy DataSource, đảm bảo kết nối đã được khởi tạo (Singleton Pattern)
 */
let initializationPromise: Promise<any> | null = null;

/**
 * Singleton pattern để lấy DataSource đã được initialize.
 * Giúp tránh lỗi tạo nhiều kết nối cùng lúc trong Next.js (HMR).
 */
export const getDataSource = async () => {
  if (AppDataSource.isInitialized) return AppDataSource;

  // Kiểm tra biến môi trường
  const requiredEnv = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
  const missingEnv = requiredEnv.filter(env => !process.env[env]);
  
  if (missingEnv.length > 0) {
    console.error("[Database] Missing required environment variables:", missingEnv.join(", "));
  }

  // Chống race condition: Nếu đang init thì đợi cái cũ, không tạo cái mới
  if (!initializationPromise) {
    const startTime = Date.now();
    console.log("[Database] Initializing connection to:", process.env.DB_HOST);
    
    initializationPromise = AppDataSource.initialize()
      .then((ds) => {
        const duration = Date.now() - startTime;
        console.log(`[Database] ✅ Data Source initialized in ${duration}ms`);
        return ds;
      })
      .catch((err) => {
        const duration = Date.now() - startTime;
        console.error(`[Database] ❌ Error during initialization after ${duration}ms:`, err);
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