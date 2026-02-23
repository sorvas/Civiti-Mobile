export type PagedResult<T> = {
  items: T[] | null;
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ApiErrorResponse = {
  error: string;
  requestId?: string;
}

export type PaginationParams = {
  page?: number;
  pageSize?: number;
}

export type SortParams = {
  sortBy?: string;
  sortDescending?: boolean;
}
