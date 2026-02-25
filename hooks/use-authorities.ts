import { useQuery } from '@tanstack/react-query';

import { getAuthorities } from '@/services/authorities';
import type { GetAuthoritiesParams } from '@/types/authorities';

export function useAuthorities(params?: GetAuthoritiesParams) {
  return useQuery({
    queryKey: ['authorities', params],
    queryFn: () => getAuthorities(params),
    staleTime: 5 * 60 * 1000,
    enabled: params?.district != null,
  });
}
