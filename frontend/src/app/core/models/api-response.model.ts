export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface LaravelPaginatedData<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: unknown;
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
  search?: string;
  status?: string;
  is_active?: boolean;
  is_available?: boolean;
  page?: number;
  per_page?: number;
}
