import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createIssue } from '@/services/issues';

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
}
