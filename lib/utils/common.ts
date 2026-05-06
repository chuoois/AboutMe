/**
 * Extract error message from unknown error object (Axios or Generic)
 */
export const getErrorMessage = (err: unknown): string => {
  const error = err as { response?: { data?: { message?: string } }; message?: string };
  return error.response?.data?.message || error.message || "An unexpected error occurred";
};

/**
 * Validate required fields in an object
 */
export const validateFields = (data: Record<string, unknown>, fields: string[]): string | null => {
  for (const field of fields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      return `Please fill in the ${field.replace('_', ' ')} field.`;
    }
  }
  return null;
};

/**
 * Common pagination defaults
 */
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
};
