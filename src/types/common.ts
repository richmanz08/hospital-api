// Common API Response
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

// Common ID Params
export interface IdParams {
  id: string;
}
