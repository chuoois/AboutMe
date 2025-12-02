import mysql, { RowDataPacket } from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
});

// SELECT 
export async function selectQuery<T extends RowDataPacket[]>(sql: string, params: any[] = []): Promise<T> {
  const [rows] = await pool.query<T>(sql, params);
  return rows;
}

// INSERT/UPDATE
export async function executeQuery(sql: string, params: any[] = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}
