import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateUserIssue, updateUserIssueStatus } from '@/services/user';
import type { UpdateIssueRequest, UpdateIssueStatusRequest } from '@/types/issues';

export function useUpdateIssue(id: string) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: (data: UpdateIssueRequest) => updateUserIssue(id, data),
    onSuccess: () => {
      // Invalidate user issues list, public issues list, and the detail cache
      queryClient.invalidateQueries({ queryKey: ['user', 'issues'] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issues', 'detail', id] });
    },
    onError: (error) => {
      console.warn('[useUpdateIssue] Mutation failed:', error);
    },
  });

  return { mutate, mutateAsync, isPending, isError, error, isSuccess };
}

export function useUpdateIssueStatus(id: string) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: (data: UpdateIssueStatusRequest) => updateUserIssueStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'issues'] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issues', 'detail', id] });
    },
    onError: (error) => {
      console.warn('[useUpdateIssueStatus] Mutation failed:', error);
    },
  });

  return { mutate, mutateAsync, isPending, isError, error, isSuccess };
}
