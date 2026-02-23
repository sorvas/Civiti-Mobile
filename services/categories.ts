import type { CategoryResponse } from '@/types/authorities';

import { apiClient } from './api-client';

export function getCategories(): Promise<CategoryResponse[]> {
  return apiClient('/categories', { authenticated: false });
}
