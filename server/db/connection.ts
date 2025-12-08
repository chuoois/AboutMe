import { AppDataSource } from "./data-source";

/**
 * Hàm lấy DataSource, đảm bảo kết nối đã được khởi tạo (Singleton Pattern)
 */
export const getDataSource = async () => {
  // Kiểm tra trạng thái có sẵn của TypeORM
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("TypeORM Data Source has been initialized!");
    } catch (err) {
      console.error("Error during Data Source initialization:", err);
      // Có thể throw lỗi để app crash nếu DB không kết nối được (fail-fast)
      throw err;
    }
  }
  return AppDataSource;
};

/**
 * Hàm đóng kết nối (Dùng khi shutdown server hoặc testing)
 */
export const closeDataSource = async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        console.log("TypeORM Data Source has been closed!");
    }
};