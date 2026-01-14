// Common API Response
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

// Paginated Response
export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Pagination Query
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// Common ID Params
export interface IdParams {
  id: string;
}
