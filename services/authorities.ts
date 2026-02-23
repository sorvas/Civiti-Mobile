import type { GetAuthoritiesParams } from '@/types/authorities';
import type {
  AuthorityListResponse,
  AuthorityResponse,
} from '@/types/authorities';

import { apiClient } from './api-client';

export function getAuthorities(
  params?: GetAuthoritiesParams,
): Promise<AuthorityListResponse[]> {
  return apiClient('/authorities', { authenticated: false, params: { ...params } });
}

export function getAuthorityById(id: string): Promise<AuthorityResponse> {
  return apiClient(`/authorities/${id}`, { authenticated: false });
}
