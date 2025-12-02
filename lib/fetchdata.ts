export async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Lỗi gọi API (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;

  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}