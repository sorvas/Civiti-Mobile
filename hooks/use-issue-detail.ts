import { useQuery } from '@tanstack/react-query';

import { getIssueById } from '@/services/issues';

export function useIssueDetail(id: string) {
  return useQuery({
    queryKey: ['issues', 'detail', id],
    queryFn: () => getIssueById(id),
    enabled: !!id,
  });
}
