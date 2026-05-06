export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
};

export type PaginationFilters = {
  page?: number;
  limit?: number;
  search?: string;
};
