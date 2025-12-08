// 1. Định nghĩa các phương thức HTTP cho chặt chẽ
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 2. Định nghĩa kiểu cho các tham số truyền vào
interface FetchOptions {
  method?: HttpMethod;
  headers?: Record<string, string>; // Headers là object key-value string
  body?: unknown;                   // Body có thể là bất cứ object nào
}

/**
 * Hàm gọi API Generic
 * @template T - Kiểu dữ liệu mong muốn trả về từ Server
 */
export async function fetchData<T>(
  url: string, 
  { method = 'GET', headers = {}, body }: FetchOptions = {}
): Promise<T> {
  
  try {
    // Cấu hình headers mặc định
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` 
    };

    const config: RequestInit = {
      method,
      headers: { ...defaultHeaders, ...headers },
    };

    // Xử lý body
    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    // Xử lý lỗi HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    // Xử lý trường hợp 204 No Content (thường gặp khi DELETE/PUT)
    if (response.status === 204) {
      return {} as T;
    }

    // Trả về dữ liệu ép kiểu theo Generic T
    return await response.json() as T;

  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}